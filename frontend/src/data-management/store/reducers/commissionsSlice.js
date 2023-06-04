import { createSlice } from "@reduxjs/toolkit";

export const commissionsSlice = createSlice({
  name: "commissions",
  initialState: {
    commissions: [],
  },
  reducers: {
    updateCommissions: (state, value) => {
      state.commissions = value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateCommissions } = commissionsSlice.actions;

export default commissionsSlice.reducer;
