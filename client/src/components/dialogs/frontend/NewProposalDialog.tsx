import { Button, TextField, Stack, Autocomplete } from "@mui/material";

import { create } from "zustand";
import BaseDialog from "../BaseDialog";
import { ClientObject, TemplateObject } from "../../../middleware/Interfaces";

interface NewProposalActions {
  name: string;
  description: string;
  clients: ClientObject[];
  owner?: ClientObject | null;
  templates?: TemplateObject[];
  template?: TemplateObject | undefined | null;
  onSubmit:
    | ((
        name: string,
        description: string,
        client_guid: string | undefined,
        template: TemplateObject | null | undefined
      ) => Promise<boolean | undefined>)
    | undefined;
  isExistingProposal?: boolean;
}

interface NewProposalType extends NewProposalActions {
  updateName: (name: string) => void;
  updateDescription: (description: string) => void;
  updateOwner: (owner: ClientObject | null) => void;
  updateTemplate: (template: TemplateObject | null) => void;
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
  templates: [],
  template: undefined,
  onSubmit: undefined,
  isExistingProposal: false,
  updateName: (name) => set(() => ({ name: name })),
  updateDescription: (description) => set(() => ({ description: description })),
  updateOwner: (owner) => set(() => ({ owner: owner })),
  updateTemplate: (template) => set(() => ({ template: template })),
  close: () => set({ onSubmit: undefined }),
}));

const NewProposalDialog = () => {
  const { onSubmit, close, clients, templates, isExistingProposal } =
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

  const [template, updateTemplate] = useProposalDialogStore((state) => [
    state.template,
    state.updateTemplate,
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
          {
            // Only show template selection if not already copying an existing proposal
            !isExistingProposal && (
              <Autocomplete
                sx={{ marginTop: 2 }}
                disablePortal
                id="templates"
                options={templates || []}
                getOptionLabel={(option) => option.name || ""}
                isOptionEqualToValue={(option, value) =>
                  !value || value.guid === "" || option.guid === value.guid
                }
                value={template}
                renderInput={(params) => (
                  <TextField {...params} label="Template" />
                )}
                onChange={(_, value) => {
                  updateTemplate(value);
                }}
              />
            )
          }
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
                owner?.guid,
                template
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
  templates = [],
  template,
  isExistingProposal = false,
  onSubmit,
}: NewProposalActions) => {
  useProposalDialogStore.setState({
    name,
    description,
    owner,
    clients,
    templates,
    template,
    isExistingProposal,
    onSubmit,
  });
};

export default NewProposalDialog;
