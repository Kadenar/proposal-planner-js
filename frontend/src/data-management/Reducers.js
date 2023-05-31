import { combineReducers } from "redux";

const initialState = {
  selectedProposal: "",
  filters_data: [],
  allProducts: [], // This is initialized during program execution
  selectedProduct: null,
  jobTableContents: [],
  unitCostTax: 8.375,
  multipliers: [],
  multiplier: 1.6,
  commissions: [],
  commission: 10.0,
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
 * @param {*} state
 * @param {*} value
 * @returns
 */
const filters = (state = initialState.filters_data, action) => {
  if (action.type === "UPDATE_FILTERS") {
    return action.value;
  }

  return state;
};

/**
 * Reducer for updating the available products
 * @param {*} state
 * @param {*} value
 * @returns
 */
const allProducts = (state = initialState.allProducts, action) => {
  if (action.type === "UPDATE_PRODUCTS") {
    return action.value;
  }

  return state;
};

const selectedProposal = (state = initialState.selectedProposal, action) => {
  if (action.type === "SELECT_PROPOSAL") {
    return action.value;
  }

  return state;
};

/**
 * Reducer for updating the selected product
 * @param {*} state
 * @param {*} value
 * @returns
 */
const selectedProduct = (state = initialState.selectedProduct, action) => {
  if (action.type === "UPDATE_SELECTED_PRODUCT") {
    return action.value;
  }

  return state;
};

/**
 * Reducer used for updating the job table contents
 * Allows for adding a new entry, removing a specific entry and clearing the entire table
 * @param {*} state
 * @param {*} action
 * @returns
 */
const jobTableContents = (state = initialState.jobTableContents, action) => {
  if (action.type === "ADD_ROW") {
    state.push({
      ...action.value,
      key: state.length,
    });
    return state;
  } else if (action.type === "REMOVE_ROW") {
    const idxToRemove = action.value;
    state.splice(idxToRemove, 1);
    return state;
  } else if (action.type === "RESET_PROPOSAL") {
    return [];
  } else {
    return state;
  }
};

/**
 * Reducer used for updating the unit cost tax to be applied to the pricing
 * @param {*} state
 * @param {*} value
 * @returns
 */
const unitCostTax = (state = initialState.unitCostTax, action) => {
  if (action.type === "UPDATE_UNIT_COST") {
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
 * Reducer used for updating the multiplier to be applied to the pricing
 * @param {*} state
 * @param {*} value
 * @returns
 */
const multiplier = (state = initialState.multiplier, action) => {
  if (action.type === "UPDATE_MULTIPLIER") {
    return action.value;
  }

  return state;
};

/**
 * Reducer used for updating the commissions available
 * @param {*} state
 * @param {*} value
 * @returns
 */
const commissions = (state = initialState.commissions, action) => {
  if (action.type === "UPDATE_COMMISSIONS") {
    return action.value;
  }

  return state;
};

/**
 * Reducer used for updating the commission to be applied to the pricing
 * @param {*} state
 * @param {*} value
 * @returns
 */
const commission = (state = initialState.commission, action) => {
  if (action.type === "UPDATE_COMMISSION") {
    return action.value;
  }

  return state;
};

/**
 * Reducer used for updating any permit fees applicable to the job
 * @param {*} state
 * @param {*} value
 * @returns
 */
const fees = (state = initialState.fees, action) => {
  if (action.type === "UPDATE_FEE" && action.key !== "") {
    return {
      ...state,
      [action.key]: {
        ...state[action.key],
        cost: action.value,
      },
    };
    // return {
    //   ...state,
    //   [action.key]: action.value,
    // };
  }

  return state;
};

/**
 * Reducer used for updating any permit fees applicable to the job
 * @param {*} state
 * @param {*} value
 * @returns
 */
const labor = (state = initialState.labor, action) => {
  if (action.type === "UPDATE_LABOR_COST" && action.key !== "") {
    return {
      ...state,
      [action.key]: {
        ...state[action.key],
        cost: action.value,
      },
    };
  } else if (action.type === "UPDATE_LABOR_QUANTITY" && action.key !== "") {
    return {
      ...state,
      [action.key]: {
        ...state[action.key],
        qty: action.value,
      },
    };
  }

  return state;
};

/**
 * Reducer used for updating the total cost of the job
 * (this is calculated based on selected products, fees, commission, etc)
 * @param {*} state
 * @param {*} value
 * @returns
 */
const costOfJob = (state = initialState.costOfJob, action) => {
  if (action.type === "UPDATE_COST_JOB") {
    return action.value;
  }

  return state;
};

/**
 * Combine all of our reducers into a single reducer for export and use to create a global store
 */
const allReducers = combineReducers({
  filters, // the available filters
  allProducts, // all of the products available
  selectedProduct, // the selected product
  jobTableContents, // the contents the user has added to the table for pricing out a job
  unitCostTax,
  multipliers,
  multiplier,
  commissions,
  commission,
  fees,
  labor,
  costOfJob,
  resetProposal,
  selectedProposal,
});

// The root reducer for handling resetting the state
const PricingReducer = (state, action) => {
  if (action.type === "RESET_PROPOSAL") {
    return allReducers(
      {
        allProducts: state.allProducts,
        filters: state.filters,
        selectedProposal: state.selectedProposal,
        commissions: state.commissions,
        multipliers: state.multipliers,
      },
      action
    );
  }

  return allReducers(state, action);
};

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

export function updateSelectedProposal(value) {
  return {
    type: "SELECT_PROPOSAL",
    value,
  };
}

export default PricingReducer;
