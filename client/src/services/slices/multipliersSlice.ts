import { Dispatch, createSlice } from "@reduxjs/toolkit";

import { updateStore } from "../Dispatcher.ts";
import {
  addMultiplier as add_multiplier,
  editMultiplier as edit_multiplier,
  deleteMultiplier as delete_multiplier,
  fetchMultipliers,
} from "../../middleware/multiplierHelpers.ts";
import { Multiplier } from "../../middleware/Interfaces.ts";

// REDUCERS

const initialState: { multipliers: Multiplier[] } = {
  multipliers: [],
};

export const multipliersSlice = createSlice({
  name: "multipliers",
  initialState,
  reducers: {
    updateMultipliers: (state, value) => {
      state.multipliers = value.payload;
    },
  },
});

export default multipliersSlice.reducer;

// ACTIONS

const { updateMultipliers } = multipliersSlice.actions;

export const initializeMultipliers = () => async (dispatch: Dispatch) => {
  const multipliers = await fetchMultipliers();
  dispatch(updateMultipliers(multipliers));
};

export const addMultiplier = async (
  dispatch: Dispatch,
  { value }: { value: number }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => add_multiplier(value),
    methodToDispatch: updateMultipliers,
    dataKey: "multipliers",
    successMessage: "Successfully added multiplier!",
  });

export const updateMultiplier = async (
  dispatch: Dispatch,
  { guid, value }: { guid: string; value: number }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => edit_multiplier(guid, value),
    methodToDispatch: updateMultipliers,
    dataKey: "multipliers",
    successMessage: "Successfully edited multiplier!",
  });

export const deleteMultiplier = async (
  dispatch: Dispatch,
  { guid }: { guid: string }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => delete_multiplier(guid),
    methodToDispatch: updateMultipliers,
    dataKey: "multipliers",
    successMessage: "Successfully removed multiplier!",
  });
