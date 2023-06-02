import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import { create } from "zustand";
import { StyledBootstrapDialog } from "../StyledComponents";
const useScalarValueStore = create((set) => ({
  header: "",
  value: "",
  onSubmit: undefined,
  updateValue: (value) => set(() => ({ value: value })),
  close: () => set({ onSubmit: undefined }),
}));

const AddScalarValueDialog = () => {
  const { onSubmit, close } = useScalarValueStore();

  const [value, updateValue] = useScalarValueStore((state) => [
    state.value,
    state.updateValue,
  ]);

  return (
    <>
      <StyledBootstrapDialog
        PaperProps={{
          style: {
            minWidth: "300px",
            maxWidth: "700px",
            width: "50vw",
          },
        }}
        open={Boolean(onSubmit)}
        onClose={close}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add product type</DialogTitle>
        <DialogContent>
          <div style={{ paddingTop: "5px" }}>
            <Stack spacing={2}>
              <TextField
                label="Product type"
                value={value}
                onChange={({ target: { value } }) => {
                  updateValue(value);
                }}
                autoFocus
              />
            </Stack>
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" variant="contained" onClick={close}>
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={async () => {
              if (!onSubmit) {
                close();
              }

              const returnValue = await onSubmit(value);
              if (returnValue) {
                close();
              }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </StyledBootstrapDialog>
    </>
  );
};

export const addScalarValueDialog = (header, value, onSubmit) => {
  useScalarValueStore.setState({
    header,
    value,
    onSubmit,
  });
};

export default AddScalarValueDialog;
