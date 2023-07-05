import { Dispatch, createSlice } from "@reduxjs/toolkit";

import { updateStore } from "../Dispatcher.ts";
import {
  editMultiplier as edit_multiplier,
  fetchMultipliers,
} from "../../middleware/multiplierHelpers.ts";
import { Multiplier } from "../../middleware/Interfaces.ts";

// REDUCERS
const initialState: {
  laborMarkups: Multiplier[];
  equipmentMarkups: Multiplier[];
} = {
  laborMarkups: [],
  equipmentMarkups: [],
};

export const multipliersSlice = createSlice({
  name: "multipliers",
  initialState,
  reducers: {
    updateLaborMarkups: (state, value) => {
      state.laborMarkups = value.payload;
    },
    updateEquipmentMarkups: (state, value) => {
      state.equipmentMarkups = value.payload;
    },
  },
});

export default multipliersSlice.reducer;

// ACTIONS

const { updateLaborMarkups, updateEquipmentMarkups } = multipliersSlice.actions;

export const initializeMultipliers = () => async (dispatch: Dispatch) => {
  const multipliers = await fetchMultipliers();
  dispatch(updateEquipmentMarkups(multipliers.equipment_markups));
  dispatch(updateLaborMarkups(multipliers.labor_markups));
};

export const updateMultipliers = async (
  dispatch: Dispatch,
  { category, guid, value }: { category: string; guid: string; value: number }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => edit_multiplier(category, guid, value),
    methodToDispatch: updateMultipliers,
    dataKey: "multipliers",
    successMessage: "Successfully edited multiplier!",
  });
