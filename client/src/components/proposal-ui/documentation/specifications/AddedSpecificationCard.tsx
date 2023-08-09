import type { Identifier, XYCoord } from "dnd-core";
import type { FC } from "react";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { StyledTextarea } from "../../../StyledComponents";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { ProposalSpec } from "../../../../middleware/Interfaces";

const style = {
  border: "1px dashed gray",
  padding: "0.5rem 0.5rem",
  marginBottom: ".85rem",
  cursor: "move",
  transform: "translate3d(0, 0, 0)", // This is a workaround to Chrome bug issue = https://github.com/react-dnd/react-dnd/issues/832
};

export interface SpecificationProps {
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  deleteCard: (idx: number) => void;
  modifyText: (value: string) => void;
  specification: ProposalSpec;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const ItemTypes = {
  SPECIFICATIONS: "specifications",
};

export const AddedSpecificationCard: FC<SpecificationProps> = ({
  index,
  moveCard,
  modifyText,
  deleteCard,
  specification,
}) => {
  const dragRef = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.SPECIFICATIONS,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!dragRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = dragRef.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SPECIFICATIONS,
    item: () => {
      return { specification, index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(dragRef));

  return (
    <Stack
      direction="row"
      alignItems="center"
      ref={dragRef}
      style={{ ...style, opacity }}
      data-handler-id={handlerId}
    >
      <DragIndicatorIcon />
      <Typography>{`${index + 1}.`}</Typography>
      <StyledTextarea
        placeholder={
          "Enter some text to describe what will be done for this job"
        }
        sx={{ flexGrow: 1, margin: "0 15px 0 15px" }}
        minRows={1}
        maxRows={3}
        value={specification.text}
        onChange={({ target: { value } }) => {
          modifyText(value);
        }}
      />
      <Tooltip title="Remove specification">
        <IconButton onClick={() => deleteCard(index)}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
