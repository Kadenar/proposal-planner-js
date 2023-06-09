import { Dispatch, createSlice } from "@reduxjs/toolkit";
import { updateStore } from "../Dispatcher.ts";
import {
  addLabor as add_labor,
  editLabor as edit_labor,
  deleteLabor as delete_labor,
  fetchLabors,
} from "../../middleware/laborHelpers.ts";

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

export const initializeLabors = () => async (dispatch: Dispatch) => {
  const labors = await fetchLabors();
  dispatch(updateLabors(labors));
};

export const addLabor = async (
  dispatch: Dispatch,
  { name, qty, cost }: { name: string; qty: number; cost: number }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => add_labor(name, qty, cost),
    methodToDispatch: updateLabors,
    dataKey: "labors",
    successMessage: "Successfully added labor!",
  });

export const editLabor = async (
  dispatch: Dispatch,
  {
    guid,
    name,
    qty,
    cost,
  }: { guid: string; name: string; qty: number; cost: number }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => edit_labor(guid, name, qty, cost),
    methodToDispatch: updateLabors,
    dataKey: "labors",
    successMessage: "Successfully edited labor!",
  });

export const deleteLabor = async (
  dispatch: Dispatch,
  { guid }: { guid: string }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => delete_labor(guid),
    methodToDispatch: updateLabors,
    dataKey: "labors",
    successMessage: "Successfully removed labor!",
  });
