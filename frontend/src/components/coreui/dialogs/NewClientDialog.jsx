import { create } from "zustand";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import { StyledBootstrapDialog } from "../StyledComponents";
import StateSelection from "../StateSelection";

const useClientStore = create((set) => ({
  name: "",
  address: "",
  apt: "",
  city: "",
  state: "",
  zip: "",
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
  const { onSubmit, close } = useClientStore();

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
    <>
      <StyledBootstrapDialog
        PaperProps={{
          style: {
            minWidth: "300px",
            maxWidth: "700px",
            width: "50vw",
          },
        }}
        open={Boolean(onSubmit)}
        onClose={close}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add new client</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
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
            <Grid item xs={5}>
              <TextField
                label="Zip"
                value={zip}
                onChange={({ target: { value } }) => {
                  setZip(value);
                }}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
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
        </DialogActions>
      </StyledBootstrapDialog>
    </>
  );
};

export const clientDialog = ({
  name,
  address,
  apt,
  city,
  state,
  zip,
  onSubmit,
}) => {
  useClientStore.setState({
    name,
    address,
    apt,
    city,
    state,
    zip,
    onSubmit,
  });
};

export default NewClientDialog;
