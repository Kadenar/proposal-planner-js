import { createSlice } from "@reduxjs/toolkit";

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
  },
  reducers: {
    updateProducts: (state, value) => {
      state.products = value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateProducts } = productsSlice.actions;

export default productsSlice.reducer;
