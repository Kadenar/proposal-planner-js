import { Dispatch, createSlice } from "@reduxjs/toolkit";
import {
  ProductOnProposal,
  ProposalObject,
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
      state.selectedProposal.data.products =
        state.selectedProposal.data.products.concat(product.payload); // TODO Come back to typescript yelling
    },
    removeProductFromTable: (state, index) => {
      state.selectedProposal.data.products =
        state.selectedProposal.data.products.filter(
          (_, i) => i !== index.payload
        );
    },
    resetProposal: (state) => {
      state.selectedProposal.data.products = [];
    },
    updateProposalTitle: (state, value) => {
      state.selectedProposal.data.title = value.payload;
    },
    updateProposalSummary: (state, value) => {
      state.selectedProposal.data.summary = value.payload;
    },
    updateProposalSpecifications: (state, value) => {
      state.selectedProposal.data.specifications = value.payload;
    },
    updateUnitCostTax: (state, value) => {
      state.selectedProposal.data.unitCostTax = value.payload;
    },
    updateMultiplier: (state, value) => {
      state.selectedProposal.data.multiplier = value.payload;
    },
    updateCommission: (state, value) => {
      state.selectedProposal.data.commission = value.payload;
    },
    updateLabors: (state, labors) => {
      state.selectedProposal.data.labor = labors.payload;
    },
    updateFees: (state, fees) => {
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
  { title }: { title: string }
) => dispatch(updateProposalTitle(title));

export const setProposalSummary = (
  dispatch: Dispatch,
  { summary }: { summary: string }
) => dispatch(updateProposalSummary(summary));

export const setProposalSpecifications = (
  dispatch: Dispatch,
  specifications: { originalText: string; modifiedText: string }[] | undefined
) => dispatch(updateProposalSpecifications(specifications));

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
