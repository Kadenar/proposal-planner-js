import { createSlice } from "@reduxjs/toolkit";
import { updateStore } from "../Dispatcher.js";
import {
  addFee as add_fee,
  editFee as edit_fee,
  deleteFee as delete_fee,
  fetchFees,
} from "../../middleware/feeHelpers.ts";

// REDUCERS

export const feesSlice = createSlice({
  name: "fees",
  initialState: {
    fees: [],
  },
  reducers: {
    updateFees: (state, value) => {
      state.fees = value.payload;
    },
  },
});

export default feesSlice.reducer;

// ACTIONS

const { updateFees } = feesSlice.actions;

export const initializeFees = () => async (dispatch) => {
  const labors = await fetchFees();
  dispatch(updateFees(labors));
};

export const addFee = async (dispatch, { name, qty, cost, type }) =>
  updateStore({
    dispatch,
    dbOperation: async () => add_fee(name, qty, cost, type),
    methodToDispatch: updateFees,
    dataKey: "fees",
    successMessage: "Successfully added fee!",
  });

export const editFee = async (dispatch, { guid, name, qty, cost, type }) =>
  updateStore({
    dispatch,
    dbOperation: async () => edit_fee(guid, name, qty, cost, type),
    methodToDispatch: updateFees,
    dataKey: "fees",
    successMessage: "Successfully edited fee!",
  });

export const deleteFee = async (dispatch, { guid }) =>
  updateStore({
    dispatch,
    dbOperation: async () => delete_fee(guid),
    methodToDispatch: updateFees,
    dataKey: "fees",
    successMessage: "Successfully removed fee!",
  });
