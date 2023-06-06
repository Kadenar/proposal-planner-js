import { createSlice } from "@reduxjs/toolkit";
import { updateStore } from "../Dispatcher.js";
import {
  addLabor as add_labor,
  editLabor as edit_labor,
  deleteLabor as delete_labor,
  fetchLabors,
} from "../../backend-helpers/laborHelpers.ts";

// REDUCERS

export const laborsSlice = createSlice({
  name: "labors",
  initialState: {
    labors: [],
  },
  reducers: {
    updateLabors: (state, value) => {
      state.labors = value.payload;
    },
  },
});

export default laborsSlice.reducer;

// ACTIONS

const { updateLabors } = laborsSlice.actions;

export const initializeLabors = () => async (dispatch) => {
  const labors = await fetchLabors();
  dispatch(updateLabors(labors));
};

export const addLabor = async (dispatch, { name, qty, cost }) =>
  updateStore({
    dispatch,
    dbOperation: async () => add_labor(name, qty, cost),
    methodToDispatch: updateLabors,
    dataKey: "labors",
    successMessage: "Successfully added labor!",
  });

export const editLabor = async (dispatch, { guid, name, qty, cost }) =>
  updateStore({
    dispatch,
    dbOperation: async () => edit_labor(guid, name, qty, cost),
    methodToDispatch: updateLabors,
    dataKey: "labors",
    successMessage: "Successfully edited labor!",
  });

export const deleteLabor = async (dispatch, { guid }) =>
  updateStore({
    dispatch,
    dbOperation: async () => delete_labor(guid),
    methodToDispatch: updateLabors,
    dataKey: "labors",
    successMessage: "Successfully removed labor!",
  });
