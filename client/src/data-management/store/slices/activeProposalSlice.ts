import { Dispatch, createSlice } from "@reduxjs/toolkit";
import {
  ProductOnProposal,
  ProposalObject,
  ProposalSpec,
  PsuedoObjectOfFees,
  PsuedoObjectOfLabor,
} from "../../middleware/Interfaces";

const initialState: {
  activeProposal: ProposalObject | undefined;
} = {
  activeProposal: undefined,
};

export const activeProposalSlice = createSlice({
  name: "activeProposal",
  initialState,
  reducers: {
    activeProposal: (state, value) => {
      state.activeProposal = value.payload;
    },
    addProductToTable: (state, product) => {
      if (!state.activeProposal) {
        return;
      }

      state.activeProposal.data.products =
        state.activeProposal.data.products.concat(product.payload); // TODO Come back to typescript yelling

      // If we don't have a quote option available yet, then add it
      if (
        state.activeProposal.data.quote_options.length <
        product.payload.quote_option
      ) {
        state.activeProposal.data.quote_options =
          state.activeProposal.data.quote_options.concat([
            { title: "", summary: "", specifications: [] },
          ]);
      }
    },
    removeProductFromTable: (state, index) => {
      if (!state.activeProposal) {
        return;
      }

      const productBeingRemoved =
        state.activeProposal.data.products[index.payload];

      // Get the products on the proposal
      const filteredProducts = state.activeProposal.data.products.filter(
        (product: ProductOnProposal) => {
          return product.quote_option === productBeingRemoved.quote_option;
        }
      );

      if (
        filteredProducts.length === 1 &&
        filteredProducts[0].quote_option !== 0
      ) {
        state.activeProposal.data.quote_options.splice(
          filteredProducts[0].quote_option - 1,
          1
        );
      }

      state.activeProposal.data.products =
        state.activeProposal.data.products.filter(
          (_, i) => i !== index.payload
        );
    },
    resetProposal: (state) => {
      if (!state.activeProposal) {
        return;
      }
      state.activeProposal.data.products = [];
      state.activeProposal.data.quote_options = [];
    },
    updateProposalTitle: (state, value) => {
      if (!state.activeProposal) {
        return;
      }

      const { index, title } = value.payload;

      state.activeProposal.data.quote_options[index].title = title;
    },
    updateProposalSummary: (state, value) => {
      if (!state.activeProposal) {
        return;
      }
      const { index, summary } = value.payload;

      state.activeProposal.data.quote_options[index].summary = summary;
    },
    updateProposalSpecifications: (state, value) => {
      if (!state.activeProposal) {
        return;
      }

      const { index, specifications } = value.payload;
      state.activeProposal.data.quote_options[index].specifications =
        specifications;
    },
    updateUnitCostTax: (state, value) => {
      if (!state.activeProposal) {
        return;
      }
      state.activeProposal.data.unitCostTax = value.payload;
    },
    updateMultiplier: (state, value) => {
      if (!state.activeProposal) {
        return;
      }
      state.activeProposal.data.multiplier = value.payload;
    },
    updateCommission: (state, value) => {
      if (!state.activeProposal) {
        return;
      }
      state.activeProposal.data.commission = value.payload;
    },
    updateLabors: (state, labors) => {
      if (!state.activeProposal) {
        return;
      }
      state.activeProposal.data.labor = labors.payload;
    },
    updateFees: (state, fees) => {
      if (!state.activeProposal) {
        return;
      }
      state.activeProposal.data.fees = fees.payload;
    },
  },
});

export default activeProposalSlice.reducer;

const {
  activeProposal,
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
} = activeProposalSlice.actions;

export const selectProposal = (
  dispatch: Dispatch,
  proposal: ProposalObject | undefined
) => dispatch(activeProposal(proposal));

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
  const numValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
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
