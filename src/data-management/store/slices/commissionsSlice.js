import { createSlice } from "@reduxjs/toolkit";
import {
  addCommission as add_commission,
  deleteCommission as delete_commission,
  editCommission as edit_commission,
  fetchCommissions,
} from "../../middleware/commissionHelpers.ts";
import { updateStore } from "../Dispatcher.js";

// REDUCERS

export const commissionsSlice = createSlice({
  name: "commissions",
  initialState: {
    commissions: [],
  },
  reducers: {
    updateCommissions: (state, value) => {
      state.commissions = value.payload;
    },
  },
});

export default commissionsSlice.reducer;

// ACTIONS

const { updateCommissions } = commissionsSlice.actions;

export const initializeCommissions = () => async (dispatch) => {
  let commissions = await fetchCommissions();
  dispatch(updateCommissions(commissions));
};

export const addCommission = async (dispatch, { value }) =>
  updateStore({
    dispatch,
    dbOperation: async () => add_commission(value),
    methodToDispatch: updateCommissions,
    dataKey: "commissions",
    successMessage: "Successfully added commission!",
  });

export const editCommission = async (dispatch, { guid, value }) =>
  updateStore({
    dispatch,
    dbOperation: async () => edit_commission(guid, value),
    methodToDispatch: updateCommissions,
    dataKey: "commissions",
    successMessage: "Successfully edited commission!",
  });

export const deleteCommission = async (dispatch, { guid }) =>
  updateStore({
    dispatch,
    dbOperation: async () => delete_commission(guid),
    methodToDispatch: updateCommissions,
    dataKey: "commissions",
    successMessage: "Successfully deleted commission!",
  });
