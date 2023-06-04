import { createSlice } from "@reduxjs/toolkit";

export const proposalsSlice = createSlice({
  name: "proposals",
  initialState: {
    proposals: [],
  },
  reducers: {
    updateProposals: (state, value) => {
      state.proposals = value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateProposals } = proposalsSlice.actions;

export default proposalsSlice.reducer;
