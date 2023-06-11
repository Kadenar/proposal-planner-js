import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import update from "immutability-helper";

import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { AddedSpecificationCard } from "./AddedSpecificationCard";
import { AvailableSpecificationCard } from "./AvailableSpecificationCards";
import {
  ProductTypeObject,
  ReduxStore,
} from "../../../../data-management/middleware/Interfaces";
import { setProposalSpecifications } from "../../../../data-management/store/slices/selectedProposalSlice";
import { useAppDispatch } from "../../../../data-management/store/store";

interface AvailableSpecification {
  text: string;
  checked: boolean;
}

interface AddedSpecification {
  originalText: string;
  modifiedText: string;
}

// This represents the combined view of left (available) & right (added) specifications
export const ManageProposalSpecifications = () => {
  const dispatch = useAppDispatch();

  const [left, setLeft] = useState<AvailableSpecification[] | undefined>([]);

  const { filters } = useSelector((state: ReduxStore) => state.filters);

  const [selectedProductType, setSelectedProductType] = useState<
    ProductTypeObject | null | undefined
  >(filters[0]);

  const { selectedProposal } = useSelector(
    (state: ReduxStore) => state.selectedProposal
  );

  const allLeft = selectedProductType?.specifications?.map((spec) => {
    return { text: spec, checked: false };
  });

  const right = selectedProposal?.data.specifications;

  useEffect(() => {
    setSelectedProductType(filters[0]);

    const initialLeft = filters[0]?.specifications?.map((spec) => {
      return { text: spec, checked: false };
    });

    const intersectedLeft = intersection(initialLeft || [], right || []);
    setLeft(intersectedLeft);
  }, [filters, right, setLeft]);

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

      setProposalSpecifications(dispatch, newRight);
    },
    [dispatch, right]
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
            newRight[index].modifiedText = value;
            setProposalSpecifications(dispatch, newRight);
          }}
          deleteCard={(idx) => {
            if (!right) {
              return;
            }

            const newRight = [...right];
            const elementRemoved = newRight.splice(idx, 1);
            setProposalSpecifications(dispatch, newRight);

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
    [dispatch, allLeft, right, moveCard]
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

  return (
    <>
      <Typography variant="h5">Specifications</Typography>

      <Stack
        maxHeight="50vh"
        minHeight="50vh"
        minWidth="90vw"
        direction="row"
        margin={2}
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
          <Autocomplete
            disablePortal
            id="filters"
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.guid === value.guid}
            options={filters}
            value={selectedProductType}
            renderInput={(params) => (
              <div ref={params.InputProps.ref}>
                <TextField {...params} label="Product type" />
              </div>
            )}
            onChange={(_, value) => {
              setSelectedProductType(value);

              // Update left to be the specifications available for the chosen product type
              if (value) {
                const newLeft = value?.specifications?.map((spec) => {
                  return { text: spec, checked: false };
                });

                const intersectedLeft = intersection(
                  newLeft || [],
                  right || []
                );
                setLeft(intersectedLeft);
              }
            }}
          />
          {left?.map((spec, index) => {
            return renderAvailableSpecification(index, spec);
          })}
          {!left || left?.length > 0 ? (
            <Button
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
                  (right || []).concat(specsAdded)
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
            <Stack
              height={"80%"}
              justifyContent={"center"}
              alignItems={"center"}
            >
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
              <Stack
                height={"100%"}
                justifyContent={"center"}
                alignItems={"center"}
              >
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
