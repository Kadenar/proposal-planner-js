import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";

import { TextField, Typography } from "@mui/material";
import StateSelection from "../../components/coreui/StateSelection";
import {
  saveClient,
  setClientAccountNum,
  setClientAddress,
  setClientApt,
  setClientCity,
  setClientEmail,
  setClientName,
  setClientPhone,
  setClientState,
  setClientZip,
} from "../../data-management/store/slices/clientsSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../data-management/store/store";

const ClientAddressView = () => {
  const dispatch = useAppDispatch();
  const { selectedClient } = useAppSelector((state) => state.clients);

  if (!selectedClient) {
    return <></>;
  }

  return (
    <>
      <Stack spacing={2} direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={async () => {
            saveClient(dispatch, {
              ...selectedClient,
            });
          }}
        >
          Save client
        </Button>
      </Stack>
      <Card sx={{ padding: 3, marginTop: 1, marginBottom: 2 }}>
        <Typography variant="h5">Address</Typography>
        <Stack marginTop={2} spacing={3}>
          <TextField
            label="Client name"
            value={selectedClient.name}
            onChange={({ target: { value } }) => {
              setClientName(dispatch, { value });
            }}
          />

          <TextField
            label="Address"
            value={selectedClient.address}
            onChange={({ target: { value } }) => {
              setClientAddress(dispatch, { value });
            }}
          />

          <TextField
            label="Apt, Suite, etc (optional)"
            value={selectedClient.apt}
            onChange={({ target: { value } }) => {
              setClientApt(dispatch, { value });
            }}
          />

          <TextField
            label="City"
            value={selectedClient.city}
            onChange={({ target: { value } }) => {
              setClientCity(dispatch, { value });
            }}
          />
          <StateSelection
            initialValue={selectedClient.state}
            onChangeHandler={(value) => setClientState(dispatch, { value })}
          />
          <TextField
            label="Zip"
            value={selectedClient.zip}
            onChange={({ target: { value } }) => {
              setClientZip(dispatch, { value });
            }}
          />
        </Stack>
      </Card>
      <Card sx={{ padding: 3, marginTop: 1, marginBottom: 2 }}>
        <Typography variant="h5">Contact details</Typography>
        <Stack spacing={3} direction="row">
          <TextField
            label="Phone number"
            value={selectedClient.phone}
            onChange={({ target: { value } }) => {
              setClientPhone(dispatch, { value });
            }}
          />

          <TextField
            label="Email"
            value={selectedClient.email}
            onChange={({ target: { value } }) => {
              setClientEmail(dispatch, { value });
            }}
          />

          <TextField
            label="Account #"
            value={selectedClient.accountNum}
            onChange={({ target: { value } }) => {
              setClientAccountNum(dispatch, { value });
            }}
          />
        </Stack>
      </Card>
    </>
  );
};

export default ClientAddressView;
