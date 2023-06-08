import { create } from "zustand";
import { Button, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";

import BaseDialog from "../BaseDialog";

const useFeesStore = create((set) => ({
  fees: {},
  onSubmit: undefined,
  setFees: (fees) => set(() => ({ fees: fees })),
  close: () => set({ onSubmit: undefined }),
}));

const FeesDialog = () => {
  const { onSubmit, close } = useFeesStore();

  const [fees, setFees] = useFeesStore((state) => [state.fees, state.setFees]);

  return (
    <BaseDialog
      title="Configure fees"
      content={
        <Stack paddingTop={3} spacing={2}>
          {Object.keys(fees).map((fee, index) => {
            return (
              <TextField
                id={`${fees[fee].name + "-input"}`}
                label={fees[fee].name}
                variant="outlined"
                value={fees[fee].cost}
                InputProps={{ inputProps: { min: 0 } }}
                onChange={(e) => {
                  const newFees = {
                    ...fees,
                  };
                  newFees[fee] = {
                    ...newFees[fee],
                    cost: e.target.value,
                  };
                  setFees(newFees);
                }}
                type="number"
              />
            );
          })}
        </Stack>
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

              const isValid = await onSubmit(fees);

              if (isValid) {
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

export const feesDialog = ({ fees = [], onSubmit }) => {
  useFeesStore.setState({
    fees,
    onSubmit,
  });
};

export default FeesDialog;
