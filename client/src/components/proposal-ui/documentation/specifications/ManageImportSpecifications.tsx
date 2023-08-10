import { useState, useEffect, useCallback, useMemo } from "react";

import update from "immutability-helper";

import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { AddedSpecificationCard } from "./AddedSpecificationCard";
import { AvailableSpecificationCard } from "./AvailableSpecificationCards";
import {
  TemplateObject,
  AddedSpecification,
  AvailableSpecification,
} from "../../../../middleware/Interfaces";

// This represents the combined view of left (available) & right (added) specifications
export const ManageImportSpecifications = ({
  selectedTemplate,
  quoteOption,
  onChangeCallback,
}: {
  selectedTemplate: TemplateObject;
  quoteOption: number;
  onChangeCallback: (newRight: AddedSpecification[]) => void;
}) => {
  const [left, setLeft] = useState<AvailableSpecification[] | undefined>([]);

  const quote_options = selectedTemplate.data.quote_options;

  const handleUpdateAdded = useCallback(
    (newRight: AddedSpecification[]) => {
      setRight(newRight);
      onChangeCallback(newRight);
    },
    [onChangeCallback]
  );

  // Grab all specifications for the current quote option
  const allLeft = useMemo(() => {
    return quote_options[quoteOption].specifications.map((spec) => {
      return { guid: spec.guid, text: spec.text, checked: false };
    });
  }, [quote_options, quoteOption]);

  const [right, setRight] = useState<AddedSpecification[] | undefined>([]);

  // Run on initial load to default the selected product type due to useSelector and useEffect issues (really just a workaround)
  useEffect(() => {
    const initialLeft = quote_options[quoteOption]?.specifications?.map(
      (spec) => {
        return { guid: spec.guid, text: spec.text, checked: false };
      }
    );

    const intersectedLeft = intersection(initialLeft || [], right || []);
    setLeft(intersectedLeft);
    // Only want to trigger this when the quote option changes / on initial load of the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quoteOption, quote_options]);

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

      handleUpdateAdded(newRight);
    },
    [right, handleUpdateAdded]
  );

  const renderAvailableSpecification = useCallback(
    (index: number, spec: AvailableSpecification) => {
      return (
        <AvailableSpecificationCard
          key={spec.guid}
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
          specification={{
            guid: spec.guid,
            text: spec.modifiedText,
          }}
          modifyText={(value) => {
            if (!right) {
              return;
            }

            const newRight = [...right];
            newRight[index] = {
              ...newRight[index],
              modifiedText: value,
            };
            handleUpdateAdded(newRight);
          }}
          deleteCard={(idx) => {
            if (!right) {
              return;
            }

            const newRight = [...right];
            const elementRemoved = newRight.splice(idx, 1);
            handleUpdateAdded(newRight);

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
    [allLeft, right, moveCard, handleUpdateAdded]
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
            maxWidth: "45vw",
            flexGrow: 1,
            padding: 2,
            overflowY: "auto",
            border: "1px solid",
          }}
        >
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
                    return {
                      guid: spec.guid,
                      originalText: spec.text,
                      modifiedText: spec.text,
                    };
                  });

                // Add what was selected to the right
                handleUpdateAdded((right || []).concat(specsAdded));

                // Remove what was added from the left
                const specsRemaining = left.filter(
                  (_, index) => !left[index].checked
                );
                setLeft(specsRemaining);
              }}
            >
              Add selected
            </Button>
          ) : (
            <Stack height="80%" justifyContent="center" alignItems="center">
              <Typography variant="h5">
                No details left to import from quote
              </Typography>
            </Stack>
          )}
        </Card>
        <Card
          sx={{
            minWidth: "45vw",
            maxWidth: "45vw",
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
                <Typography variant="h5">No details added yet</Typography>
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
