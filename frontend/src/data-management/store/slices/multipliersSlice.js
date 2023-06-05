import { createSlice } from "@reduxjs/toolkit";
import { updateStore } from "../Dispatcher.js";
import {
  addMultiplier as add_multiplier,
  editMultiplier as edit_multiplier,
  deleteMultiplier as delete_multiplier,
  fetchMultipliers,
} from "../../backend-helpers/multiplierHelpers.ts";

// REDUCERS

export const multipliersSlice = createSlice({
  name: "multipliers",
  initialState: {
    multipliers: [],
  },
  reducers: {
    updateMultipliers: (state, value) => {
      state.multipliers = value.payload;
    },
  },
});

export default multipliersSlice.reducer;

// ACTIONS

const { updateMultipliers } = multipliersSlice.actions;

export const initializeMultipliers = () => async (dispatch) => {
  const multipliers = await fetchMultipliers();
  dispatch(updateMultipliers(multipliers));
};

export const addMultiplier = async (dispatch, { value }) =>
  updateStore({
    dispatch,
    dbOperation: async () => add_multiplier(value),
    methodToDispatch: updateMultipliers,
    dataKey: "multipliers",
    successMessage: "Successfully added multiplier!",
  });

export const updateMultiplier = async (dispatch, { guid, value }) =>
  updateStore({
    dispatch,
    dbOperation: async () => edit_multiplier(guid, value),
    methodToDispatch: updateMultipliers,
    dataKey: "multipliers",
    successMessage: "Successfully edited multiplier!",
  });

export const deleteMultiplier = async (dispatch, { value }) =>
  updateStore({
    dispatch,
    dbOperation: async () => delete_multiplier(value),
    methodToDispatch: updateMultipliers,
    dataKey: "multipliers",
    successMessage: "Successfully removed multiplier!",
  });
