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
import {
  fetchProposals,
  saveProposal,
} from "../../middleware/proposalHelpers.ts";
import { initializeProposals } from "./proposalsSlice.ts";

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
    filter_guid: string | undefined;
    modelName: string;
    modelNum: string;
    cost: number;
    image: any; // TODO when we do images
  }
) {
  const result = await updateStore({
    dispatch,
    dbOperation: async () =>
      editExistingProduct(guid, filter_guid, modelName, modelNum, cost, image),
    methodToDispatch: updateProducts,
    dataKey: "products",
    successMessage: "Successfully edited product!",
  });

  // TODO WIP - Handle saving proposals
  // await updateStore({
  //   dispatch,
  //   dbOperation: async () => {
  //     const allProposals = [...(await fetchProposals())];

  //     let finalProposalsResult = allProposals;
  //     allProposals.forEach(async (proposal) => {
  //       let newProducts = [...proposal.data.products];
  //       let updatedProducts = false;
  //       newProducts = newProducts.map((product) => {
  //         // For each proposal, if it contains the product we just edited, then update the info
  //         if (product.guid === guid) {
  //           updatedProducts = true;
  //           return {
  //             ...product,
  //             model: modelName,
  //             modelNum,
  //             cost,
  //           };
  //         }

  //         return product;
  //       });

  //       // Only update proposals that need to be resaved
  //       if (updatedProducts) {
  //         const newProposal = {
  //           ...proposal,
  //           data: {
  //             ...proposal.data,
  //             products: newProducts,
  //           },
  //         };

  //         finalProposalsResult = await saveProposal(
  //           newProposal.guid,
  //           newProposal.data.commission,
  //           newProposal.data.fees,
  //           newProposal.data.labor,
  //           newProposal.data.products,
  //           newProposal.data.unitCostTax,
  //           newProposal.data.multiplier,
  //           newProposal.data.quote_options
  //         );
  //       }

  //       console.log(finalProposalsResult);
  //       return finalProposalsResult;
  //     });
  //   },
  //   methodToDispatch: initializeProposals,
  //   dataKey: "proposals",
  //   successMessage: "Successfully updated all proposals!",
  // });

  return result;
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
