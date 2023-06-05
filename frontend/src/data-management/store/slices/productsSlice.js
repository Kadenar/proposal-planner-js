import { createSlice } from "@reduxjs/toolkit";
import { updateStore } from "../Dispatcher.js";

import {
  editExistingProduct,
  addProduct as add_product,
  fetchProducts,
  deleteProduct as delete_product,
} from "../../backend-helpers/productHelpers.ts";

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
  },
  reducers: {
    updateProducts: (state, value) => {
      state.products = value.payload;
      state.isLoading = false;
    },
  },
});

export default productsSlice.reducer;

const { updateProducts } = productsSlice.actions;

export const initializeProducts = () => async (dispatch) => {
  const products = await fetchProducts();
  dispatch(updateProducts(products));
};

export async function addProduct(
  dispatch,
  { filter, modelName, catalogNum, unitCost }
) {
  return updateStore({
    dispatch,
    dbOperation: async () =>
      add_product(filter.guid, modelName, catalogNum, unitCost),
    methodToDispatch: updateProducts,
    dataKey: "products",
    successMessage: "Successfully added product.",
  });
}

export async function editProduct(
  dispatch,
  { guid, filter_guid, modelName, catalogNum, unitCost, image }
) {
  return updateStore({
    dispatch,
    dbOperation: async () =>
      editExistingProduct(
        guid,
        filter_guid,
        modelName,
        catalogNum,
        unitCost,
        image
      ),
    methodToDispatch: updateProducts,
    dataKey: "products",
    successMessage: "Successfully edited product!",
  });
}

export async function deleteProduct(dispatch, { guid, filter }) {
  return updateStore({
    dispatch,
    dbOperation: async () => delete_product(guid, filter),
    methodToDispatch: updateProducts,
    dataKey: "products",
    successMessage: "Successfully deleted product",
  });
}
