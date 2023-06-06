import { Button, Stack, TextField } from "@mui/material";
import { create } from "zustand";
import BaseDialog from "../BaseDialog";

const useScalarValueStore = create((set) => ({
  header: "",
  value: "",
  onSubmit: undefined,
  updateValue: (value) => set(() => ({ value: value })),
  close: () => set({ onSubmit: undefined }),
}));

const AddScalarValueDialog = () => {
  const { onSubmit, close, header } = useScalarValueStore();

  const [value, updateValue] = useScalarValueStore((state) => [
    state.value,
    state.updateValue,
  ]);

  return (
    <BaseDialog
      title={header}
      content={
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
      }
      actions={
        <>
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
        </>
      }
      show={Boolean(onSubmit)}
      close={close}
    />
  );
};

export const addScalarValueDialog = ({ header, value, onSubmit }) => {
  useScalarValueStore.setState({
    header,
    value,
    onSubmit,
  });
};

export default AddScalarValueDialog;
