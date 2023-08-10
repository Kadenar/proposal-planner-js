import { Button, Checkbox, FormControlLabel, Stack } from "@mui/material";
import { create } from "zustand";
import BaseDialog from "../BaseDialog";

interface SoldJobDialogActions {
  commissionReceived: boolean;
  jobCompleted: boolean;
  onSubmit:
    | ((
        commissionReceived: boolean,
        jobCompleted: boolean
      ) => Promise<boolean | undefined>)
    | undefined;
}

interface SoldJobDialogType extends SoldJobDialogActions {
  updateCommissionReceived: (commissionReceived: boolean) => void;
  updateJobCompleted: (jobCompleted: boolean) => void;
  close: () => void;
}

const useSoldJobDialogStore = create<SoldJobDialogType>((set) => ({
  commissionReceived: false,
  jobCompleted: false,
  updateCommissionReceived: (commissionReceived) =>
    set(() => ({ commissionReceived: commissionReceived })),
  updateJobCompleted: (jobCompleted) =>
    set(() => ({ jobCompleted: jobCompleted })),
  onSubmit: undefined,
  close: () => set({ onSubmit: undefined }),
}));

const EditSoldJobDialog = () => {
  const { onSubmit, close } = useSoldJobDialogStore();

  const [commissionReceived, updateCommissionReceived] = useSoldJobDialogStore(
    (state) => [state.commissionReceived, state.updateCommissionReceived]
  );

  const [jobCompleted, updateJobCompleted] = useSoldJobDialogStore((state) => [
    state.jobCompleted,
    state.updateJobCompleted,
  ]);

  return (
    <BaseDialog
      title={"Update job details"}
      content={
        <div style={{ paddingTop: "5px" }}>
          <Stack spacing={2}>
            <FormControlLabel
              label="Commission Received?"
              control={
                <Checkbox
                  checked={commissionReceived}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    updateCommissionReceived(event.target.checked);

                    if (event.target.checked) {
                      updateJobCompleted(true);
                    }
                  }}
                />
              }
            />

            <FormControlLabel
              label="Job completed?"
              control={
                <Checkbox
                  checked={jobCompleted}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    updateJobCompleted(event.target.checked)
                  }
                />
              }
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

              const returnValue = await onSubmit(
                jobCompleted,
                commissionReceived
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

export const editSoldJobDialog = ({
  commissionReceived,
  jobCompleted,
  onSubmit,
}: SoldJobDialogActions) => {
  useSoldJobDialogStore.setState({
    commissionReceived,
    jobCompleted,
    onSubmit,
  });
};

export default EditSoldJobDialog;
