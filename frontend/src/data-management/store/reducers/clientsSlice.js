import { createSlice } from "@reduxjs/toolkit";

export const clientsSlice = createSlice({
  name: "clients",
  initialState: {
    clients: [],
  },
  reducers: {
    updateClients: (state, value) => {
      state.clients = value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateClients } = clientsSlice.actions;

export default clientsSlice.reducer;
