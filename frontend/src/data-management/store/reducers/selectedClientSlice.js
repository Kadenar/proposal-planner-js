import { createSlice } from "@reduxjs/toolkit";

export const selectedClientSlice = createSlice({
  name: "selectedClient",
  initialState: {
    selectedClient: null,
  },
  reducers: {
    updateSelectedClient: (state, value) => {
      state.selectedClient = value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateSelectedClient } = selectedClientSlice.actions;

export default selectedClientSlice.reducer;
