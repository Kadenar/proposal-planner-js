import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

const AddNewItem = ({ onClick }: { onClick: () => void }) => {
  return (
    <Stack spacing={1} direction="row" justifyContent="flex-end">
      <Button variant="contained" onClick={onClick}>
        <AddIcon />
        Add new
      </Button>
    </Stack>
  );
};

export default AddNewItem;
