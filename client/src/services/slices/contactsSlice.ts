import { Dispatch, createSlice } from "@reduxjs/toolkit";
import {
  fetchContacts as fetch_contacts,
  addContact as add_contact,
  deleteContact as delete_contact,
  editContact as edit_contact,
} from "../../middleware/contactsHelpers.ts";

import { updateStore } from "../Dispatcher.ts";
import { ContactObject } from "../../middleware/Interfaces.ts";

// REDUCERS
const initialState: {
  contacts: ContactObject[];
} = {
  contacts: [],
};

export const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    updateContacts: (state, value) => {
      state.contacts = value.payload;
    },
  },
});

export default contactsSlice.reducer;

const { updateContacts } = contactsSlice.actions;

export const initializeContacts = () => async (dispatch: Dispatch) => {
  let contacts = await fetch_contacts();
  dispatch(updateContacts(contacts));
};

export const addContact = async (
  dispatch: Dispatch,
  { name, email, phone }: { name: string; email: string; phone: string }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => add_contact(name, email, phone),
    methodToDispatch: updateContacts,
    dataKey: "contacts",
    successMessage: "Successfully added new contact!",
  });

export const editContact = async (
  dispatch: Dispatch,
  {
    guid,
    name,
    email,
    phone,
  }: { guid: string; name: string; email: string; phone: string }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => edit_contact({ guid, name, email, phone }),
    methodToDispatch: updateContacts,
    dataKey: "contacts",
    successMessage: "Successfully edited contact",
  });

export const deleteContact = async (
  dispatch: Dispatch,
  { guid }: { guid: string }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => delete_contact(guid),
    methodToDispatch: updateContacts,
    dataKey: "contacts",
    successMessage: "Successfully deleted contact",
  });
