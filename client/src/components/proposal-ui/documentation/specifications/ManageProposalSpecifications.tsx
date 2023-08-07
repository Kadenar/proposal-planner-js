import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../services/store";

import update from "immutability-helper";

import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { AddedSpecificationCard } from "./AddedSpecificationCard";
import {
  ProposalObject,
  ProposalSpec,
} from "../../../../middleware/Interfaces";
import { setProposalSpecifications } from "../../../../services/slices/activeProposalSlice";
import { importSpecificationDialog } from "../../../dialogs/backend/ImportSpecificationsDialog";

interface AddedSpecification {
  guid: string;
  text: string;
}

// This represents the combined view of left (available) & right (added) specifications
export const ManageProposalSpecifications = ({
  activeProposal,
  quoteOption,
}: {
  activeProposal: ProposalObject;
  quoteOption: number;
}) => {
  const dispatch = useAppDispatch();
  const { templates } = useAppSelector((state) => state.templates);

  const specifications = useMemo<ProposalSpec[]>(() => {
    if (!activeProposal) {
      return [];
    }

    return activeProposal.data.quote_options[quoteOption].specifications || [];
  }, [activeProposal, quoteOption]);

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const newSpecs = update(specifications, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, specifications[dragIndex] as AddedSpecification],
        ],
      });

      setProposalSpecifications(dispatch, newSpecs, quoteOption);
    },
    [dispatch, specifications, quoteOption]
  );

  const renderAddedSpecification = useCallback(
    (spec: AddedSpecification, index: number) => {
      return (
        <AddedSpecificationCard
          key={spec.guid}
          index={index}
          moveCard={moveCard}
          specification={spec}
          modifyText={(value) => {
            if (!specifications) {
              return;
            }

            const newRight = [...specifications];
            newRight[index] = {
              ...newRight[index],
              text: value,
            };
            setProposalSpecifications(dispatch, newRight, quoteOption);
          }}
          deleteCard={(idx) => {
            if (!specifications) {
              return;
            }

            const newRight = [...specifications];
            newRight.splice(idx, 1);
            setProposalSpecifications(dispatch, newRight, quoteOption);
          }}
        />
      );
    },
    [dispatch, specifications, moveCard, quoteOption]
  );

  return (
    <>
      <Stack maxHeight="44vh" marginBottom={2} spacing={2}>
        <Typography variant="h6">{`Installation details (${specifications.length})`}</Typography>
        <Stack direction="row" justifyContent="space-between">
          <Button
            variant="contained"
            onClick={() => {
              const newSpecs = specifications ? [...specifications] : [];

              setProposalSpecifications(
                dispatch,
                newSpecs.concat({ guid: crypto.randomUUID(), text: "" }),
                quoteOption
              );
            }}
          >
            Add install detail
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              importSpecificationDialog({
                templates,
                template: null,
                onSubmit: (specificationsToImport) => {
                  let newSpecs = specifications ? [...specifications] : [];

                  specificationsToImport.forEach((spec) => {
                    newSpecs = newSpecs.concat({
                      guid: crypto.randomUUID(),
                      text: spec.modifiedText,
                    });
                  });

                  setProposalSpecifications(dispatch, newSpecs, quoteOption);
                },
              });
            }}
          >
            Import install detail
          </Button>
        </Stack>
        <Card
          sx={{
            flexGrow: 1,
            padding: 1,
            overflowY: "auto",
            border: "1px solid",
          }}
        >
          <DndProvider backend={HTML5Backend}>
            {specifications && specifications.length > 0 ? (
              specifications.map((spec, index) => {
                return renderAddedSpecification(spec, index);
              })
            ) : (
              <Stack height="100%" alignItems="center">
                <Typography variant="h5">
                  No specifications added yet
                </Typography>
              </Stack>
            )}
          </DndProvider>
        </Card>
      </Stack>
    </>
  );
};
