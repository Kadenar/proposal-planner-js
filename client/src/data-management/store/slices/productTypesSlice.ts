import { Dispatch, createSlice } from "@reduxjs/toolkit";
import {
  addProductType as add_product_type,
  deleteProductType as delete_product_type,
  editProductType as edit_product_type,
  fetchProductTypes,
} from "../../middleware/productTypeHelpers.ts";
import { updateStore } from "../Dispatcher.ts";
import { ProductTypeObject } from "../../middleware/Interfaces.ts";

const initialState: { filters: ProductTypeObject[] } = {
  filters: [],
};

export const productTypesSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    updateProductTypes: (state, value) => {
      state.filters = value.payload;
    },
  },
});

export default productTypesSlice.reducer;

const { updateProductTypes } = productTypesSlice.actions;

export const initializeProductTypes = () => async (dispatch: Dispatch) => {
  const filterData = await fetchProductTypes();
  dispatch(updateProductTypes(filterData));
};

export const addProductType = async (
  dispatch: Dispatch,
  { label, specifications }: { label: string; specifications: string[] }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => add_product_type(label, specifications),
    methodToDispatch: updateProductTypes,
    dataKey: "types",
    successMessage: "Successfully added new product type!",
  });

export const editProductType = async (
  dispatch: Dispatch,
  {
    guid,
    value,
    specifications,
  }: { guid: string; value: string; specifications: string[] }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => edit_product_type(guid, value, specifications),
    methodToDispatch: updateProductTypes,
    dataKey: "types",
    successMessage: "Successfully edited product type",
  });

export const deleteProductType = async (
  dispatch: Dispatch,
  { guid }: { guid: string }
) =>
  updateStore({
    dispatch,
    dbOperation: async () => delete_product_type(guid),
    methodToDispatch: updateProductTypes,
    dataKey: "types",
    successMessage: "Successfully deleted product type",
  });
