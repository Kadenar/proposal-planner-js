import { combineReducers } from "redux";

const initialState = {
  useDarkMode: true, // This controls whether the user is in dark or light mode
  filters_data: [], // This is initialized during program execution
  products: [], // This is initialized during program execution
  multipliers: [], // This is initialized during program execution
  commissions: [], // This is initialized during program execution
  clients: [], // This is initialized during program execution
  proposals: [], // This is initialized during program execution
  selectedClient: null, // This controls whether to show All clients view or selected client view
  selectedProposal: null, // This controls whether to show All proposals view or selected client view
  selectedProduct: null, // TODO - unsure whether this is needed?
  // The values below are never updates and are ONLY used for defaulting for new proposals
  multiplier: 1.6,
  commission: 10.0,
  unitCostTax: 8.375,
  fees: {
    permit: {
      name: "Permit fee",
      cost: 300,
    },

    financing: {
      name: "Financing fee",
      cost: 0,
    },
    tempTank: {
      name: "Temp tank fee",
      cost: 0,
    },
    removal: {
      name: "Removal fee",
      cost: 0,
    },
    rebates: {
      name: "Rebates",
      cost: 0,
    },
  },
  labor: {
    twoMenEightHours: {
      name: "(2) men (8) hours",
      qty: 0,
      cost: 680,
    },
    twoMenSixteenHours: {
      name: "(2) men (16) hours",
      qty: 0,
      cost: 1360,
    },
    twoMenTwentyHours: {
      name: "(2) men (20) hours",
      qty: 0,
      cost: 1700,
    },
    threeMenTwentyFourHours: {
      name: "(3) men (24) hours",
      qty: 0,
      cost: 2040,
    },
    threeMenThirtyHours: {
      name: "(3) men (30) hours",
      qty: 0,
      cost: 2550,
    },
    subcontractor: {
      name: "Sub contractor labor",
      qty: 1,
      cost: 0,
    },
  },
  costOfJob: 0,
};

/**
 * Reducer for updating the set of filters available in dropdown
 */
const useDarkMode = (state = initialState.useDarkMode, action) => {
  if (action.type === "TOGGLE_THEME") {
    return action.value;
  }

  return state;
};

/**
 * Reducer for updating the set of filters available in dropdown
 */
const filters = (state = initialState.filters_data, action) => {
  if (action.type === "UPDATE_FILTERS") {
    return action.value;
  }

  return state;
};

/**
 * Reducer for updating the clients
 */
const clients = (state = initialState.clients, action) => {
  if (action.type === "UPDATE_CLIENTS") {
    return action.value;
  }

  return state;
};

/**
 * Reducer for updating the available products
 */
const products = (state = initialState.products, action) => {
  if (action.type === "UPDATE_PRODUCTS") {
    return action.value;
  }

  return state;
};

/**
 * Reducer for updating the available proposals
 */
const proposals = (state = initialState.proposals, action) => {
  if (action.type === "UPDATE_PROPOSALS") {
    return action.value;
  }

  return state;
};

/**
 * Reducer for updating the actively selected proposal
 */
const selectedProposal = (state = initialState.selectedProposal, action) => {
  if (action.type === "SELECT_PROPOSAL") {
    return action.value;
  }

  if (
    action.type === "UPDATE_PROPOSAL_TITLE" ||
    action.type === "UPDATE_PROPOSAL_SUMMARY" ||
    action.type === "UPDATE_PROPOSAL_SPECIFICATIONS"
  ) {
    return {
      ...state,
      data: {
        ...state.data,
        [action.key]: action.value,
      },
    };
  }

  if (action.type === "ADD_ROW") {
    return {
      ...state,
      data: {
        ...state.data,
        models: [...state.data.models, { ...action.value }],
      },
    };
  }

  if (action.type === "REMOVE_ROW") {
    return {
      ...state,
      data: {
        ...state.data,
        models: state.data.models.filter((_, i) => i !== action.value),
      },
    };
  }

  if (action.type === "UPDATE_UNIT_COST") {
    return {
      ...state,
      data: {
        ...state.data,
        unitCostTax: action.value,
      },
    };
  }
  if (action.type === "UPDATE_MULTIPLIER") {
    return {
      ...state,
      data: {
        ...state.data,
        multiplier: action.value,
      },
    };
  }

  if (action.type === "UPDATE_COMMISSION") {
    return {
      ...state,
      data: {
        ...state.data,
        commission: action.value,
      },
    };
  }

  if (action.type === "UPDATE_LABOR_COST" && action.key !== "") {
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
  }

  if (action.type === "UPDATE_LABOR_QUANTITY" && action.key !== "") {
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
  }

  if (action.type === "UPDATE_FEE" && action.key !== "") {
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
  }

  if (action.type === "RESET_PROPOSAL") {
    return {
      ...state,
      data: {
        ...state.data,
        models: [],
      },
    };
  }

  return state;
};

const selectedClient = (state = initialState.selectedClient, action) => {
  if (action.type === "SELECT_CLIENT") {
    return action.value;
  }

  return state;
};

/**
 * Reducer for updating the selected product
 */
const selectedProduct = (state = initialState.selectedProduct, action) => {
  if (action.type === "UPDATE_SELECTED_PRODUCT") {
    return action.value;
  }

  return state;
};

const multipliers = (state = initialState.multipliers, action) => {
  if (action.type === "UPDATE_MULTIPLIERS") {
    return action.value;
  }

  return state;
};

/**
 * Reducer used for updating the commissions available
 */
const commissions = (state = initialState.commissions, action) => {
  if (action.type === "UPDATE_COMMISSIONS") {
    return action.value;
  }

  return state;
};

/**
 * Combine all of our reducers into a single reducer for export and use to create a global store
 */
const allReducers = combineReducers({
  useDarkMode,
  filters, // the available filters
  products, // all of the products available
  selectedProduct, // the selected product ??? Is this needed?
  multipliers, // the available multipliers for proposal
  commissions, // available commissions for proposal
  proposals, // all of the proposals for the salesman
  selectedProposal, // the active proposal being viewed / edited
  clients, // all of the clients for the salesman
  selectedClient, // the active client being viewed / edited
});

// The root reducer for handling resetting the state
const PricingReducer = (state, action) => {
  if (action.type === "RESET_PROPOSAL") {
    return allReducers(
      {
        products: state.products,
        proposals: state.proposals,
        filters: state.filters,
        selectedProposal: state.selectedProposal,
        commissions: state.commissions,
        multipliers: state.multipliers,
        clients: state.clients,
      },
      action
    );
  }

  return allReducers(state, action);
};

export function toggleTheme(value) {
  return {
    type: "TOGGLE_THEME",
    value,
  };
}

export function updateFilters(value) {
  return {
    type: "UPDATE_FILTERS",
    value,
  };
}

export function updateUnitCostTax(value) {
  const numValue = isNaN(parseFloat(value, 10)) ? null : parseFloat(value, 10);

  return {
    type: "UPDATE_UNIT_COST",
    value: numValue,
  };
}

export function updateMultipliers(value) {
  return {
    type: "UPDATE_MULTIPLIERS",
    value,
  };
}

export function updateMultiplier(value) {
  return {
    type: "UPDATE_MULTIPLIER",
    value,
  };
}

export function updateCommissions(value) {
  return {
    type: "UPDATE_COMMISSIONS",
    value,
  };
}

export function updateCommission(value) {
  return {
    type: "UPDATE_COMMISSION",
    value,
  };
}

export function updateFee(key, value) {
  const numValue = isNaN(parseInt(value, 10)) ? null : parseInt(value, 10);

  return {
    key,
    type: "UPDATE_FEE",
    value: numValue,
  };
}

export function updateLaborCost(key, value) {
  const numValue = isNaN(parseInt(value, 10)) ? null : parseInt(value, 10);

  return {
    key,
    type: "UPDATE_LABOR_COST",
    value: numValue,
  };
}

export function updateLaborQuantity(key, value) {
  const numValue = isNaN(parseInt(value, 10)) ? null : parseInt(value, 10);

  return {
    key,
    type: "UPDATE_LABOR_QUANTITY",
    value: numValue,
  };
}

export function updateProducts(value) {
  return {
    type: "UPDATE_PRODUCTS",
    value,
  };
}

export function updateSelectedProduct(value) {
  return {
    type: "UPDATE_SELECTED_PRODUCT",
    value,
  };
}

export function addProductToTable(value) {
  return {
    type: "ADD_ROW",
    value,
  };
}

export function removeProductFromTable(index) {
  return {
    type: "REMOVE_ROW",
    value: index,
  };
}

export function resetProposal() {
  return {
    type: "RESET_PROPOSAL",
  };
}

export function updateProposals(value) {
  return {
    type: "UPDATE_PROPOSALS",
    value,
  };
}

export function updateProposalTitle(value) {
  return {
    type: "UPDATE_PROPOSAL_TITLE",
    key: "title",
    value,
  };
}

export function updateProposalSummary(value) {
  return {
    type: "UPDATE_PROPOSAL_SUMMARY",
    key: "summary",
    value,
  };
}

export function updateProposalSpecifications(value) {
  return {
    type: "UPDATE_PROPOSAL_SPECIFICATIONS",
    key: "specifications",
    value,
  };
}

export function selectProposal(value) {
  return {
    type: "SELECT_PROPOSAL",
    value,
  };
}

export function updateSelectedClient(value) {
  return {
    type: "SELECT_CLIENT",
    value,
  };
}

export function updateClients(value) {
  return {
    type: "UPDATE_CLIENTS",
    value,
  };
}

export default PricingReducer;
