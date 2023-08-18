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
  return labors
    .map(({ cost, qty }) => cost * qty)
    .reduce((sum, i) => sum + i, 0);
}

// Calculate the cost of fees on a proposal based on information in the database
export function calculateFees(
  fees: Interfaces.FeeOnProposal[],
  allFees: Interfaces.Fee[]
) {
  let costOfFees = 0;

  fees.forEach((fee) => {
    // Find matching fee in database
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
  misc_materials: number,
  unit_cost_tax: number,
  costOfFees: number,
  costOfLabor: number
) {
  const TAX_RATE = unit_cost_tax < 0 ? 0 : unit_cost_tax / 100.0;

  const costOfEquipment = //8365;
    calculateCostForProductsInOption(option) + costsFromAllOptions;
  const equipmentPlusMaterials = costOfEquipment + misc_materials;

  // Baseline cost after taxes
  const costOfTaxes = TAX_RATE * equipmentPlusMaterials; // Just the cost of taxes
  const equipmentAndMaterialsWithTaxes = equipmentPlusMaterials + costOfTaxes; // Cost of taxes + cost of equipment and materials

  // Baseline cost after labor
  const costWithLabor = equipmentAndMaterialsWithTaxes + costOfLabor;

  // Baseline cost after fees
  const costAfterFees = costWithLabor + costOfFees;

  return {
    costOfEquipment,
    misc_materials,
    equipmentPlusMaterials,
    costOfTaxes,
    equipmentAndMaterialsWithTaxes,
    costOfLabor,
    costWithLabor,
    costOfFees,
    costAfterFees,
    invoiceTotal: costAfterFees,
  };
}

// Helper function to calculate the commission amount, and company margin for the job
const getMarkupTableInfo = (
  markedUpLabor: number,
  markedUpEquipment: number,
  markedUpMiscMaterials: number,
  percent: number,
  sellPrice: number,
  basePrice: number
) => {
  const commissionAmount = sellPrice * (percent / 100.0);
  const companyMargin = sellPrice - basePrice - commissionAmount;

  return {
    laborMarkup: markedUpLabor,
    equipmentMarkup: markedUpEquipment,
    miscMaterialMarkup: markedUpMiscMaterials,
    commissionPercent: percent,
    commissionAmount,
    sellPrice,
    companyMargin,
  };
};

export function calculateMarkedUpCostsForOption({
  misc_materials,
  costOfFees,
  costOfLabor,
  costOfEquipment,
  costOfTaxes,
  laborMultipliers,
  equipmentMultipliers,
  miscMaterialMultipliers,
}: {
  misc_materials: number;
  costOfFees: number;
  costOfLabor: number;
  costOfEquipment: number;
  costOfTaxes: number;
  laborMultipliers: Interfaces.Multiplier[];
  equipmentMultipliers: Interfaces.Multiplier[];
  miscMaterialMultipliers: Interfaces.Multiplier[];
}) {
  // Marks up the labor cost
  const markedUpLabor = laborMultipliers.map((multi) => {
    return costOfLabor * multi.value;
  });

  // Marks up the equipment + taxes cost
  const markedUpEquipment = equipmentMultipliers.map((multi) => {
    return costOfEquipment * multi.value;
  });

  // Marks up the misc materials
  const markedUpMiscMaterials = miscMaterialMultipliers.map((multi) => {
    return misc_materials * multi.value;
  });

  // Calculate the min, target and max sell prices based on markups
  const minSellPrice =
    markedUpLabor[0] +
    markedUpEquipment[0] +
    markedUpMiscMaterials[0] +
    costOfFees +
    costOfTaxes;

  // The target sale price
  const targetSellPrice =
    markedUpLabor[1] +
    markedUpEquipment[1] +
    markedUpMiscMaterials[1] +
    costOfFees +
    costOfTaxes;

  // Prices between minimum and target
  // Calculation for min 2 = Min + (Target - Min) / 3
  // Calculation for min 3 = Min 2 + (Target - Min) / 3
  const minLaborPrice2 =
    markedUpLabor[0] + (markedUpLabor[1] - markedUpLabor[0]) / 3.0;

  const minLaborPrice3 =
    minLaborPrice2 + (markedUpLabor[1] - markedUpLabor[0]) / 3.0;

  const minEquipmentPrice2 =
    markedUpEquipment[0] + (markedUpEquipment[1] - markedUpEquipment[0]) / 3.0;
  const minEquipmentPrice3 =
    minEquipmentPrice2 + (markedUpEquipment[1] - markedUpEquipment[0]) / 3.0;

  const minMiscMaterialPrice2 =
    markedUpMiscMaterials[0] +
    (markedUpMiscMaterials[1] - markedUpMiscMaterials[0]) / 3.0;
  const minMiscMaterialPrice3 =
    minMiscMaterialPrice2 +
    (markedUpMiscMaterials[1] - minMiscMaterialPrice2) / 3.0;

  const minSellPrice2 = minSellPrice + (targetSellPrice - minSellPrice) / 3.0;
  const minSellPrice3 = minSellPrice2 + (targetSellPrice - minSellPrice) / 3.0;

  // The maximum sale price
  const maxSellPrice =
    markedUpLabor[2] +
    markedUpEquipment[2] +
    markedUpMiscMaterials[2] +
    costOfFees +
    costOfTaxes;

  // The prices between max and target
  // Calculation for target 2 = Target + (Max - Target) / 3
  // Calculation for target 3 = Target 2 + (Max - Target) / 3
  const targetLaborPrice2 =
    markedUpLabor[1] + (markedUpLabor[2] - markedUpLabor[1]) / 3.0;
  const targetLaborPrice3 =
    targetLaborPrice2 + (markedUpLabor[2] - markedUpLabor[1]) / 3.0;

  const targetEquipmentPrice2 =
    markedUpEquipment[1] + (markedUpEquipment[2] - markedUpEquipment[1]) / 3.0;
  const targetEquipmentPrice3 =
    targetEquipmentPrice2 + (markedUpEquipment[2] - markedUpEquipment[1]) / 3.0;

  const targetMiscMaterialPrice2 =
    markedUpMiscMaterials[1] +
    (markedUpMiscMaterials[2] - markedUpMiscMaterials[1]) / 3.0;
  const targetMiscMaterialPrice3 =
    targetMiscMaterialPrice2 +
    (markedUpMiscMaterials[2] - markedUpMiscMaterials[1]) / 3.0;

  const targetSellPrice2 =
    targetSellPrice + (maxSellPrice - targetSellPrice) / 3.0;
  const targetSellPrice3 =
    targetSellPrice2 + (maxSellPrice - targetSellPrice) / 3.0;

  // Base price of the job
  const basePriceOfJob =
    costOfEquipment + costOfLabor + costOfTaxes + misc_materials + costOfFees;

  // Get markup information
  return [
    getMarkupTableInfo(
      markedUpLabor[0],
      markedUpEquipment[0],
      markedUpMiscMaterials[0],
      2.5,
      minSellPrice,
      basePriceOfJob
    ),
    getMarkupTableInfo(
      minLaborPrice2,
      minEquipmentPrice2,
      minMiscMaterialPrice2,
      4.0,
      minSellPrice2,
      basePriceOfJob
    ),
    getMarkupTableInfo(
      minLaborPrice3,
      minEquipmentPrice3,
      minMiscMaterialPrice3,
      5.5,
      minSellPrice3,
      basePriceOfJob
    ),
    getMarkupTableInfo(
      markedUpLabor[1],
      markedUpEquipment[1],
      markedUpMiscMaterials[1],
      7.0,
      targetSellPrice,
      basePriceOfJob
    ),
    getMarkupTableInfo(
      targetLaborPrice2,
      targetEquipmentPrice2,
      targetMiscMaterialPrice2,
      7.5,
      targetSellPrice2,
      basePriceOfJob
    ),
    getMarkupTableInfo(
      targetLaborPrice3,
      targetEquipmentPrice3,
      targetMiscMaterialPrice3,
      8.0,
      targetSellPrice3,
      basePriceOfJob
    ),
    getMarkupTableInfo(
      markedUpLabor[2],
      markedUpEquipment[2],
      markedUpMiscMaterials[2],
      8.5,
      maxSellPrice,
      basePriceOfJob
    ),
    // getCostsForCommissionLevel(9.0, maxSellPrice, costOfEquipment),
    // getCostsForCommissionLevel(9.5, maxSellPrice, costOfEquipment),
    // getCostsForCommissionLevel(10.0, maxSellPrice, costOfEquipment),
  ];
}

// Currently only support selling in New York - so no need for others
export const US_STATES = [
  {
    name: "New York",
    code: "NY",
  },
];
