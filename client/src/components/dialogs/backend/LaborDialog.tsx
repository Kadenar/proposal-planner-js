import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { create } from "zustand";
import BaseDialog from "../BaseDialog";

interface LaborStoreActions {
  header: string;
  name: string;
  cost: number;
  allowCostOverride: boolean;
  onSubmit:
    | ((
        name: string,
        cost: number,
        allowCostOverride: boolean
      ) => Promise<boolean | undefined>)
    | undefined;
}

interface LaborStoreType extends LaborStoreActions {
  updateName: (name: string) => void;
  updateCost: (cost: number) => void;
  setCostOverride: (allowCostOverride: boolean) => void;
  close: () => void;
}

const useLaborStore = create<LaborStoreType>((set) => ({
  header: "",
  name: "",
  cost: 0,
  allowCostOverride: false,
  onSubmit: undefined,
  updateName: (name) => set(() => ({ name: name })),
  updateCost: (cost) => set(() => ({ cost: cost })),
  setCostOverride: (allowCostOverride) =>
    set(() => ({ allowCostOverride: allowCostOverride })),
  close: () => set({ onSubmit: undefined }),
}));

const LaborDialog = () => {
  const { header, onSubmit, close } = useLaborStore();

  const [name, updateName] = useLaborStore((state) => [
    state.name,
    state.updateName,
  ]);

  const [cost, updateCost] = useLaborStore((state) => [
    state.cost,
    state.updateCost,
  ]);

  const [allowCostOverride, setCostOverride] = useLaborStore((state) => [
    state.allowCostOverride,
    state.setCostOverride,
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
              label="Cost"
              value={cost}
              type="number"
              onChange={(e) => {
                updateCost(Number(e.target.value));
              }}
            />
            <TextField
              id="can_override_cost"
              label="Is cost editable on proposals"
              value={allowCostOverride}
              onChange={({ target: { value } }) => {
                setCostOverride(Boolean(value));
              }}
              select
            >
              <MenuItem value={false as any}>No</MenuItem>;
              <MenuItem value={true as any}>Yes</MenuItem>;
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

              const isValid = await onSubmit(name, cost, allowCostOverride);

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
  cost,
  allowCostOverride,
  onSubmit,
}: LaborStoreActions) => {
  useLaborStore.setState({
    header,
    name,
    cost,
    allowCostOverride,
    onSubmit,
  });
};

export default LaborDialog;
