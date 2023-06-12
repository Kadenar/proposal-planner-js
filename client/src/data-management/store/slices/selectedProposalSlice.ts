import { Dispatch, createSlice } from "@reduxjs/toolkit";
import {
  ProductOnProposal,
  ProposalObject,
  ProposalSpec,
  PsuedoObjectOfFees,
  PsuedoObjectOfLabor,
} from "../../middleware/Interfaces";

export const selectedProposalSlice = createSlice({
  name: "selectedProposal",
  initialState: {
    selectedProposal: null,
  },
  reducers: {
    selectedProposal: (state, value) => {
      state.selectedProposal = value.payload;
    },
    addProductToTable: (state, product) => {
      if (!state.selectedProposal) {
        return;
      }

      state.selectedProposal.data.products =
        state.selectedProposal.data.products.concat(product.payload); // TODO Come back to typescript yelling

      // If we don't have a quote option available yet, then add it
      if (
        state.selectedProposal.data.quote_options.length <
        product.payload.quote_option
      ) {
        state.selectedProposal.data.quote_options =
          state.selectedProposal.data.quote_options.concat([
            { title: "", summary: "", specifications: [] },
          ]);
      }
    },
    removeProductFromTable: (state, index) => {
      if (!state.selectedProposal) {
        return;
      }

      const productBeingRemoved =
        state.selectedProposal.data.products[index.payload];

      // Get the products on the proposal
      const filteredProducts = state.selectedProposal.data.products.filter(
        (product: ProductOnProposal) => {
          return product.quote_option === productBeingRemoved.quote_option;
        }
      );

      if (
        filteredProducts.length === 1 &&
        filteredProducts[0].quote_option !== 0
      ) {
        state.selectedProposal.data.quote_options.splice(
          filteredProducts[0].quote_option - 1,
          1
        );
      }

      state.selectedProposal.data.products =
        state.selectedProposal.data.products.filter(
          (_, i) => i !== index.payload
        );
    },
    resetProposal: (state) => {
      if (!state.selectedProposal) {
        return;
      }
      state.selectedProposal.data.products = [];
      state.selectedProposal.data.quote_option = [];
    },
    updateProposalTitle: (state, value) => {
      if (!state.selectedProposal) {
        return;
      }

      const { index, title } = value.payload;

      state.selectedProposal.data.quote_options[index].title = title;
    },
    updateProposalSummary: (state, value) => {
      if (!state.selectedProposal) {
        return;
      }
      const { index, summary } = value.payload;

      state.selectedProposal.data.quote_options[index].summary = summary;
    },
    updateProposalSpecifications: (state, value) => {
      if (!state.selectedProposal) {
        return;
      }

      const { index, specifications } = value.payload;
      state.selectedProposal.data.quote_options[index].specifications =
        specifications;
    },
    updateUnitCostTax: (state, value) => {
      if (!state.selectedProposal) {
        return;
      }
      state.selectedProposal.data.unitCostTax = value.payload;
    },
    updateMultiplier: (state, value) => {
      if (!state.selectedProposal) {
        return;
      }
      state.selectedProposal.data.multiplier = value.payload;
    },
    updateCommission: (state, value) => {
      if (!state.selectedProposal) {
        return;
      }
      state.selectedProposal.data.commission = value.payload;
    },
    updateLabors: (state, labors) => {
      if (!state.selectedProposal) {
        return;
      }
      state.selectedProposal.data.labor = labors.payload;
    },
    updateFees: (state, fees) => {
      if (!state.selectedProposal) {
        return;
      }
      state.selectedProposal.data.fees = fees.payload;
    },
  },
});

export default selectedProposalSlice.reducer;

const {
  selectedProposal,
  addProductToTable,
  removeProductFromTable,
  resetProposal,
  updateProposalTitle,
  updateProposalSummary,
  updateProposalSpecifications,
  updateUnitCostTax,
  updateMultiplier,
  updateCommission,
  updateLabors,
  updateFees,
} = selectedProposalSlice.actions;

export const selectProposal = (
  dispatch: Dispatch,
  proposal: ProposalObject | null
) => dispatch(selectedProposal(proposal));

export const addProductToProposal = (
  dispatch: Dispatch,
  data: ProductOnProposal
) => {
  dispatch(addProductToTable(data));
};

export const removeProductFromProposal = (
  dispatch: Dispatch,
  { index }: { index: number }
) => dispatch(removeProductFromTable(index));

export const removeAllProductsFromProposal = (dispatch: Dispatch) =>
  dispatch(resetProposal());

export const setProposalTitle = (
  dispatch: Dispatch,
  title: string,
  quote_option: number
) => dispatch(updateProposalTitle({ index: quote_option, title: title }));

export const setProposalSummary = (
  dispatch: Dispatch,
  summary: string,
  quote_option: number
) => dispatch(updateProposalSummary({ index: quote_option, summary: summary }));

export const setProposalSpecifications = (
  dispatch: Dispatch,
  specifications: ProposalSpec[],
  quote_option: number
) =>
  dispatch(
    updateProposalSpecifications({
      index: quote_option,
      specifications: specifications,
    })
  );

export const setProposalUnitCostTax = (dispatch: Dispatch, value: string) => {
  const numValue = isNaN(parseFloat(value)) ? null : parseFloat(value);
  dispatch(updateUnitCostTax(numValue));
};

export const setProposalMultiplier = (dispatch: Dispatch, value: number) =>
  dispatch(updateMultiplier(value));

export const setProposalCommission = (dispatch: Dispatch, value: number) =>
  dispatch(updateCommission(value));

export const updateProposalLabors = (
  dispatch: Dispatch,
  newLabors: PsuedoObjectOfLabor
) => {
  dispatch(updateLabors(newLabors));
};

export const updateProposalFees = (
  dispatch: Dispatch,
  newFees: PsuedoObjectOfFees
) => {
  dispatch(updateFees(newFees));
};
