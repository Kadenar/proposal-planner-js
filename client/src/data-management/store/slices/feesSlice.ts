import { Dispatch, createSlice } from "@reduxjs/toolkit";
import { updateStore } from "../Dispatcher.ts";
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

export const initializeFees = () => async (dispatch: Dispatch) => {
  const labors = await fetchFees();
  dispatch(updateFees(labors));
};

export const addFee = async (
  dispatch: Dispatch,
  {
    name,
    qty,
    cost,
    type,
  }: { name: string; qty: number; cost: number; type: string }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => add_fee(name, qty, cost, type),
    methodToDispatch: updateFees,
    dataKey: "fees",
    successMessage: "Successfully added fee!",
  });

export const editFee = async (
  dispatch: Dispatch,
  {
    guid,
    name,
    qty,
    cost,
    type,
  }: { guid: string; name: string; qty: number; cost: number; type: string }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => edit_fee(guid, name, qty, cost, type),
    methodToDispatch: updateFees,
    dataKey: "fees",
    successMessage: "Successfully edited fee!",
  });

export const deleteFee = async (
  dispatch: Dispatch,
  { guid }: { guid: string }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => delete_fee(guid),
    methodToDispatch: updateFees,
    dataKey: "fees",
    successMessage: "Successfully removed fee!",
  });
