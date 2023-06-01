import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";
import { Stack } from "@mui/material";
import { TextField } from "@material-ui/core";
import { create } from "zustand";
import { StyledBootstrapDialog } from "../StyledComponents";

const useProposalDialogStore = create((set) => ({
  onSubmit: undefined,
  name: "",
  description: "",
  updateName: (name) => set(() => ({ name: name })),
  updateDescription: (description) => set(() => ({ description: description })),
  close: () => set({ onSubmit: undefined }),
}));

const NewProposalDialog = () => {
  const { onSubmit, close } = useProposalDialogStore();

  const [name, updateName] = useProposalDialogStore((state) => [
    state.name,
    state.updateName,
  ]);

  const [description, updateDescription] = useProposalDialogStore((state) => [
    state.description,
    state.updateDescription,
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
        <DialogTitle>Create a new proposal</DialogTitle>
        <DialogContent>
          <div style={{ paddingTop: "5px" }}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                value={name}
                onChange={({ target: { value } }) => {
                  updateName(value);
                }}
              />
              <TextField
                label="Description"
                value={description}
                onChange={({ target: { value } }) => {
                  updateDescription(value);
                }}
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
                return;
              }

              const returnValue = await onSubmit(name, description);

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

export const newProposalDialog = ({ name, description, onSubmit }) => {
  useProposalDialogStore.setState({
    name,
    description,
    onSubmit,
  });
};

export default NewProposalDialog;
