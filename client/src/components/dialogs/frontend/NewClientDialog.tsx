import { create } from "zustand";
import { Autocomplete, Button, TextField } from "@mui/material";
import Grid from "@mui/material/Grid";

import StateSelection from "../../StateSelection";
import BaseDialog from "../BaseDialog";
import { AddressInfo } from "../../../middleware/Interfaces";

interface ClientActions {
  name: string;
  address: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
  addresses: AddressInfo[];
  onSubmit:
    | ((
        name: string,
        address: string,
        apt: string,
        city: string,
        state: string,
        zip: string
      ) => Promise<boolean | undefined>)
    | undefined;
}

interface ClientType extends ClientActions {
  setName: (name: string) => void;
  setAddress: (address: string) => void;
  setApt: (apt: string) => void;
  setCity: (city: string) => void;
  setState: (state: string) => void;
  setZip: (zip: string) => void;
  close: () => void;
}

const useClientStore = create<ClientType>((set) => ({
  name: "",
  address: "",
  apt: "",
  city: "",
  state: "",
  zip: "",
  addresses: [],
  onSubmit: undefined,
  setName: (name) => set(() => ({ name: name })),
  setAddress: (address) => set(() => ({ address: address })),
  setApt: (apt) => set(() => ({ apt: apt })),
  setCity: (city) => set(() => ({ city: city })),
  setState: (state) => set(() => ({ state: state })),
  setZip: (zip) => set(() => ({ zip: zip })),
  close: () => set({ onSubmit: undefined }),
}));

const NewClientDialog = () => {
  const { onSubmit, close, addresses } = useClientStore();

  const [name, setName] = useClientStore((state) => [
    state.name,
    state.setName,
  ]);

  const [address, setAddress] = useClientStore((state) => [
    state.address,
    state.setAddress,
  ]);

  const [apt, setApt] = useClientStore((state) => [state.apt, state.setApt]);

  const [city, setCity] = useClientStore((state) => [
    state.city,
    state.setCity,
  ]);

  const [state, setState] = useClientStore((state) => [
    state.state,
    state.setState,
  ]);

  const [zip, setZip] = useClientStore((state) => [state.zip, state.setZip]);

  return (
    <BaseDialog
      title="Add new client"
      content={
        <Grid container marginTop={1} spacing={2}>
          <Grid item xs={11}>
            <TextField
              label="Client name"
              value={name}
              onChange={({ target: { value } }) => {
                setName(value);
              }}
              fullWidth
              autoFocus
            />
          </Grid>
          <Grid item xs={11}>
            <TextField
              label="Address"
              value={address}
              onChange={({ target: { value } }) => {
                setAddress(value);
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={11}>
            <TextField
              label="Apt, Suite, etc (optional)"
              value={apt}
              onChange={({ target: { value } }) => {
                setApt(value);
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={5}>
            <Autocomplete
              disablePortal
              id="filters"
              ListboxProps={{ style: { maxHeight: 160 } }}
              getOptionLabel={(option) => String(option.zip)}
              isOptionEqualToValue={(option, value) => option.zip === value.zip}
              options={addresses}
              renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                  <TextField {...params} label="Zip code" value={zip} />
                </div>
              )}
              onChange={(_, value) => {
                setZip(String(value?.zip) || "");
                setCity(value?.primary_city || "");
                setState(value?.state || "");
              }}
            />
          </Grid>
          <Grid item xs={11}>
            <TextField
              label="City"
              value={city}
              onChange={({ target: { value } }) => {
                setCity(value);
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <StateSelection initialValue={state} onChangeHandler={setState} />
          </Grid>
        </Grid>
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

              const isValid = await onSubmit(
                name,
                address,
                apt,
                state,
                city,
                zip
              );

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

export const clientDialog = ({
  name,
  address,
  apt,
  city,
  state,
  zip,
  addresses,
  onSubmit,
}: ClientActions) => {
  useClientStore.setState({
    name,
    address,
    apt,
    city,
    state,
    zip,
    addresses,
    onSubmit,
  });
};

export default NewClientDialog;
