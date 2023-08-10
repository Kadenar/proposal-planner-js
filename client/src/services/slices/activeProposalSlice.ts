import { Dispatch, createSlice } from "@reduxjs/toolkit";
import {
  ProductOnProposal,
  ProposalObject,
  ProposalSpec,
  FeeOnProposal,
  LaborOnProposal,
  TemplateObject,
} from "../../middleware/Interfaces";

const initialState: {
  activeProposal: ProposalObject | undefined;
  is_dirty: boolean;
} = {
  activeProposal: undefined,
  is_dirty: false,
};

export const activeProposalSlice = createSlice({
  name: "activeProposal",
  initialState,
  reducers: {
    activeProposal: (state, value) => {
      state.activeProposal = value.payload;
      state.is_dirty = false;
    },
    addProductToTable: (state, product) => {
      if (!state.activeProposal) {
        return;
      }

      // Add our product
      state.activeProposal.data.products =
        state.activeProposal.data.products.concat(product.payload);

      // Flag the quote as having products
      state.activeProposal.data.quote_options[
        product.payload.quote_option - 1
      ].hasProducts = true;

      // Mark proposal as dirty
      state.is_dirty = true;
    },
    removeProductFromTable: (state, index) => {
      if (!state.activeProposal) {
        return;
      }

      const proposalData = state.activeProposal.data;

      const productBeingRemoved = proposalData.products[index.payload];

      // Get the products on the proposal with the same quote option as what was removed
      const productsWithSameQuoteOption = proposalData.products.filter(
        (product: ProductOnProposal) => {
          return product.quote_option === productBeingRemoved.quote_option;
        }
      );

      // Mark quote option as not having any products
      if (
        productsWithSameQuoteOption.length === 1 &&
        productBeingRemoved.quote_option !== 0
      ) {
        proposalData.quote_options[
          productBeingRemoved.quote_option - 1
        ].hasProducts = false;
      }

      // Remove the product after updating quote options
      proposalData.products = proposalData.products.filter(
        (_, i) => i !== index.payload
      );

      state.is_dirty = true;
    },
    resetProposal: (state) => {
      if (!state.activeProposal) {
        return;
      }
      state.activeProposal.data.products = [];
      state.activeProposal.data.quote_options = [];
      state.is_dirty = true;
    },
    updateProposalTitle: (state, value) => {
      if (!state.activeProposal) {
        return;
      }

      const { index, title } = value.payload;

      state.activeProposal.data.quote_options[index].title = title;
      state.is_dirty = true;
    },
    updateProposalSummary: (state, value) => {
      if (!state.activeProposal) {
        return;
      }
      const { index, summary } = value.payload;

      state.activeProposal.data.quote_options[index].summary = summary;
      state.is_dirty = true;
    },
    updateProposalSpecifications: (state, value) => {
      if (!state.activeProposal) {
        return;
      }

      const { index, specifications } = value.payload;
      state.activeProposal.data.quote_options[index].specifications =
        specifications;
      state.is_dirty = true;
    },
    updateUnitCostTax: (state, value) => {
      if (!state.activeProposal) {
        return;
      }
      state.activeProposal.data.unit_cost_tax = value.payload;
      state.is_dirty = true;
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
    updateStartDate: (state, value) => {
      if (!state.activeProposal) {
        return;
      }
      state.activeProposal.data.start_date = value.payload;
    },
    updateDesiredCommission: (state, value) => {
      if (!state.activeProposal) {
        return;
      }
      state.activeProposal.data.target_commission = value.payload;
    },
    updateTargetQuoteOption: (state, value) => {
      if (!state.activeProposal) {
        return;
      }
      state.activeProposal.data.target_quote = value.payload;
    },
    updateDirtyFlag: (state, value) => {
      state.is_dirty = value.payload;
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
  updateLabors,
  updateFees,
  updateDirtyFlag,
  updateStartDate,
  updateDesiredCommission,
  updateTargetQuoteOption,
} = activeProposalSlice.actions;

export const selectProposal = (
  dispatch: Dispatch,
  proposal: ProposalObject | TemplateObject | undefined
) => dispatch(activeProposal(proposal));

export const markProposalAsDirty = (dispatch: Dispatch, value: boolean) => {
  dispatch(updateDirtyFlag(value));
};

export const addProductToProposal = (
  dispatch: Dispatch,
  data: ProductOnProposal
) => {
  dispatch(addProductToTable(data));
};

export const removeProductFromProposal = (
  dispatch: Dispatch,
  { index }: { index: number }
) => {
  dispatch(removeProductFromTable(index));
};

export const removeAllProductsFromProposal = (dispatch: Dispatch) => {
  dispatch(resetProposal());
};

export const setProposalTitle = (
  dispatch: Dispatch,
  title: string,
  quote_option: number
) => {
  dispatch(updateProposalTitle({ index: quote_option, title: title }));
};

export const setProposalSummary = (
  dispatch: Dispatch,
  summary: string,
  quote_option: number
) => {
  dispatch(updateProposalSummary({ index: quote_option, summary: summary }));
};

export const setProposalSpecifications = (
  dispatch: Dispatch,
  specifications: ProposalSpec[],
  quote_option: number
) => {
  dispatch(
    updateProposalSpecifications({
      index: quote_option,
      specifications: specifications,
    })
  );
};

export const setProposalStartDate = (
  dispatch: Dispatch,
  start_date: string
) => {
  dispatch(updateStartDate(start_date));
};

export const setTargetQuoteOption = (
  dispatch: Dispatch,
  target_quote: number
) => {
  dispatch(updateTargetQuoteOption(target_quote));
};

export const setTargetCommission = (
  dispatch: Dispatch,
  target_commission: number
) => {
  dispatch(updateDesiredCommission(target_commission));
};

export const setProposalUnitCostTax = (dispatch: Dispatch, value: string) => {
  const numValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);
  dispatch(updateUnitCostTax(numValue));
};

export const updateProposalLabors = (
  dispatch: Dispatch,
  newLabors: LaborOnProposal[],
  flag_dirty: boolean
) => {
  dispatch(updateLabors(newLabors));
  if (flag_dirty) {
    dispatch(updateDirtyFlag(true));
  }
};

export const updateProposalFees = (
  dispatch: Dispatch,
  newFees: FeeOnProposal[],
  flag_dirty: boolean
) => {
  dispatch(updateFees(newFees));
  if (flag_dirty) {
    dispatch(updateDirtyFlag(true));
  }
};
