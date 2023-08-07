import { create } from "zustand";
import { Button, TextField } from "@mui/material";
import Stack from "@mui/material/Stack";

import BaseDialog from "../BaseDialog";
import { FeeOnProposal } from "../../../middleware/Interfaces";

interface FeeBreakdown {
  guid: string;
  name: string;
  qty: number;
  cost: number;
  type: string;
}

interface FeesStoreActions {
  fees: FeeBreakdown[] | undefined;
  onSubmit:
    | ((fees: FeeOnProposal[] | undefined) => Promise<boolean | undefined>)
    | undefined;
}

interface FeesStoreType extends FeesStoreActions {
  setFees: (fees: FeeBreakdown[]) => void;
  close: () => void;
}
const useFeesStore = create<FeesStoreType>((set) => ({
  fees: [],
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
          {fees &&
            fees.map((fee, index) => {
              return (
                <TextField
                  key={`${fee.name + "-input"}`}
                  id={`${fee.name + "-input"}`}
                  label={fees[index].name}
                  variant="outlined"
                  value={fees[index].cost}
                  InputProps={{ inputProps: { min: 0 } }}
                  onChange={(e) => {
                    const newFees = [...fees];
                    newFees[index] = {
                      ...newFees[index],
                      cost: Number(e.target.value),
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

              const newFees = fees?.map((fee) => {
                return {
                  guid: fee.guid,
                  cost: fee.cost,
                };
              });

              const isValid = await onSubmit(newFees);

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

export const feesDialog = ({ fees = [], onSubmit }: FeesStoreActions) => {
  useFeesStore.setState({
    fees,
    onSubmit,
  });
};

export default FeesDialog;
