import { createSlice } from "@reduxjs/toolkit";
import {
  addProductType as add_product_type,
  deleteProductType as delete_product_type,
  editProductType as edit_product_type,
  fetchProductTypes,
} from "../../middleware/productTypeHelpers.ts";
import { updateStore } from "../Dispatcher.ts";

export const productTypesSlice = createSlice({
  name: "filters",
  initialState: {
    filters: [],
  },
  reducers: {
    updateProductTypes: (state, value) => {
      state.filters = value.payload;
    },
  },
});

export default productTypesSlice.reducer;

const { updateProductTypes } = productTypesSlice.actions;

export const initializeProductTypes = () => async (dispatch) => {
  const filterData = await fetchProductTypes();
  dispatch(updateProductTypes(filterData));
};

export const addProductType = async (dispatch, { label }) =>
  updateStore({
    dispatch,
    dbOperation: async () => add_product_type(label),
    methodToDispatch: updateProductTypes,
    dataKey: "types",
    successMessage: "Successfully added new product type!",
  });

export const editProductType = async (dispatch, { guid, value }) =>
  updateStore({
    dispatch,
    dbOperation: async () => edit_product_type(value, guid),
    methodToDispatch: updateProductTypes,
    dataKey: "types",
    successMessage: "Successfully edited product type",
  });

export const deleteProductType = async (dispatch, { guid }) =>
  updateStore({
    dispatch,
    dbOperation: async () => delete_product_type(guid),
    methodToDispatch: updateProductTypes,
    dataKey: "types",
    successMessage: "Successfully deleted product type",
  });
