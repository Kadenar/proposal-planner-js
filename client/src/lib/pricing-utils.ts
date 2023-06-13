import { Dispatch } from "@reduxjs/toolkit";
import { addProductToProposal } from "../services/slices/activeProposalSlice";
import { showSnackbar } from "../components/CustomSnackbar";
import * as Interfaces from "../middleware/Interfaces";

export const handleAddProductToProposal = (
  dispatch: Dispatch,
  activeProposal: Interfaces.ProposalObject | undefined,
  selectedProduct: Interfaces.ProductObject | null,
  qty: number,
  quote_option: number
) => {
  if (!activeProposal) {
    showSnackbar({
      title: "You can't add a product to a non-active proposal!",
      show: true,
      status: "error",
    });
    return false;
  }

  if (!selectedProduct) {
    showSnackbar({
      title: "Please select a product to add!",
      show: true,
      status: "error",
    });
    return false;
  }

  if (qty <= 0) {
    showSnackbar({
      title: "Please specify a quantity greater than 0.",
      show: true,
      status: "error",
    });
    return false;
  }

  const existingProduct = activeProposal.data.products.find(
    (product) => product.guid === selectedProduct.guid
  );

  // Check if product is added to proposal in 1 of existing options
  if (existingProduct) {
    if (quote_option === 0) {
      showSnackbar({
        title:
          "Product is already applied to a specific quote and cannot be applied to All.",
        show: true,
        status: "error",
      });
      return false;
    }

    if (existingProduct.quote_option === 0) {
      showSnackbar({
        title: "Product is already being applied to All quote options.",
        show: true,
        status: "error",
      });
      return false;
    }

    if (existingProduct.quote_option === quote_option) {
      showSnackbar({
        title: "Product has already been added to the selected quote option.",
        show: true,
        status: "error",
      });
      return false;
    }
  }

  addProductToProposal(dispatch, {
    guid: selectedProduct.guid,
    name: selectedProduct.model,
    modelNum: selectedProduct.modelNum,
    cost: selectedProduct.cost,
    qty,
    quote_option,
  });

  showSnackbar({
    title: "Successfully added product",
    show: true,
    status: "success",
  });

  return true;
};

// Calculate the total cost of labor
export default function calculateLabor(labors: Interfaces.PsuedoObjectOfLabor) {
  let totalLabor = 0;
  Object.keys(labors).forEach((labor) => {
    totalLabor += labors[labor].qty * labors[labor].cost;
  });

  return totalLabor;
}

export function calculateFees(fees: Interfaces.PsuedoObjectOfFees) {
  let costOfFees = 0;

  Object.keys(fees).forEach((fee) => {
    const cost = fees[fee].cost * fees[fee].qty;

    if (fees[fee].type === "add") {
      costOfFees += cost;
    } else {
      costOfFees -= cost;
    }
  });

  return costOfFees;
}

// Handle formatting input cells with a '$' in front
export function ccyFormat(num: number) {
  if (!num) {
    num = 0;
  }
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
  return formatted;
}

export function getQuoteName(option_num: number) {
  if (option_num === 0) {
    return "All";
  }

  return `Quote ${option_num}`;
}

export function calculateCostForProductsInOption(
  option: Interfaces.ProductOnProposal[]
) {
  return option
    .map(({ cost, qty }) => cost * qty)
    .reduce((sum, i) => sum + i, 0);
}

export function calculateCostForOption(
  proposal: Interfaces.ProposalObject,
  option: Interfaces.ProductOnProposal[],
  costsFromAllOption: number
) {
  const { unitCostTax, commission, multiplier, labor, fees } = proposal.data;

  const TAX_RATE = unitCostTax / 100.0;

  const itemSubtotal =
    calculateCostForProductsInOption(option) + costsFromAllOption;

  const invoiceTaxes = TAX_RATE * itemSubtotal;
  const totalWithTaxes = itemSubtotal + invoiceTaxes;

  // Cost for labor
  const costOfLabor = calculateLabor(labor);
  const costWithLabor = totalWithTaxes + costOfLabor;

  // Get the cost after applying the multiplier to the job
  const costAfterMultiplier = costWithLabor * multiplier;

  // Get the cost that the multiplier has added to the job
  const multiplierValue = costAfterMultiplier - costWithLabor;

  // Cost of fees
  const costOfFees = calculateFees(fees);
  const costAfterFees = costAfterMultiplier + costOfFees;

  // Commission amount expected to be earned
  const commissionAmount = costAfterFees * (commission / 100.0);
  const invoiceTotal = costAfterFees + commissionAmount;

  return {
    itemSubtotal: itemSubtotal,
    invoiceTaxes: invoiceTaxes,
    totalWithTaxes: totalWithTaxes,
    costOfLabor: costOfLabor,
    costWithLabor: costWithLabor,
    multiplierValue: multiplierValue,
    costAfterMultiplier: costAfterMultiplier,
    costOfFees: costOfFees,
    costAfterFees: costAfterFees,
    commissionAmount: commissionAmount,
    invoiceTotal: invoiceTotal,
  };
}

// Takes the fees present on the proposal, and removes any that are not in sync with the system
export function returnOnlyValidFees(
  proposalFees: Interfaces.PsuedoObjectOfFees,
  availableFees: Interfaces.Fee[]
) {
  return availableFees
    .filter((_, index) => proposalFees[index] === undefined)
    .reduce(
      (result, fee, index) => ({
        ...result,
        [fee.guid]: {
          ...proposalFees[fee.guid],
          name: availableFees[index].name,
        },
      }),
      {}
    );
}

// Takes any labor present on the proposal, and removes any that are not in sync with the system
export function returnOnlyValidLabor(
  proposalLabors: Interfaces.PsuedoObjectOfLabor,
  availableLabors: Interfaces.Labor[]
) {
  return availableLabors
    .filter((_, index) => proposalLabors[index] === undefined)
    .reduce(
      (result, labor, index) => ({
        ...result,
        [labor.guid]: {
          ...proposalLabors[labor.guid],
          name: availableLabors[index].name,
        },
      }),
      {}
    );
}

export const US_STATES = [
  {
    name: "Alabama",
    code: "AL",
  },
  {
    name: "Alaska",
    code: "AK",
  },
  {
    name: "Arizona",
    code: "AZ",
  },
  {
    name: "Arkansas",
    code: "AR",
  },
  {
    name: "California",
    code: "CA",
  },
  {
    name: "Colorado",
    code: "CO",
  },
  {
    name: "Connecticut",
    code: "CT",
  },
  {
    name: "Delaware",
    code: "DE",
  },
  {
    name: "Florida",
    code: "FL",
  },
  {
    name: "Georgia",
    code: "GA",
  },
  {
    name: "Hawaii",
    code: "HI",
  },
  {
    name: "Idaho",
    code: "ID",
  },
  {
    name: "Illinois",
    code: "IL",
  },
  {
    name: "Indiana",
    code: "IN",
  },
  {
    name: "Iowa",
    code: "IA",
  },
  {
    name: "Kansas",
    code: "KS",
  },
  {
    name: "Kentucky",
    code: "KY",
  },
  {
    name: "Louisiana",
    code: "LA",
  },
  {
    name: "Maine",
    code: "ME",
  },
  {
    name: "Maryland",
    code: "MD",
  },
  {
    name: "Massachusetts",
    code: "MA",
  },
  {
    name: "Michigan",
    code: "MI",
  },
  {
    name: "Minnesota",
    code: "MN",
  },
  {
    name: "Mississippi",
    code: "MS",
  },
  {
    name: "Missouri",
    code: "MO",
  },
  {
    name: "Montana",
    code: "MT",
  },
  {
    name: "Nebraska",
    code: "NE",
  },
  {
    name: "Nevada",
    code: "NV",
  },
  {
    name: "New Hampshire",
    code: "NH",
  },
  {
    name: "New Jersey",
    code: "NJ",
  },
  {
    name: "New Mexico",
    code: "NM",
  },
  {
    name: "New York",
    code: "NY",
  },
  {
    name: "North Carolina",
    code: "NC",
  },
  {
    name: "North Dakota",
    code: "ND",
  },
  {
    name: "Ohio",
    code: "OH",
  },
  {
    name: "Oklahoma",
    code: "OK",
  },
  {
    name: "Oregon",
    code: "OR",
  },
  {
    name: "Pennsylvania",
    code: "PA",
  },
  {
    name: "Rhode Island",
    code: "RI",
  },
  {
    name: "South Carolina",
    code: "SC",
  },
  {
    name: "South Dakota",
    code: "SD",
  },
  {
    name: "Tennessee",
    code: "TN",
  },
  {
    name: "Texas",
    code: "TX",
  },
  {
    name: "Utah",
    code: "UT",
  },
  {
    name: "Vermont",
    code: "VT",
  },
  {
    name: "Virginia",
    code: "VA",
  },
  {
    name: "Washington",
    code: "WA",
  },
  {
    name: "West Virginia",
    code: "WV",
  },
  {
    name: "Wisconsin",
    code: "WI",
  },
  {
    name: "Wyoming",
    code: "WY",
  },
];
