import { createSlice } from "@reduxjs/toolkit";
import {
  fetchClients as fetch_clients,
  addClient as add_client,
  deleteClient as delete_client,
  saveClient as save_client,
} from "../../middleware/clientHelpers.ts";

import { updateStore } from "../Dispatcher.js";

// REDUCERS

export const clientsSlice = createSlice({
  name: "clients",
  initialState: {
    clients: [],
    selectedClient: null,
  },
  reducers: {
    updateClients: (state, value) => {
      state.clients = value.payload;
    },
    selectClient: (state, value) => {
      state.selectedClient = value.payload;
    },
    updateClientDetails: (state, data) => {
      const { key, value } = data.payload;
      state.selectedClient[key] = value;
    },
  },
});

export default clientsSlice.reducer;

// ACTIONS

const { updateClients, selectClient, updateClientDetails } =
  clientsSlice.actions;

export const updateActiveClient = (dispatch, { value }) =>
  dispatch(selectClient(value));

export const initializeClients = () => async (dispatch) => {
  let clients = await fetch_clients();
  dispatch(updateClients(clients));
};

export async function addClient(
  dispatch,
  { name, address, apt, state, city, zip }
) {
  return updateStore({
    dispatch,
    dbOperation: async () =>
      add_client({ name, address, apt, state, city, zip }),
    methodToDispatch: updateClients,
    dataKey: "clients",
    successMessage: "Successfully added client!",
  });
}

export async function setClientName(dispatch, { value }) {
  dispatch(updateClientDetails({ key: "name", value }));
}

export async function setClientAddress(dispatch, { value }) {
  dispatch(updateClientDetails({ key: "address", value }));
}

export async function setClientApt(dispatch, { value }) {
  dispatch(updateClientDetails({ key: "apt", value }));
}

export async function setClientCity(dispatch, { value }) {
  dispatch(updateClientDetails({ key: "city", value }));
}

export async function setClientState(dispatch, { value }) {
  dispatch(updateClientDetails({ key: "state", value }));
}

export async function setClientZip(dispatch, { value }) {
  dispatch(updateClientDetails({ key: "zip", value }));
}

export async function setClientPhone(dispatch, { value }) {
  dispatch(updateClientDetails({ key: "phone", value }));
}

export async function setClientEmail(dispatch, { value }) {
  dispatch(updateClientDetails({ key: "email", value }));
}

export async function setClientAccountNum(dispatch, { value }) {
  dispatch(updateClientDetails({ key: "accountNum", value }));
}

export async function saveClient(dispatch, { guid, newClientInfo }) {
  return updateStore({
    dispatch,
    dbOperation: async () =>
      save_client({
        ...newClientInfo,
        guid,
      }),
    methodToDispatch: updateClients,
    dataKey: "clients",
    successMessage: "Client details were saved successfully.",
  });
}

export async function deleteClient(dispatch, { guid }) {
  return updateStore({
    dispatch,
    dbOperation: async () => delete_client(guid),
    methodToDispatch: updateClients,
    dataKey: "clients",
    successMessage: "Successfully deleted client!",
  });
}
