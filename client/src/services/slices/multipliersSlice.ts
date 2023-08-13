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
  miscMaterialMarkups: Multiplier[];
} = {
  laborMarkups: [],
  equipmentMarkups: [],
  miscMaterialMarkups: [],
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
    updateMiscMaterialMarkups: (state, value) => {
      state.miscMaterialMarkups = value.payload;
    },
  },
});

export default multipliersSlice.reducer;

// ACTIONS

const {
  updateLaborMarkups,
  updateEquipmentMarkups,
  updateMiscMaterialMarkups,
} = multipliersSlice.actions;

export const initializeMultipliers = () => async (dispatch: Dispatch) => {
  const multipliers = await fetchMultipliers();
  dispatch(updateEquipmentMarkups(multipliers.equipment_markups));
  dispatch(updateLaborMarkups(multipliers.labor_markups));
  dispatch(updateMiscMaterialMarkups(multipliers.misc_materials));
};

export const updateLaborMultiplier = async (
  dispatch: Dispatch,
  { category, guid, value }: { category: string; guid: string; value: number }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => edit_multiplier(category, guid, value),
    methodToDispatch: updateLaborMarkups,
    dataKey: "multipliers",
    successMessage: "Successfully edited multiplier!",
  });

export const updateEquipmentMultiplier = async (
  dispatch: Dispatch,
  { category, guid, value }: { category: string; guid: string; value: number }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => edit_multiplier(category, guid, value),
    methodToDispatch: updateEquipmentMarkups,
    dataKey: "multipliers",
    successMessage: "Successfully edited multiplier!",
  });

export const updateMiscMaterialMultiplier = async (
  dispatch: Dispatch,
  { category, guid, value }: { category: string; guid: string; value: number }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => edit_multiplier(category, guid, value),
    methodToDispatch: updateMiscMaterialMarkups,
    dataKey: "multipliers",
    successMessage: "Successfully edited multiplier!",
  });
