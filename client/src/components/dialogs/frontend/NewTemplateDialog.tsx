import { Button, TextField, Stack } from "@mui/material";

import { create } from "zustand";
import BaseDialog from "../BaseDialog";

interface NewTemplateActions {
  name: string;
  description: string;
  onSubmit:
    | ((name: string, description: string) => Promise<boolean | undefined>)
    | undefined;
  isExistingTemplate: boolean;
}

interface NewTemplateType extends NewTemplateActions {
  updateName: (name: string) => void;
  updateDescription: (description: string) => void;
  close: () => void;
}

const useProposalDialogStore = create<NewTemplateType>((set) => ({
  name: "",
  description: "",
  onSubmit: undefined,
  isExistingTemplate: false,
  updateName: (name) => set(() => ({ name: name })),
  updateDescription: (description) => set(() => ({ description: description })),
  close: () => set({ onSubmit: undefined }),
}));

const NewTemplateDialog = () => {
  const { onSubmit, close, isExistingTemplate } = useProposalDialogStore();

  const [name, updateName] = useProposalDialogStore((state) => [
    state.name,
    state.updateName,
  ]);

  const [description, updateDescription] = useProposalDialogStore((state) => [
    state.description,
    state.updateDescription,
  ]);

  return (
    <BaseDialog
      title={isExistingTemplate ? "Copy template" : "Create a new template"}
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

              const returnValue = await onSubmit(name, description);

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

export const newTemplateDialog = ({
  name = "",
  description = "",
  isExistingTemplate = false,
  onSubmit,
}: NewTemplateActions) => {
  useProposalDialogStore.setState({
    name,
    description,
    isExistingTemplate,
    onSubmit,
  });
};

export default NewTemplateDialog;
