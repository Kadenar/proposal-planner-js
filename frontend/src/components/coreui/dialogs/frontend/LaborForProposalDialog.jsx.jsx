import { Button, Stack } from "@mui/material";
import { create } from "zustand";
import BaseDialog from "../BaseDialog";
import { useCallback } from "react";

const useLaborStore = create((set) => ({
  labors: [],
  onSubmit: undefined,
  updateProductType: (productType) => set(() => ({ productType: productType })),
  close: () => set({ onSubmit: undefined }),
}));

const EditLaborDialog = () => {
  const { onSubmit, close, labors } = useLaborStore();

  const content = useCallback(() => {
    return (
      <div style={{ paddingTop: "5px" }}>
        <Stack spacing={2}>{/* TODO */}</Stack>
      </div>
    );
  }, [labors]);

  const actions = useCallback(() => {
    return (
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

            const isValid = await onSubmit(labors);

            if (isValid) {
              close();
            }
          }}
        >
          Confirm
        </Button>
      </>
    );
  }, [labors, close, onSubmit]);

  return (
    <BaseDialog
      title="Edit labor"
      content={content}
      actions={actions}
      show={Boolean(onSubmit)}
      close={close}
    />
  );
};

export const editLaborDialog = ({ labors, onSubmit }) => {
  useLaborStore.setState({
    labors,
    onSubmit,
  });
};

export default EditLaborDialog;
