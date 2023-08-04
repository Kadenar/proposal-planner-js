import { useState, useEffect, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../services/store";

import update from "immutability-helper";

import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { AddedSpecificationCard } from "./AddedSpecificationCard";
import { AvailableSpecificationCard } from "./AvailableSpecificationCards";
import {
  ProductTypeObject,
  ProposalObject,
  ProposalSpec,
} from "../../../../middleware/Interfaces";
import { setProposalSpecifications } from "../../../../services/slices/activeProposalSlice";
import { MenuItem } from "@mui/material";

interface AvailableSpecification {
  text: string;
  checked: boolean;
}

interface AddedSpecification {
  originalText: string;
  modifiedText: string;
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
  const { filters } = useAppSelector((state) => state.filters);

  const [selectedProductType, setSelectedProductType] = useState<
    ProductTypeObject | undefined
  >(filters[0]);

  const [left, setLeft] = useState<AvailableSpecification[] | undefined>([]);

  const allLeft = selectedProductType?.specifications?.map((spec) => {
    return { text: spec, checked: false };
  });

  const right = useMemo<ProposalSpec[]>(() => {
    if (!activeProposal) {
      return [];
    }

    return activeProposal.data.quote_options[quoteOption].specifications || [];
  }, [activeProposal, quoteOption]);

  // Run on initial load to default the selected product type due to useSelector and useEffect issues (really just a workaround)
  useEffect(() => {
    const initialLeft = filters[0]?.specifications?.map((spec) => {
      return { text: spec, checked: false };
    });

    const intersectedLeft = intersection(initialLeft || [], right || []);
    setLeft(intersectedLeft);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteOption]); // Only want to trigger this when the quote option changes / on initial load of the page

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (!right) {
        return;
      }

      const newRight = update(right, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, right[dragIndex] as AddedSpecification],
        ],
      });

      setProposalSpecifications(dispatch, newRight, quoteOption);
    },
    [dispatch, right, quoteOption]
  );

  const renderAvailableSpecification = useCallback(
    (index: number, spec: AvailableSpecification) => {
      return (
        <AvailableSpecificationCard
          index={index}
          text={spec.text}
          isChecked={spec.checked}
          handleSelect={(mark_checked) => {
            if (!left) {
              return;
            }

            const newLeft = [...left];
            newLeft[index].checked = mark_checked;
            setLeft(newLeft);
          }}
        />
      );
    },
    [left]
  );

  const renderAddedSpecification = useCallback(
    (spec: AddedSpecification, index: number) => {
      return (
        <AddedSpecificationCard
          key={spec.originalText}
          index={index}
          moveCard={moveCard}
          specification={spec}
          modifyText={(value) => {
            if (!right) {
              return;
            }

            const newRight = [...right];
            newRight[index] = {
              ...newRight[index],
              modifiedText: value,
            };
            setProposalSpecifications(dispatch, newRight, quoteOption);
          }}
          deleteCard={(idx) => {
            if (!right) {
              return;
            }

            const newRight = [...right];
            const elementRemoved = newRight.splice(idx, 1);
            setProposalSpecifications(dispatch, newRight, quoteOption);

            // Only update the left side if we are still on the same product type
            if (
              allLeft?.find(
                (spec) => spec.text === elementRemoved[0].originalText
              )
            ) {
              setLeft(intersection(allLeft || [], newRight));
            }
          }}
        />
      );
    },
    [dispatch, allLeft, right, moveCard, quoteOption]
  );

  return (
    <>
      <Stack
        maxHeight="50vh"
        minHeight="50vh"
        minWidth="90vw"
        direction="row"
        marginRight={2}
        marginBottom={2}
        spacing={2}
      >
        <Card
          sx={{
            minWidth: "50%",
            maxWidth: "50vw",
            flexGrow: 1,
            padding: 5,
            overflowY: "auto",
            border: "1px solid",
          }}
        >
          <TextField
            fullWidth
            id="select"
            label="Quote option"
            value={selectedProductType?.guid}
            onChange={({ target: { value } }) => {
              const matchingProductType = filters.find(
                (type) => type.guid === value
              );

              setSelectedProductType(matchingProductType);

              // Update left to be the specifications available for the chosen product type
              if (value) {
                const newLeft = matchingProductType?.specifications?.map(
                  (spec) => {
                    return { text: spec, checked: false };
                  }
                );

                const intersectedLeft = intersection(
                  newLeft || [],
                  right || []
                );
                setLeft(intersectedLeft);
              }
            }}
            select
          >
            {filters.map((filter) => {
              const filterSpecLength = filter.specifications?.length || 0;
              const filterLabel =
                filterSpecLength === 1
                  ? `${filter.label} (${filterSpecLength} specification)`
                  : `${filter.label} (${filterSpecLength} specifications)`;

              return (
                <MenuItem key={filter.guid} value={filter.guid}>
                  {filterLabel}
                </MenuItem>
              );
            })}
          </TextField>
          {left?.map((spec, index) => {
            return renderAvailableSpecification(index, spec);
          })}
          {!left || left?.length > 0 ? (
            <Button
              sx={{ marginTop: 2 }}
              variant="outlined"
              onClick={() => {
                if (!left) {
                  return;
                }

                const specsAdded = left
                  .filter((_, index) => left[index].checked)
                  .map((spec) => {
                    return { originalText: spec.text, modifiedText: spec.text };
                  });

                // Add what was selected to the right
                setProposalSpecifications(
                  dispatch,
                  (right || []).concat(specsAdded),
                  quoteOption
                );

                // Remove what was added from the left
                const specsRemaining = left.filter(
                  (_, index) => !left[index].checked
                );
                setLeft(specsRemaining);
              }}
            >
              Add to proposal
            </Button>
          ) : (
            <Stack height="80%" justifyContent="center" alignItems="center">
              <Typography variant="h5">
                No specifications left to add
              </Typography>
            </Stack>
          )}
        </Card>
        <Card
          sx={{
            minWidth: "50%",
            maxWidth: "50vw",
            flexGrow: 1,
            padding: 1,
            overflowY: "auto",
            border: "1px solid",
          }}
        >
          <DndProvider backend={HTML5Backend}>
            {right && right.length > 0 ? (
              right.map((spec, index) => {
                return renderAddedSpecification(spec, index);
              })
            ) : (
              <Stack height="100%" justifyContent="center" alignItems="center">
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

function intersection(
  availableSpecs: AvailableSpecification[],
  addedSpecs: AddedSpecification[],
  isUnion = false
) {
  return availableSpecs?.filter(
    (
      (set) => (a: AvailableSpecification) =>
        isUnion === set.has(a.text)
    )(new Set(addedSpecs.map((b: AddedSpecification) => b.originalText)))
  );
}
