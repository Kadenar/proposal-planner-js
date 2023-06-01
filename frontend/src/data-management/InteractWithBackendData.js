import axios from "axios";

/**
 * Fetch all products in the database
 * @returns
 */
export const fetchProducts = async () => {
  return runGetRequest("products");
};

/**
 * Fetch all product types in the database
 * @returns
 */
export const fetchProductTypes = async () => {
  return runGetRequest("types");
};

/**
 * Fetch all proposals in the database
 * @returns
 */
export const fetchProposals = async () => {
  return runGetRequest("proposals");
};

/**
 * Fetch all commissions in the database
 * @returns
 */
export const fetchCommissions = async () => {
  return runGetRequest("commissions");
};

/**
 * Fetch all multipliers in the database
 * @returns
 */
export const fetchMultipliers = async () => {
  return runGetRequest("multipliers");
};

/**
 * Adds a new product to the database
 * @param {*} newProduct
 * @returns
 */
export const addNewProduct = async ({
  selectedFilter,
  modelName,
  catalogNum,
  unitCost,
}) => {
  if (selectedFilter.label === "" || selectedFilter.standard_value === "") {
    return {
      status: 500,
      data: { message: "Please specify a valid filter." },
    };
  }

  if (modelName === "") {
    return {
      status: 500,
      data: { message: "Please specify a valid model name." },
    };
  }

  if (catalogNum === "") {
    return {
      status: 500,
      data: { message: "Please specify a catalog num." },
    };
  }

  if (unitCost === "" || unitCost <= 0) {
    return {
      status: 500,
      data: { message: "Please specify a non-zero cost." },
    };
  }

  const existingProductData = await fetchProducts();

  const conflict = existingProductData[selectedFilter.standard_value].find(
    (existing) => {
      return existing.model === modelName || existing.catalog === catalogNum;
    }
  );

  if (conflict) {
    return {
      status: 500,
      data: {
        message:
          "Another product with the same name / catalog number already exists.",
      },
    };
  }

  const newProducts = { ...existingProductData };

  if (newProducts[selectedFilter.standard_value] === undefined) {
    newProducts[selectedFilter.standard_value] = [
      {
        model: modelName,
        catalog: catalogNum,
        cost: unitCost,
        guid: crypto.randomUUID(),
      },
    ];
  } else {
    newProducts[selectedFilter.standard_value] = [
      ...(existingProductData[selectedFilter.standard_value] || [
        selectedFilter.standard_value,
      ]),
      ...[
        {
          model: modelName,
          catalog: catalogNum,
          cost: unitCost,
          guid: crypto.randomUUID(),
        },
      ],
    ];
  }

  const newProductResponse = await runPostRequest(newProducts, "products");
  return newProductResponse;
};

/**
 * Edit an existing product in the database
 * @param {*} productInfo
 * @returns
 */
export const editExistingProduct = async (productInfo) => {
  const { guid, selectedFilter, modelName, catalogNum, unitCost } = productInfo;
  const standard_value = selectedFilter.toLowerCase().replaceAll(" ", "_");
  const existingProductData = await fetchProducts();

  const index = existingProductData[standard_value].findIndex((existing) => {
    return existing.guid === guid;
  });

  if (index === -1) {
    return {
      status: 500,
      data: { message: "Could not find product to edit." },
    };
  }

  const newProductsData = { ...existingProductData };
  newProductsData[standard_value][index] = {
    ...newProductsData[standard_value][index],
    model: modelName,
    catalog: catalogNum,
    cost: unitCost,
  };

  return runPostRequest(newProductsData, "products");
};

/**
 * Delete a given product from the database
 * @param {*} productName
 * @returns
 */
export const deleteProduct = async ({ guid, filter }) => {
  const response = await simpleDeleteItemInArrayFromDatabase({
    fetchItemsFunc: fetchProducts,
    path: "products",
    arrayKey: filter,
    valueToDelete: guid,
    valueKey: "guid",
  });

  return response;
};

/**
 * Adds a new product type to the database
 * @param {*} newProduct
 * @returns
 */
export const addNewProductType = async ({ label }) => {
  if (label === "") {
    return {
      status: 500,
      data: { message: "A valid product type name must be specified!" },
    };
  }

  const existingTypes = await fetchProductTypes();

  const standard_value = label.toLowerCase().replaceAll(" ", "_");
  const conflict = existingTypes.find((existing) => {
    return existing.standard_value === standard_value;
  });

  if (conflict) {
    return {
      status: 500,
      data: { message: "Product type already exists." },
    };
  }

  return runPostRequest(
    existingTypes.concat({
      label,
      standard_value,
    }),
    "types"
  );
};

export const editProductType = async ({ label, standard_value }) => {
  const existingTypes = await fetchProductTypes();

  // Cannot have a conflicting entry already
  const new_standard_value = label.toLowerCase().replaceAll(" ", "_");
  const conflict = existingTypes.find((existing) => {
    return existing.standard_value === new_standard_value;
  });

  if (conflict) {
    return {
      status: 500,
      data: {
        message: "Product type already exists. Specify a different name.",
      },
    };
  }

  const index = existingTypes.findIndex((existing) => {
    return existing.standard_value === standard_value;
  });

  if (index === -1) {
    return {
      status: 500,
      data: {
        message: "Product type could not be found - internal server error.",
      },
    };
  }

  const newProductTypes = [...existingTypes];
  newProductTypes[index] = {
    label: label,
    standard_value: new_standard_value,
  };

  return runPostRequest(newProductTypes, "types");
};

/**
 * Delete a given product type from the database
 * @param {*} productName
 * @returns
 */
export const deleteProductType = async ({ name }) => {
  return simpleDeleteFromDatabase({
    fetchItemsFunc: fetchProductTypes,
    path: "types",
    valueToDelete: name,
    key: "standard_value",
  });
};

/**
 * Adds a new commission to the database
 * @param {*} newProduct
 * @returns
 */
export const addNewCommission = async (value) => {
  return simpleAddToDatabase({
    fetchItemsFunc: fetchCommissions,
    path: "commissions",
    valueToAdd: value,
  });
};

/**
 * Delete a given commission from the database
 * @param {*} productName
 * @returns
 */
export const deleteCommission = async (value) => {
  return simpleDeleteFromDatabase({
    fetchItemsFunc: fetchCommissions,
    path: "commissions",
    valueToDelete: value,
  });
};

/**
 * Adds a new multiplier to the database
 * @param {*} newProduct
 * @returns
 */
export const addMultiplier = async (value) => {
  return simpleAddToDatabase({
    fetchItemsFunc: fetchMultipliers,
    path: "multipliers",
    valueToAdd: value,
  });
};

/**
 * Delete a given multiplier from the database
 * @param {*} productName
 * @returns
 */
export const deleteMultiplier = async (value) => {
  return simpleDeleteFromDatabase({
    fetchItemsFunc: fetchMultipliers,
    path: "multipliers",
    valueToDelete: value,
  });
};

export const addProposal = async ({ name, description }) => {
  const existingItems = await fetchProposals();
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  const newItem = {
    name,
    description,
    dateCreated: `${month}/${day}/${year}`,
    dateModified: `${month}/${day}/${year}`,
    client: "Testing",
    guid: crypto.randomUUID(),
    data: {
      models: [],
      unitCostTax: "8.375",
      labor: {
        twoMenEightHours: {
          qty: "1",
          cost: "680.00",
        },
        twoMenSixteenHours: {
          qty: "0",
          cost: "1360.00",
        },
        twoMenTwentyHours: {
          qty: "0",
          cost: "1700",
        },
        threeMenTwentyFourHours: {
          qty: "0",
          cost: "2040",
        },
        threeMenThirtyHours: {
          qty: "0",
          cost: "2550",
        },
        subcontractors: {
          qty: "0",
          cost: "0",
        },
      },
      fees: {
        permit: {
          qty: "1",
          cost: "300",
        },
        financing: {
          qty: "1",
          cost: "0",
        },
        tempTank: {
          qty: "1",
          cost: "0",
        },
        removal: {
          qty: "1",
          cost: "0",
        },
        rebates: {
          qty: "1",
          cost: "0",
        },
      },
      multiplier: "1.5",
      commission: "8",
    },
  };

  return runPostRequest(existingItems.concat(newItem), "proposals");
};

/**
 * Delete a given proposal from the database
 * @param {*} productName
 * @returns
 */
export const deleteProposal = async ({ guid }) => {
  return simpleDeleteFromDatabase({
    fetchItemsFunc: fetchProposals,
    path: "proposals",
    valueToDelete: guid,
    key: "guid",
  });
};

export async function saveProposal({
  guid,
  commission,
  fees = [],
  labor = [],
  models = [],
  unitCostTax,
  multiplier,
}) {
  const existingProposals = await fetchProposals();
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  const index = existingProposals.findIndex((proposal) => {
    return proposal.guid === guid;
  });

  if (index === -1) {
    return {
      status: 500,
      data: { message: "Proposal could not be found in database." },
    };
  }

  const newProposals = [...existingProposals];

  newProposals[index] = {
    ...newProposals[index],
    dateModified: `${month}/${day}/${year}`,
  };

  newProposals[index].data = {
    ...newProposals[index].data,
    commission,
    unitCostTax,
    multiplier,
  };

  newProposals[index].data.fees = fees;
  newProposals[index].data.labor = labor;
  newProposals[index].data.models = models;

  return runPostRequest(newProposals, "proposals");
}

/**
 * Given the database product data, flatten all of the keys into a single array
 * @param {*} productData
 * @returns
 */
export const flattenProductData = (productData) => {
  const products = [];
  Object.keys(productData).map((key) => {
    return productData[key].forEach((model) => {
      products.push({
        category: key,
        label: model.model,
        catalog: model.catalog,
        cost: model.cost,
        guid: model.guid,
      });
    });
  });

  return products;
};

export const getFlattenedProductData = async () => {
  const productData = await fetchProducts();
  return flattenProductData(productData);
};

// HELPER FUNCTIONS RESIDE HERE \\
const runGetRequest = async (path = "") => {
  if (path === "") {
    return {
      status: 500,
      data: { message: "No path specified in get request." },
    };
  }

  const axiosGetResponse = await axios.get(`http://localhost:4000/${path}`);
  return axiosGetResponse.data || [];
};

const runPostRequest = async (items = [], path) => {
  const axiosPostResponse = await axios
    .post(`http://localhost:4000/${path}`, items)
    .then((res) => {
      return res;
    });

  return axiosPostResponse;
};

const simpleAddToDatabase = async ({
  fetchItemsFunc = async () => {},
  path = "",
  valueToAdd = "",
  keyToCheck = "value",
}) => {
  const existingItems = await fetchItemsFunc();

  const conflict = existingItems.find((existing) => {
    return existing[keyToCheck] === valueToAdd;
  });

  if (conflict) {
    return {
      status: 500,
      data: {
        message: "Object already exists. Specify a different name.",
      },
    };
  }

  const newItem = {
    value: valueToAdd,
    guid: crypto.randomUUID(),
  };
  return runPostRequest(existingItems.concat(newItem), path);
};

// Deletes a top level item from the database
const simpleDeleteFromDatabase = async ({
  fetchItemsFunc = async () => {},
  path = "",
  valueToDelete,
  key = "value",
}) => {
  if (path === "") {
    return {
      status: 500,
      data: { message: "Internal server error - incorrect path for delete." },
    };
  }

  const existingItems = await fetchItemsFunc();

  const index = existingItems.findIndex((existing) => {
    return existing[key] === valueToDelete;
  });

  if (index === -1) {
    return {
      status: 500,
      data: { message: "Could not find entry to delete." },
    };
  }

  const newItems = [...existingItems];
  newItems.splice(index, 1);

  return runPostRequest(newItems, path);
};

// Deletes an item from an array in the database
const simpleDeleteItemInArrayFromDatabase = async (
  fetchItemsFunc = async () => {},
  path = "",
  arrayKey = "",
  valueToDelete,
  valueKey = "guid"
) => {
  if (path === "") {
    return {
      status: 500,
      data: { message: "Internal server error - incorrect path for delete." },
    };
  }

  const existingItems = await fetchItemsFunc();

  const index = existingItems[arrayKey].findIndex((existing) => {
    return existing[valueKey] === valueToDelete;
  });

  if (index === -1) {
    return {
      status: 500,
      data: { message: "Could not find entry to delete." },
    };
  }

  const items = [...existingItems[arrayKey]];
  items.splice(index, 1);

  const newItems = { ...existingItems };
  newItems[arrayKey] = items;

  return runPostRequest(newItems, path);
};

// export const updateProductsTest = async () => {
//   const existingProductData = await FetchProductData();
//   const flattenedData = flattenProductData(existingProductData);

//   runPostRequest(flattenedData, "products2");
// };

// export const AddGUIDs = async () => {
//   const existingProductData = await FetchProductData();

//   const setObjectOfKeys = {};
//   Object.keys(existingProductData).forEach((key) => {
//     const arrayOfProductsForType = [...existingProductData[key]];

//     const newArrayOfProductsForType = arrayOfProductsForType.map((prod) => {
//       return { ...prod, guid: crypto.randomUUID() };
//     });

//     setObjectOfKeys[key] = newArrayOfProductsForType;
//   });

//   return runPostRequest(setObjectOfKeys, "products");
// };
