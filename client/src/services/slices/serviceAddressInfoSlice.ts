// REDUCERS

import { Dispatch, createSlice } from "@reduxjs/toolkit";
import { fetchAddresses } from "../../middleware/addressHelpers";
import { AddressInfo } from "../../middleware/Interfaces";

const initialState: { addresses: AddressInfo[] } = {
  addresses: [],
};

export const addressesSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    updateAddresses: (state, value) => {
      state.addresses = value.payload;
    },
  },
});

export default addressesSlice.reducer;

const { updateAddresses } = addressesSlice.actions;

export const intializeAddresses = () => async (dispatch: Dispatch) => {
  const addressData = await fetchAddresses();
  dispatch(updateAddresses(addressData));
};
