import { create } from "zustand";
import { Button, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";

import BaseDialog from "../BaseDialog";
import { LaborOnProposal } from "../../../middleware/Interfaces";

interface LaborStoreActions {
  labor: LaborOnProposal | undefined;
  onSubmit:
    | ((labor: LaborOnProposal | undefined) => Promise<boolean | undefined>)
    | undefined;
}
interface LaborStoreType extends LaborStoreActions {
  setLabor: (labor: LaborOnProposal) => void;
  close: () => void;
}

const useLaborStore = create<LaborStoreType>((set) => ({
  labor: {},
  onSubmit: undefined,
  setLabor: (labor) => set(() => ({ labor: labor })),
  close: () => set({ onSubmit: undefined }),
}));

const LaborsDialog = () => {
  const { onSubmit, close } = useLaborStore();

  const [labor, setLabor] = useLaborStore((state) => [
    state.labor,
    state.setLabor,
  ]);

  return (
    <BaseDialog
      title="Configure labor"
      content={
        <Stack paddingTop={3} spacing={2}>
          {labor &&
            Object.keys(labor).map((type) => {
              return (
                <Stack direction="row" gap="20px">
                  <TextField
                    id="labor-cost-id"
                    label="Quantity"
                    variant="outlined"
                    value={labor[type].qty}
                    inputProps={{
                      min: 0,
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                    onChange={(e) => {
                      const newLabor = {
                        ...labor,
                      };
                      newLabor[type] = {
                        ...newLabor[type],
                        qty: Number(e.target.value),
                      };
                      setLabor(newLabor);
                    }}
                    type="number"
                  />
                  <FormControl fullWidth>
                    <InputLabel htmlFor="labor-cost-input-label">
                      {labor[type].name}
                    </InputLabel>
                    <OutlinedInput
                      inputProps={{
                        min: 0,
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                      }}
                      id="labor-cost-input-label"
                      value={labor[type].cost}
                      type="number"
                      onChange={(e) => {
                        const newLabor = {
                          ...labor,
                        };
                        newLabor[type] = {
                          ...newLabor[type],
                          cost: Number(e.target.value),
                        };
                        setLabor(newLabor);
                      }}
                      startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                      label={labor[type].name}
                    />
                  </FormControl>
                </Stack>
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

              const isValid = await onSubmit(labor);

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

export const laborsDialog = ({ labor, onSubmit }: LaborStoreActions) => {
  useLaborStore.setState({
    labor,
    onSubmit,
  });
};

export default LaborsDialog;
