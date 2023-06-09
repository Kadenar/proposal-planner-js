import { Button, TextField, Stack, Autocomplete } from "@mui/material";

import { create } from "zustand";
import BaseDialog from "../BaseDialog";
import { ClientObject } from "../../../../data-management/middleware/Interfaces";

interface NewProposalActions {
  name: string;
  description: string;
  clients: ClientObject[];
  owner: ClientObject | null;
  onSubmit:
    | ((
        name: string,
        description: string,
        client_guid: string | undefined
      ) => Promise<boolean | undefined>)
    | undefined;
  isExistingProposal: boolean;
}

interface NewProposalType extends NewProposalActions {
  updateName: (name: string) => void;
  updateDescription: (description: string) => void;
  updateOwner: (owner: ClientObject | null) => void;
  close: () => void;
}

const useProposalDialogStore = create<NewProposalType>((set) => ({
  name: "",
  description: "",
  owner: {
    guid: "",
    name: "",
    address: "",
    state: "",
    city: "",
    zip: "",
  },
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
    <BaseDialog
      title={isExistingProposal ? "Copy proposal" : "Create a new proposal"}
      content={
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
            isOptionEqualToValue={(option, value) =>
              !value || value.guid === "" || option.guid === value.guid
            }
            value={owner}
            renderInput={(params) => <TextField {...params} label="Client" />}
            onChange={(_, value) => {
              updateOwner(value);
            }}
          />
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
                return;
              }

              const returnValue = await onSubmit(
                name,
                description,
                owner?.guid
              );

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

export const newProposalDialog = ({
  name = "",
  description = "",
  owner = {
    guid: "",
    name: "",
    address: "",
    state: "",
    city: "",
    zip: "",
  },
  clients = [],
  isExistingProposal = false,
  onSubmit,
}: NewProposalActions) => {
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
