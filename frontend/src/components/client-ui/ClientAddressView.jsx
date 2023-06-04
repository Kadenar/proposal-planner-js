import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Button, Stack } from "@mui/material";
import Card from "@mui/material/Card";

import { TextField, Typography } from "@mui/material";
import { showSnackbar } from "../coreui/CustomSnackbar";

import {
  updateClients,
  updateSelectedClient,
} from "../../data-management/store/Reducers";
import { saveClient } from "../../data-management/backend-helpers/InteractWithBackendData.ts";
import StateSelection from "../coreui/StateSelection";
import { updateStore } from "../../data-management/store/Dispatcher";

const ClientAddressView = () => {
  const dispatch = useDispatch();
  const selectedClient = useSelector((state) => state.selectedClient);
  const clients = useSelector((state) => state.clients);

  const [name, setName] = useState(selectedClient.name);
  const [address, setAddress] = useState(selectedClient.address);
  const [apt, setApt] = useState(selectedClient.apt);
  const [city, setCity] = useState(selectedClient.city);
  const [state, setState] = useState(selectedClient.state);
  const [zip, setZip] = useState(selectedClient.zip);
  const [phone, setPhone] = useState(selectedClient.phone);
  const [email, setEmail] = useState(selectedClient.email);
  const [accountNum, setAccountNum] = useState(selectedClient.accountNum);

  return (
    <>
      <Stack spacing={2} direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={async () => {
            const response = await updateStore({
              dispatch,
              dbOperation: async () =>
                saveClient({
                  guid: selectedClient.guid,
                  name,
                  address,
                  apt,
                  city,
                  state,
                  zip,
                  phone,
                  email,
                  accountNum,
                }),
              methodToDispatch: updateClients,
              dataKey: "clients",
              successMessage: "Client details were saved successfully.",
            });

            if (response) {
              const index = clients.findIndex((client) => {
                return client.guid === selectedClient.guid;
              });
              if (index !== -1) {
                dispatch(updateSelectedClient(clients[index]));
              }
            } else {
              showSnackbar({
                title: "Internal server error - failed to save client.",
                show: true,
                status: "error",
              });
            }
          }}
          align="right"
        >
          Save client
        </Button>
      </Stack>
      <Card sx={{ padding: 3, marginTop: 1, marginBottom: 2 }}>
        <Typography variant="h5">Address</Typography>
        <Stack marginTop={2} spacing={3}>
          <TextField
            label="Client name"
            value={name}
            onChange={({ target: { value } }) => {
              setName(value);
            }}
          />

          <TextField
            label="Address"
            value={address}
            onChange={({ target: { value } }) => {
              setAddress(value);
            }}
          />

          <TextField
            label="Apt, Suite, etc (optional)"
            value={apt}
            onChange={({ target: { value } }) => {
              setApt(value);
            }}
          />

          <TextField
            label="City"
            value={city}
            onChange={({ target: { value } }) => {
              setCity(value);
            }}
          />
          <StateSelection initialValue={state} onChangeHandler={setState} />
          <TextField
            label="Zip"
            value={zip}
            onChange={({ target: { value } }) => {
              setZip(value);
            }}
          />
        </Stack>
      </Card>
      <Card sx={{ padding: 3, marginTop: 1, marginBottom: 2 }}>
        <Typography variant="h5">Contact details</Typography>
        <Stack spacing={3} direction="row">
          <TextField
            label="Phone number"
            value={phone}
            onChange={({ target: { value } }) => {
              setPhone(value);
            }}
          />

          <TextField
            label="Email"
            value={email}
            onChange={({ target: { value } }) => {
              setEmail(value);
            }}
          />

          <TextField
            label="Account #"
            value={accountNum}
            onChange={({ target: { value } }) => {
              setAccountNum(value);
            }}
          />
        </Stack>
      </Card>
    </>
  );
};

export default ClientAddressView;
