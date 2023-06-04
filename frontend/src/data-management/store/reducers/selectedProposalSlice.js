import { createSlice } from "@reduxjs/toolkit";

export const selectedProposalSlice = createSlice({
  name: "selectedProposal",
  initialState: {
    selectedProposal: null,
  },
  reducers: {
    selectProposal: (state, value) => {
      state.selectedProposal = value;
    },
    addProductToTable: (state, product) => {
      return {
        ...state,
        data: {
          ...state.data,
          models: [...state.data.models, { ...product }],
        },
      };
    },
    removeProductFromTable: (state, index) => {
      return {
        ...state,
        data: {
          ...state.data,
          models: state.data.models.filter((_, i) => i !== index),
        },
      };
    },
    resetProposal: (state) => {
      return {
        ...state,
        data: {
          ...state.data,
          models: [],
        },
      };
    },
    updateProposalTitle: (state, value) => {
      return {
        ...state,
        data: {
          ...state.data,
          title: value,
        },
      };
    },
    updateProposalSummary: (state, value) => {
      return {
        ...state,
        data: {
          ...state.data,
          summary: value,
        },
      };
    },
    updateProposalSpecifications: (state, value) => {
      return {
        ...state,
        data: {
          ...state.data,
          specifications: value,
        },
      };
    },
    updateUnitCostTax: (state, value) => {
      return {
        ...state,
        data: {
          ...state.data,
          unitCostTax: value,
        },
      };
    },
    updateMultiplier: (state, value) => {
      return {
        ...state,
        data: {
          ...state.data,
          multiplier: value,
        },
      };
    },
    updateCommission: (state, value) => {
      return {
        ...state,
        data: {
          ...state.data,
          commission: value,
        },
      };
    },
    updateFee: (state, action) => {
      if (action.key === "") {
        return state;
      }

      return {
        ...state,
        data: {
          ...state.data,
          fees: {
            ...state.data.fees,
            [action.key]: {
              ...state.data.fees[action.key],
              cost: action.value,
            },
          },
        },
      };
    },
    updateLaborCost: (state, action) => {
      if (action.key === "") {
        return state;
      }
      return {
        ...state,
        data: {
          ...state.data,
          labor: {
            ...state.data.labor,
            [action.key]: {
              ...state.data.labor[action.key],
              cost: action.value,
            },
          },
        },
      };
    },
    updateLaborQuantity: (state, action) => {
      if (action.key === "") {
        return state;
      }

      return {
        ...state,
        data: {
          ...state.data,
          labor: {
            ...state.data.labor,
            [action.key]: {
              ...state.data.labor[action.key],
              qty: action.value,
            },
          },
        },
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateProposals,
  selectProposal,
  addProductToTable,
  removeProductFromTable,
  resetProposal,
  updateProposalTitle,
  updateProposalSummary,
  updateProposalSpecifications,
} = selectedProposalSlice.actions;

export default selectedProposalSlice.reducer;
