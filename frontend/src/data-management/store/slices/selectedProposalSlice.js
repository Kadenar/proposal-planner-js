import { createSlice } from "@reduxjs/toolkit";

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
        state.selectedProposal.data.products.concat(product.payload);
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

export const selectProposal = (dispatch, { proposalData }) =>
  dispatch(selectedProposal(proposalData));

export const addProductToProposal = (dispatch, data) => {
  dispatch(addProductToTable(data));
};

export const removeProductFromProposal = (dispatch, { index }) =>
  dispatch(removeProductFromTable(index));

export const removeAllProductsFromProposal = (dispatch) =>
  dispatch(resetProposal());

export const setProposalTitle = (dispatch, { title }) =>
  dispatch(updateProposalTitle(title));

export const setProposalSummary = (dispatch, { summary }) =>
  dispatch(updateProposalSummary(summary));

export const setProposalSpecifications = (dispatch, { specifications }) =>
  dispatch(updateProposalSpecifications(specifications));

export const setProposalUnitCostTax = (dispatch, { value }) => {
  const numValue = isNaN(parseFloat(value, 10)) ? null : parseFloat(value, 10);
  dispatch(updateUnitCostTax(numValue));
};

export const setProposalMultiplier = (dispatch, { value }) =>
  dispatch(updateMultiplier(value));

export const setProposalCommission = (dispatch, { value }) =>
  dispatch(updateCommission(value));

export const updateProposalLabors = (dispatch, { newLabors }) => {
  dispatch(updateLabors(newLabors));
};

export const updateProposalFees = (dispatch, { newFees }) => {
  dispatch(updateFees(newFees));
};
