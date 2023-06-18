import { Button, TextField, Stack, MenuItem } from "@mui/material";
import { create } from "zustand";
import BaseDialog from "../BaseDialog";

interface FinancingStoreActions {
  header: string;
  name: string;
  interest: number;
  term_length: number;
  term_type: string;
  provider: string;
  onSubmit:
    | ((
        name: string,
        interest: number,
        term_length: number,
        term_type: string,
        provider: string
      ) => Promise<boolean | undefined>)
    | undefined;
}

interface FinancingStoreType extends FinancingStoreActions {
  updateName: (name: string) => void;
  updateInterest: (term_interest: number) => void;
  updateTermLength: (term_length: number) => void;
  updateTermType: (term_type: string) => void;
  updateProvider: (provider: string) => void;
  close: () => void;
}

const useFinancingDialogStore = create<FinancingStoreType>((set) => ({
  header: "",
  name: "",
  interest: 0,
  term_length: 0,
  term_type: "months",
  provider: "",
  onSubmit: undefined,
  updateName: (name) => set(() => ({ name: name })),
  updateInterest: (interest) => set(() => ({ interest: interest })),
  updateTermLength: (term_length) => set(() => ({ term_length: term_length })),
  updateTermType: (term_type) => set(() => ({ term_type: term_type })),
  updateProvider: (provider) => set(() => ({ provider: provider })),
  close: () => set({ onSubmit: undefined }),
}));

const FinancingDialog = () => {
  const { header, onSubmit, close } = useFinancingDialogStore();

  const [name, updateName] = useFinancingDialogStore((state) => [
    state.name,
    state.updateName,
  ]);

  const [interest, updateInterest] = useFinancingDialogStore((state) => [
    state.interest,
    state.updateInterest,
  ]);

  const [term_length, updateTermLength] = useFinancingDialogStore((state) => [
    state.term_length,
    state.updateTermLength,
  ]);

  const [term_type, updateTermType] = useFinancingDialogStore((state) => [
    state.term_type,
    state.updateTermType,
  ]);

  const [provider, updateProvider] = useFinancingDialogStore((state) => [
    state.provider,
    state.updateProvider,
  ]);

  return (
    <BaseDialog
      title={header}
      content={
        <Stack paddingTop={3} spacing={2}>
          <TextField
            label="Name"
            value={name}
            required
            onChange={({ target: { value } }) => {
              updateName(value);
            }}
          />
          <TextField
            label="Interest rate"
            value={interest}
            type="number"
            required
            onChange={({ target: { value } }) => {
              updateInterest(Number(value));
            }}
          />
          <TextField
            label="Term length"
            value={term_length}
            type="number"
            required
            onChange={({ target: { value } }) => {
              updateTermLength(Number(value));
            }}
          />
          <TextField
            id="type"
            label="Term type"
            value={term_type}
            onChange={({ target: { value } }) => {
              updateTermType(value);
            }}
            select
          >
            <MenuItem value="months">Months</MenuItem>
            <MenuItem value="years">Years</MenuItem>
          </TextField>

          <TextField
            label="Provider"
            value={provider}
            onChange={({ target: { value } }) => {
              updateProvider(value);
            }}
            select
          >
            <MenuItem value="Synchrony Financial">Synchrony Financial</MenuItem>
            <MenuItem value="National Energy Improvement Fund">
              National Energy Improvement Fund
            </MenuItem>
          </TextField>
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

              const returnValue = await onSubmit(
                name,
                interest,
                term_length,
                term_type,
                provider
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

export const financingDialog = ({
  header,
  name,
  interest,
  term_length,
  term_type,
  provider,
  onSubmit,
}: FinancingStoreActions) => {
  useFinancingDialogStore.setState({
    header,
    name,
    interest,
    term_length,
    term_type,
    provider,
    onSubmit,
  });
};

export default FinancingDialog;
