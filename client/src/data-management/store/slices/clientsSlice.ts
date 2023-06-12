import { Dispatch, createSlice } from "@reduxjs/toolkit";
import {
  fetchClients as fetch_clients,
  addClient as add_client,
  deleteClient as delete_client,
  saveClient as save_client,
} from "../../middleware/clientHelpers.ts";

import { updateStore } from "../Dispatcher.ts";
import { ClientObject, NewClientObject } from "../../middleware/Interfaces.ts";

// REDUCERS
const initialState: {
  clients: ClientObject[];
  selectedClient: ClientObject | undefined;
  is_dirty: boolean;
} = {
  clients: [],
  selectedClient: undefined,
  is_dirty: false,
};

export const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    updateClients: (state, value) => {
      state.clients = value.payload;
    },
    selectClient: (state, value) => {
      state.selectedClient = value.payload;
      state.is_dirty = false;
    },
    updateClientDetails: (state, data) => {
      const { key, value }: { key: string; value: string } = data.payload;
      if (state.selectedClient) {
        state.selectedClient[key] = value; // TODO come back to why typescript is yelling at me
        state.is_dirty = true;
      }
    },
    updateDirtyFlag: (state, value) => {
      state.is_dirty = value.payload;
    },
  },
});

export default clientsSlice.reducer;

// ACTIONS

const { updateClients, selectClient, updateClientDetails, updateDirtyFlag } =
  clientsSlice.actions;

export const updateActiveClient = (
  dispatch: Dispatch,
  client: ClientObject | undefined
) => dispatch(selectClient(client));

export const initializeClients = () => async (dispatch: Dispatch) => {
  let clients = await fetch_clients();
  dispatch(updateClients(clients));
};

export async function addClient(
  dispatch: Dispatch,
  { name, address, apt, state, city, zip }: NewClientObject
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

export async function setClientName(
  dispatch: Dispatch,
  { value }: { value: string }
) {
  dispatch(updateClientDetails({ key: "name", value }));
}

export async function setClientAddress(
  dispatch: Dispatch,
  { value }: { value: string }
) {
  dispatch(updateClientDetails({ key: "address", value }));
}

export async function setClientApt(
  dispatch: Dispatch,
  { value }: { value: string }
) {
  dispatch(updateClientDetails({ key: "apt", value }));
}

export async function setClientCity(
  dispatch: Dispatch,
  { value }: { value: string }
) {
  dispatch(updateClientDetails({ key: "city", value }));
}

export async function setClientState(
  dispatch: Dispatch,
  { value }: { value: string }
) {
  dispatch(updateClientDetails({ key: "state", value }));
}

export async function setClientZip(
  dispatch: Dispatch,
  { value }: { value: string }
) {
  dispatch(updateClientDetails({ key: "zip", value }));
}

export async function setClientPhone(
  dispatch: Dispatch,
  { value }: { value: string }
) {
  dispatch(updateClientDetails({ key: "phone", value }));
}

export async function setClientEmail(
  dispatch: Dispatch,
  { value }: { value: string }
) {
  dispatch(updateClientDetails({ key: "email", value }));
}

export async function setClientAccountNum(
  dispatch: Dispatch,
  { value }: { value: string }
) {
  dispatch(updateClientDetails({ key: "accountNum", value }));
}

export async function saveClient(
  dispatch: Dispatch,
  newClientInfo: ClientObject
) {
  const response = await updateStore({
    dispatch,
    dbOperation: async () => save_client(newClientInfo),
    methodToDispatch: updateClients,
    dataKey: "clients",
    successMessage: "Client details were saved successfully.",
  });

  if (response) {
    dispatch(updateDirtyFlag(false));
  }

  return response;
}

export async function deleteClient(
  dispatch: Dispatch,
  { guid }: { guid: string }
) {
  return updateStore({
    dispatch,
    dbOperation: async () => delete_client(guid),
    methodToDispatch: updateClients,
    dataKey: "clients",
    successMessage: "Successfully deleted client!",
  });
}
