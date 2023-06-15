import { Dispatch, createSlice } from "@reduxjs/toolkit";
import { updateStore } from "../Dispatcher.ts";
import {
  editExistingProduct,
  addProduct as add_product,
  fetchProducts,
  deleteProduct as delete_product,
} from "../../middleware/productHelpers.ts";
import {
  ProductTypeObject,
  PsuedoObjectOfProducts,
} from "../../middleware/Interfaces.ts";

const initialState: { products: PsuedoObjectOfProducts } = {
  products: {},
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    updateProducts: (state, value) => {
      state.products = value.payload;
    },
  },
});

export default productsSlice.reducer;

const { updateProducts } = productsSlice.actions;

export const initializeProducts = () => async (dispatch: Dispatch) => {
  const products = await fetchProducts();
  dispatch(updateProducts(products));
};

export async function addProduct(
  dispatch: Dispatch,
  {
    filter,
    modelName,
    modelNum,
    cost,
  }: {
    filter: ProductTypeObject | null;
    modelName: string;
    modelNum: string;
    cost: number;
  }
) {
  return updateStore({
    dispatch,
    dbOperation: async () =>
      add_product(filter?.guid, modelName, modelNum, cost),
    methodToDispatch: updateProducts,
    dataKey: "products",
    successMessage: "Successfully added product.",
  });
}

export async function editProduct(
  dispatch: Dispatch,
  {
    guid,
    filter_guid,
    modelName,
    modelNum,
    cost,
    image,
  }: {
    guid: string;
    filter_guid: string;
    modelName: string;
    modelNum: string;
    cost: number;
    image: any; // TODO when we do images
  }
) {
  return updateStore({
    dispatch,
    dbOperation: async () =>
      editExistingProduct(guid, filter_guid, modelName, modelNum, cost, image),
    methodToDispatch: updateProducts,
    dataKey: "products",
    successMessage: "Successfully edited product!",
  });
}

export async function deleteProduct(
  dispatch: Dispatch,
  { guid, filter_guid }: { guid: string; filter_guid: string }
) {
  return updateStore({
    dispatch,
    dbOperation: async () => delete_product(guid, filter_guid),
    methodToDispatch: updateProducts,
    dataKey: "products",
    successMessage: "Successfully deleted product",
  });
}
