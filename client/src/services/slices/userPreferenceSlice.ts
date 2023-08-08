import { Dispatch, createSlice } from "@reduxjs/toolkit";
import { UserPreferences } from "../../middleware/Interfaces.ts";
import {
  fetchPreferences,
  savePreferences,
} from "../../middleware/preferenceHelpers.ts";
import { updateStore } from "../Dispatcher.ts";

// REDUCERS

const initialState: { preferences: UserPreferences } = {
  preferences: {
    darkMode: true,
    expandedSideBar: true,
  },
};

export const usePreferenceSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    updatePreferences: (state, value) => {
      state.preferences = value.payload;
    },
  },
});

export default usePreferenceSlice.reducer;

// ACTIONS

const { updatePreferences } = usePreferenceSlice.actions;

export const initializePreferences = () => async (dispatch: Dispatch) => {
  const preferences = await fetchPreferences();
  dispatch(updatePreferences(preferences));
};

export const toggleDarkMode = (dispatch: Dispatch, newValue: boolean) => {
  return updateStore({
    dispatch,
    dbOperation: async () => savePreferences("darkMode", newValue),
    methodToDispatch: updatePreferences,
    dataKey: "preferences",
    successMessage: "Your default theme has been updated!",
  });
};

export const toggleSidebar = (dispatch: Dispatch, newValue: boolean) => {
  return updateStore({
    dispatch,
    dbOperation: async () => savePreferences("expandedSideBar", newValue),
    methodToDispatch: updatePreferences,
    dataKey: "preferences",
    successMessage: undefined,
  });
};
