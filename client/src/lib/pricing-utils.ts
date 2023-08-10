import * as Interfaces from "../middleware/Interfaces";

// Get the full product information from the database and combine it with the data on the proposal
export function getFullProductData(
  proposalProducts: Interfaces.ProductOnProposal[] | undefined,
  products: Interfaces.PsuedoObjectOfProducts
) {
  if (!proposalProducts) {
    return [];
  }

  return proposalProducts.map((product) => {
    const matchingProductInfo = products[product.category]?.find((matching) => {
      return matching.guid === product.guid;
    });

    // Map the name, model num, cost from database
    return {
      category: product.category,
      guid: matchingProductInfo?.guid || "",
      model: matchingProductInfo?.model || "",
      modelNum: matchingProductInfo?.modelNum || "",
      cost: matchingProductInfo?.cost || 0,
      quote_option: product.quote_option,
      qty: product.qty,
    };
  });
}

// Calculate the total cost of labor
export function calculateLabor(labors: Interfaces.LaborOnProposal[]) {
  let totalLabor = 0;
  labors.forEach((labor) => {
    totalLabor += labor.qty * labor.cost;
  });

  return totalLabor;
}

// Calculate the cost of fees on a proposal based on information in the database
export function calculateFees(
  fees: Interfaces.FeeOnProposal[],
  allFees: Interfaces.Fee[]
) {
  let costOfFees = 0;

  fees.forEach((fee) => {
    const matchingFee = allFees.find((matching) => matching.guid === fee.guid);

    // Only thing we let the user do is override the cost on the proposal
    const cost = fee.cost;

    if (matchingFee?.type === "add") {
      costOfFees += cost;
    } else {
      costOfFees -= cost;
    }
  });

  return costOfFees;
}

export function updateFinancingOptionsWithCost(
  financingOptions: Interfaces.Financing[],
  totalCost: number
) {
  return [...financingOptions].map((option) => {
    let totalNumPayments = option.term_length;
    // If it is yearly, multiply the payments by 12
    if (option.term_type === "years") {
      totalNumPayments *= 12;
    }

    const loanAmount = totalCost - 0; // Can replace 0 with the money down option if that were an option

    // Calculating the Payment Amount per Period
    // A = P * (r*(1+r)^n) / ((1+r)^n - 1)
    // a = payment amount per period
    // P = initial principal (loan amount)
    // r = interest rate per period
    // n = total number of payments or periods
    let ratePerPeriod = option.interest / 12.0 / 100.0;
    let paymentPerPeriod;

    // If the rate is 0, then the loan is just all principal payments
    if (ratePerPeriod === 0) {
      paymentPerPeriod = loanAmount / totalNumPayments;
    } else {
      const paymentPerPeriodTop =
        ratePerPeriod * Math.pow(1 + ratePerPeriod, totalNumPayments);
      const paymentPerPeriodBot =
        Math.pow(1 + ratePerPeriod, totalNumPayments) - 1;
      paymentPerPeriod =
        loanAmount * (paymentPerPeriodTop / paymentPerPeriodBot);
    }

    return {
      ...option,
      costPerMonth: paymentPerPeriod,
    };
  });
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

// Get a quote's user friendly name based on the index
export function getQuoteName(option_num: number) {
  if (option_num === 0) {
    return "All";
  }

  return `Quote ${option_num}`;
}

// Get a quote's user friendly name based on the quote_index naming
export function getQuoteNameStr(option_name: string) {
  return (
    option_name.charAt(0).toUpperCase() +
    option_name.slice(1).replaceAll("_", " ")
  );
}

// Calculate the cost for all products for a given option
export function calculateCostForProductsInOption(
  option: Interfaces.ProductOnProposalWithPricing[]
) {
  return option
    .map(({ cost, qty }) => cost * qty)
    .reduce((sum, i) => sum + i, 0);
}

// Calculate the total cost for an option including cost applied to all options, fees, labor
export function calculateCostForOption(
  option: Interfaces.ProductOnProposalWithPricing[],
  costsFromAllOptions: number,
  unit_cost_tax: number,
  costOfFees: number,
  costOfLabor: number
) {
  const TAX_RATE = unit_cost_tax < 0 ? 0 : unit_cost_tax / 100.0;

  const itemSubtotal =
    calculateCostForProductsInOption(option) + costsFromAllOptions;

  // Baseline cost after taxes
  const invoiceTaxes = TAX_RATE * itemSubtotal;
  const totalWithTaxes = itemSubtotal + invoiceTaxes;

  // Baseline cost after labor
  const costWithLabor = totalWithTaxes + costOfLabor;

  // Baseline cost after fees
  const costAfterFees = costWithLabor + costOfFees;

  return {
    itemSubtotal: itemSubtotal,
    invoiceTaxes: invoiceTaxes,
    totalWithTaxes: totalWithTaxes,
    costOfLabor: costOfLabor,
    costWithLabor: costWithLabor,
    costOfFees: costOfFees,
    costAfterFees: costAfterFees,
    invoiceTotal: costAfterFees,
  };
}

// Helper function to calculate the commission amount, and company margin for the job
const getCostsForCommissionLevel = (
  percent: number,
  sellPrice: number,
  basePrice: number
) => {
  const commissionAmount = sellPrice * (percent / 100.0);
  const companyMargin = sellPrice - basePrice - commissionAmount;

  return {
    commissionPercent: percent,
    commissionAmount,
    sellPrice,
    companyMargin,
  };
};

export function calculateMarkedUpCostsForOption(
  baseCost: number,
  costOfFees: number,
  costOfLabor: number,
  totalWithTaxes: number,
  laborMultipliers: Interfaces.Multiplier[],
  equipmentMultipliers: Interfaces.Multiplier[]
) {
  // Marks up the labor cost
  const markedUpLabor = laborMultipliers.map((multi) => {
    return costOfLabor * multi.value;
  });

  // Marks up the equipment + taxes cost
  const markedUpEquipment = equipmentMultipliers.map((multi) => {
    return totalWithTaxes * multi.value;
  });

  // Calculate the min, target and max sell prices based on markups
  const minSellPrice = markedUpLabor[0] + markedUpEquipment[0] + costOfFees;
  const targetSellPrice = markedUpLabor[1] + markedUpEquipment[1] + costOfFees;
  const minSellPrice2 = minSellPrice + (targetSellPrice - minSellPrice) / 3.0;
  const minSellPrice3 = minSellPrice2 + (targetSellPrice - minSellPrice2) / 3.0;
  const maxSellPrice = markedUpLabor[2] + markedUpEquipment[2] + costOfFees;
  const targetSellPrice2 =
    targetSellPrice + (maxSellPrice - targetSellPrice) / 3.0;
  const targetSellPrice3 =
    targetSellPrice2 + (maxSellPrice - targetSellPrice2) / 3.0;

  // Min sell price + (target sell price - min sell price) / 3
  return [
    getCostsForCommissionLevel(2.5, minSellPrice, baseCost),
    getCostsForCommissionLevel(4.0, minSellPrice2, baseCost),
    getCostsForCommissionLevel(5.5, minSellPrice3, baseCost),
    getCostsForCommissionLevel(7.0, targetSellPrice, baseCost),
    getCostsForCommissionLevel(7.5, targetSellPrice2, baseCost),
    getCostsForCommissionLevel(8.0, targetSellPrice3, baseCost),
    getCostsForCommissionLevel(8.5, maxSellPrice, baseCost),
    /*, 9.0, 9.5, 10 TODO - Add more commission options */
  ];
}

// Currently only support selling in New York - so no need for others
export const US_STATES = [
  {
    name: "New York",
    code: "NY",
  },
];
