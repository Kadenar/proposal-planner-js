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
      state.selectedProposal.data.models =
        state.selectedProposal.data.models.concat(product.payload);
    },
    removeProductFromTable: (state, index) => {
      state.selectedProposal.data.models =
        state.selectedProposal.data.models.filter(
          (_, i) => i !== index.payload
        );
    },
    resetProposal: (state) => {
      state.selectedProposal.data.models = [];
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
    updateFeeCost: (state, data) => {
      const { key, numValue } = data.payload;
      state.selectedProposal.data.fees[key].cost = numValue;
    },
    updateLaborCost: (state, data) => {
      const { key, numValue } = data.payload;
      state.selectedProposal.data.labor[key].cost = numValue;
    },
    updateLaborQuantity: (state, data) => {
      const { key, numValue } = data.payload;
      state.selectedProposal.data.labor[key].qty = numValue;
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
  updateFeeCost,
  updateLaborCost,
  updateLaborQuantity,
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

export const setProposalFeeCosts = (dispatch, { key, value }) => {
  if (!key || key === "") {
    return;
  }

  const numValue = isNaN(parseInt(value, 10)) ? null : parseInt(value, 10);
  dispatch(updateFeeCost({ key, numValue }));
};

export const setProposalLaborCosts = (dispatch, { key, value }) => {
  if (!key || key === "") {
    return;
  }

  const numValue = isNaN(parseInt(value, 10)) ? null : parseInt(value, 10);
  dispatch(updateLaborCost({ key, numValue }));
};

export const setProposalLaborQuantity = (dispatch, { key, value }) => {
  if (!key || key === "") {
    return;
  }

  const numValue = isNaN(parseInt(value, 10)) ? null : parseInt(value, 10);
  dispatch(updateLaborQuantity({ key, numValue }));
};
