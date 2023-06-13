import { Button, Stack, TextField } from "@mui/material";
import { create } from "zustand";
import BaseDialog from "../BaseDialog";

interface LaborStoreActions {
  header: string;
  name: string;
  qty: number;
  cost: number;
  onSubmit:
    | ((
        name: string,
        qty: number,
        cost: number
      ) => Promise<boolean | undefined>)
    | undefined;
}

interface LaborStoreType extends LaborStoreActions {
  updateName: (name: string) => void;
  updateQty: (qty: number) => void;
  updateCost: (cost: number) => void;
  close: () => void;
}

const useLaborStore = create<LaborStoreType>((set) => ({
  header: "",
  name: "",
  qty: 0,
  cost: 0,
  onSubmit: undefined,
  updateName: (name) => set(() => ({ name: name })),
  updateQty: (qty) => set(() => ({ qty: qty })),
  updateCost: (cost) => set(() => ({ cost: cost })),
  close: () => set({ onSubmit: undefined }),
}));

const LaborDialog = () => {
  const { header, onSubmit, close } = useLaborStore();

  const [name, updateName] = useLaborStore((state) => [
    state.name,
    state.updateName,
  ]);

  const [qty, updateQty] = useLaborStore((state) => [
    state.qty,
    state.updateQty,
  ]);

  const [cost, updateCost] = useLaborStore((state) => [
    state.cost,
    state.updateCost,
  ]);

  return (
    <BaseDialog
      title={header}
      content={
        <div style={{ paddingTop: "5px" }}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => {
                updateName(e.target.value);
              }}
            />
            <TextField
              label="Quantity"
              value={qty}
              type="number"
              onChange={(e) => {
                updateQty(Number(e.target.value));
              }}
            />
            <TextField
              label="Cost"
              value={cost}
              type="number"
              onChange={(e) => {
                updateCost(Number(e.target.value));
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

              const isValid = await onSubmit(name, qty, cost);

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

export const laborDialog = ({
  header,
  name,
  qty,
  cost,
  onSubmit,
}: LaborStoreActions) => {
  useLaborStore.setState({
    header,
    name,
    qty,
    cost,
    onSubmit,
  });
};

export default LaborDialog;
