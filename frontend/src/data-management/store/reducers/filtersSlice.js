import { createSlice } from "@reduxjs/toolkit";

export const filtersSlice = createSlice({
  name: "filters",
  initialState: {
    filters: [],
  },
  reducers: {
    updateFilters: (state, value) => {
      state.filters = value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateFilters } = filtersSlice.actions;

export default filtersSlice.reducer;
