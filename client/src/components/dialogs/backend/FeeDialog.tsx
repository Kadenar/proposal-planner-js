import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { create } from "zustand";
import BaseDialog from "../BaseDialog";

interface FeeStoreActions {
  header: string;
  name: string;
  qty: number;
  cost: number;
  type: string;
  onSubmit:
    | ((
        name: string,
        qty: number,
        cost: number,
        type: string
      ) => Promise<boolean | undefined>)
    | undefined;
}

interface FeeStoreType extends FeeStoreActions {
  updateName: (name: string) => void;
  updateQty: (qty: number) => void;
  updateCost: (cost: number) => void;
  updateType: (type: string) => void;
  close: () => void;
}

const useFeeStore = create<FeeStoreType>((set) => ({
  header: "",
  name: "",
  qty: 0,
  cost: 0,
  type: "add",
  onSubmit: undefined,
  updateName: (name) => set(() => ({ name: name })),
  updateQty: (qty) => set(() => ({ qty: qty })),
  updateCost: (cost) => set(() => ({ cost: cost })),
  updateType: (type) => set(() => ({ type: type })),
  close: () => set({ onSubmit: undefined }),
}));

const FeeDialog = () => {
  const { header, onSubmit, close } = useFeeStore();

  const [name, updateName] = useFeeStore((state) => [
    state.name,
    state.updateName,
  ]);

  const [qty, updateQty] = useFeeStore((state) => [state.qty, state.updateQty]);

  const [cost, updateCost] = useFeeStore((state) => [
    state.cost,
    state.updateCost,
  ]);

  const [type, updateType] = useFeeStore((state) => [
    state.type,
    state.updateType,
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
            <TextField
              id="type"
              label="Type"
              value={type}
              onChange={(e) => {
                updateType(e.target.value);
              }}
              select
            >
              <MenuItem value="add">Increase cost</MenuItem>
              <MenuItem value="subtract">Decreases cost</MenuItem>
            </TextField>
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

              const isValid = await onSubmit(name, qty, cost, type);

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

export const feeDialog = ({
  header,
  name,
  qty,
  cost,
  type = "add",
  onSubmit,
}: FeeStoreActions) => {
  useFeeStore.setState({
    header,
    name,
    qty,
    cost,
    type,
    onSubmit,
  });
};

export default FeeDialog;
