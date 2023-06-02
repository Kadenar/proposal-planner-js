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
  selectedClient: {},
  allClients: [],
  onSubmit: undefined,
  updateName: (name) => set(() => ({ name: name })),
  updateDescription: (description) => set(() => ({ description: description })),
  updateSelectedClient: (selectedClient) =>
    set(() => ({ selectedClient: selectedClient })),
  close: () => set({ onSubmit: undefined }),
}));

const NewProposalDialog = () => {
  const { onSubmit, close, allClients } = useProposalDialogStore();

  const [name, updateName] = useProposalDialogStore((state) => [
    state.name,
    state.updateName,
  ]);

  const [description, updateDescription] = useProposalDialogStore((state) => [
    state.description,
    state.updateDescription,
  ]);

  const [selectedClient, updateSelectedClient] = useProposalDialogStore(
    (state) => [state.selectedClient, state.updateSelectedClient]
  );

  console.log(allClients);

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
              options={allClients}
              getOptionLabel={(option) => option.name || ""}
              getOptionSelected={(option, value) => {
                return option.guid === value.guid;
              }}
              value={selectedClient}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <TextField {...params} label="Client" />
                </div>
              )}
              onChange={(event, value) => {
                updateSelectedClient(value);
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

              const returnValue = await onSubmit(
                name,
                description,
                selectedClient.name
              );

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
  selectedClient = {},
  allClients = [],
  onSubmit,
}) => {
  useProposalDialogStore.setState({
    name,
    description,
    selectedClient,
    allClients,
    onSubmit,
  });
};

export default NewProposalDialog;
