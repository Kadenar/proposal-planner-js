import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Autocomplete,
} from "@mui/material";

import { create } from "zustand";
import { StyledBootstrapDialog } from "../StyledComponents";

const useProposalDialogStore = create((set) => ({
  name: "",
  description: "",
  owner: {},
  clients: [],
  onSubmit: undefined,
  isExistingProposal: false,
  updateName: (name) => set(() => ({ name: name })),
  updateDescription: (description) => set(() => ({ description: description })),
  updateOwner: (owner) => set(() => ({ owner: owner })),
  close: () => set({ onSubmit: undefined }),
}));

const NewProposalDialog = () => {
  const { onSubmit, close, clients, isExistingProposal } =
    useProposalDialogStore();

  const [name, updateName] = useProposalDialogStore((state) => [
    state.name,
    state.updateName,
  ]);

  const [description, updateDescription] = useProposalDialogStore((state) => [
    state.description,
    state.updateDescription,
  ]);

  const [owner, updateOwner] = useProposalDialogStore((state) => [
    state.owner,
    state.updateOwner,
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
        <DialogTitle>
          {isExistingProposal ? "Copy proposal" : "Create a new proposal"}
        </DialogTitle>
        <DialogContent>
          <div style={{ paddingTop: "5px", minHeight: "50vh" }}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                value={name}
                onChange={({ target: { value } }) => {
                  updateName(value);
                }}
                autoFocus
              />
              <TextField
                label="Description"
                value={description}
                onChange={({ target: { value } }) => {
                  updateDescription(value);
                }}
              />
            </Stack>
            <Autocomplete
              sx={{ marginTop: 2 }}
              disablePortal
              id="filters"
              options={clients}
              getOptionLabel={(option) => option.name || ""}
              // getOptionSelected={(option, value) => {
              //   return option.guid === value.guid;
              // }}
              isOptionEqualToValue={(option, value) =>
                option.guid === value.guid
              }
              value={owner}
              renderInput={(params) => <TextField {...params} label="Client" />}
              onChange={(event, value) => {
                updateOwner(value);
              }}
            />
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

              const returnValue = await onSubmit(name, description, owner.guid);

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

export const newProposalDialog = ({
  name = "",
  description = "",
  owner = {},
  clients = [],
  isExistingProposal = false,
  onSubmit,
}) => {
  useProposalDialogStore.setState({
    name,
    description,
    owner,
    clients,
    isExistingProposal,
    onSubmit,
  });
};

export default NewProposalDialog;
