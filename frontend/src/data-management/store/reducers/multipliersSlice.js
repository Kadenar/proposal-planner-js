import { createSlice } from "@reduxjs/toolkit";

export const multipliersSlice = createSlice({
  name: "multipliers",
  initialState: {
    multipliers: [],
  },
  reducers: {
    updateMultipliers: (state, value) => {
      state.multipliers = value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateMultipliers } = multipliersSlice.actions;

export default multipliersSlice.reducer;
