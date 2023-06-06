// Calculate the total cost of labor
function calculateLabor(labors) {
  let totalLabor = 0;
  Object.keys(labors).forEach((labor) => {
    totalLabor += labors[labor].qty * labors[labor].cost;
  });

  return totalLabor;
}

function calculateFees(fees) {
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
export function ccyFormat(num) {
  if (!num) {
    num = 0;
  }

  return `${"$" + Number(num).toFixed(2)}`;
}

export function calculateTotalCost(proposal) {
  const { unitCostTax, commission, multiplier, models, labor, fees } = proposal;
  const TAX_RATE = unitCostTax / 100.0;

  // The total for just the products themselves
  const itemSubtotal = models
    .map(({ totalCost }) => totalCost)
    .reduce((sum, i) => sum + i, 0);

  // Total amount of taxes to be paid
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
export function returnOnlyValidFees({ proposalFees = {}, availableFees = [] }) {
  return availableFees
    .filter((fee) => proposalFees[fee] === undefined)
    .reduce(
      (result, fee) => ({
        ...result,
        [fee.guid]: proposalFees[fee.guid],
      }),
      {}
    );
}

// Takes any labor present on the proposal, and removes any that are not in sync with the system
export function returnOnlyValidLabor({
  proposalLabors = {},
  availableLabors = [],
}) {
  return availableLabors
    .filter((labor) => proposalLabors[labor] === undefined)
    .reduce(
      (result, labor) => ({
        ...result,
        [labor.guid]: proposalLabors[labor.guid],
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
