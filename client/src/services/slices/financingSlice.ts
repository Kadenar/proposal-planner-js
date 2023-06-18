import { Dispatch, createSlice } from "@reduxjs/toolkit";
import { updateStore } from "../Dispatcher.ts";
import {
  addFinancingOption as add_financing,
  editFinancingOption as edit_financing,
  deleteFinancingOption as delete_financing,
  fetchFinancingOptions,
} from "../../middleware/financingHelpers.ts";
import { Financing } from "../../middleware/Interfaces.ts";

// REDUCERS
const initialState: { financing: Financing[] } = {
  financing: [],
};

export const financingSlice = createSlice({
  name: "financing",
  initialState,
  reducers: {
    updateFinancing: (state, value) => {
      state.financing = value.payload;
    },
  },
});

export default financingSlice.reducer;

// ACTIONS

const { updateFinancing } = financingSlice.actions;

export const initializeFinancing = () => async (dispatch: Dispatch) => {
  const financing = await fetchFinancingOptions();
  dispatch(updateFinancing(financing));
};

export const addFinancingOption = async (
  dispatch: Dispatch,
  {
    name,
    interest,
    term_length,
    term_type,
    provider,
  }: {
    name: string;
    interest: number;
    term_length: number;
    term_type: string | "months" | "years";
    provider: string;
  }
) =>
  updateStore({
    dispatch,
    dbOperation: async () =>
      add_financing(name, interest, term_length, term_type, provider),
    methodToDispatch: updateFinancing,
    dataKey: "financing",
    successMessage: "Successfully added financing option!",
  });

export const editFinancingOption = async (
  dispatch: Dispatch,
  { guid, name, interest, term_length, term_type, provider }: Financing
) =>
  updateStore({
    dispatch,
    dbOperation: async () =>
      edit_financing(guid, name, interest, term_length, term_type, provider),
    methodToDispatch: updateFinancing,
    dataKey: "financing",
    successMessage: "Successfully edited financing option!",
  });

export const deleteFinancingOption = async (
  dispatch: Dispatch,
  { guid }: { guid: string }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => delete_financing(guid),
    methodToDispatch: updateFinancing,
    dataKey: "financing",
    successMessage: "Successfully removed financing option!",
  });
