import { validateClientInfo, validateProductInfo } from "./BackendValidation";
import {
  runGetRequest,
  runPostRequest,
  simpleDeleteItemInArrayFromDatabase,
  simpleDeleteFromDatabase,
  simpleAddToDatabase,
  simpleAddObjectToDatabase,
} from "./BackendHelpers";
import * as Interface from "./Interfaces";

/**
 * Fetch all clients in the database
 * @returns
 */
export async function fetchClients(): Promise<Interface.Clients> {
  return runGetRequest("clients");
}

/**
 * Fetch all products in the database
 * @returns
 */
export async function fetchProducts(): Promise<Interface.Products> {
  return runGetRequest("products");
}

/**
 * Fetch all product types in the database
 * @returns
 */
export async function fetchProductTypes(): Promise<Interface.ProductTypes> {
  return runGetRequest("types");
}

/**
 * Fetch all proposals in the database
 * @returns
 */
export async function fetchProposals(): Promise<Interface.Proposals> {
  return runGetRequest("proposals");
}

/**
 * Fetch all commissions in the database
 * @returns
 */
export async function fetchCommissions(): Promise<
  [{ value: number; guid: string }]
> {
  return runGetRequest("commissions");
}

/**
 * Fetch all multipliers in the database
 * @returns
 */
export async function fetchMultipliers(): Promise<any> {
  return runGetRequest("multipliers");
}

/**
 * Adds a new product to the database
 * @returns
 */
export async function addNewProduct(
  selectedFilter: { label: string; standard_value: string },
  modelName: string,
  catalogNum: string,
  unitCost: number,
  image?: any
) {
  const error = validateProductInfo(
    selectedFilter,
    modelName,
    catalogNum,
    unitCost
  );

  if (error) {
    return error;
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
        image: image,
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
          image: image,
          guid: crypto.randomUUID(),
        },
      ],
    ];
  }

  const newProductResponse = await runPostRequest(newProducts, "products");
  return newProductResponse;
}

/**
 * Edit an existing product in the database
 * @returns
 */
export async function editExistingProduct(
  guid: string,
  selectedFilter: string,
  modelName: string,
  catalogNum: string,
  unitCost: number,
  image?: any
) {
  const error = validateProductInfo(
    { label: selectedFilter, standard_value: selectedFilter },
    modelName,
    catalogNum,
    unitCost
  );

  if (error) {
    return error;
  }

  const standard_value = selectedFilter.toLowerCase().replaceAll(" ", "_");
  const existingProductData = await fetchProducts();

  const index = existingProductData[standard_value].findIndex(
    (existing: Interface.ProductObject) => {
      return existing.guid === guid;
    }
  );

  if (index === -1) {
    return {
      status: 500,
      data: {
        message: "Internal server error - Could not find product to edit.",
      },
    };
  }

  const newProductsData = { ...existingProductData };
  newProductsData[standard_value][index] = {
    ...newProductsData[standard_value][index],
    model: modelName,
    catalog: catalogNum,
    cost: unitCost,
    image: image,
  };

  return runPostRequest(newProductsData, "products");
}

/**
 * Delete a given product from the database
 * @returns
 */
export async function deleteProduct(guid: string, filter: string) {
  const response = await simpleDeleteItemInArrayFromDatabase(
    fetchProducts,
    "products",
    filter,
    guid,
    "guid"
  );

  return response;
}

/**
 * Adds a new product type to the database
 * @returns
 */
export async function addNewProductType(label: string) {
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
}

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
export async function deleteProductType(name: string) {
  return simpleDeleteFromDatabase(
    fetchProductTypes,
    "types",
    name,
    "standard_value"
  );
}

/**
 * Adds a new commission to the database
 * @returns
 */
export async function addNewCommission(value: string) {
  return simpleAddToDatabase(fetchCommissions, "commissions", value);
}

/**
 * Delete a given commission from the database
 * @param {*} productName
 * @returns
 */
export async function deleteCommission(value: string) {
  return simpleDeleteFromDatabase(fetchCommissions, "commissions", value);
}

/**
 * Adds a new multiplier to the database
 * @returns
 */
export async function addMultiplier(value: string) {
  return simpleAddToDatabase(fetchMultipliers, "multipliers", value);
}

/**
 * Delete a given multiplier from the database
 * @returns
 */
export const deleteMultiplier = async (value: string) => {
  return simpleDeleteFromDatabase(fetchMultipliers, "multipliers", value);
};

export async function addProposal(
  name: string,
  description: string,
  client: string
) {
  const existingProposals = await fetchProposals();

  if (client === "") {
    return {
      status: 500,
      data: {
        message: "Client name cannot be blank.",
      },
    };
  }

  const newProposal = getNewProposalItem(name, description, client);
  const newProposals = existingProposals.concat(newProposal);
  return runPostRequest(newProposals, "proposals");
}

/**
 * Delete a given proposal from the database
 * @param {*} productName
 * @returns
 */
export async function deleteProposal(guid) {
  return simpleDeleteFromDatabase(fetchProposals, "proposals", guid, "guid");
}

export async function addNewClient(
  name: string,
  address: string,
  apt: string,
  state: string,
  city: string,
  zip: string
) {
  const error = validateClientInfo(name, address, state, city, zip);

  if (error) {
    return error;
  }

  return simpleAddObjectToDatabase(fetchClients, "clients", {
    name,
    address,
    apt,
    state,
    city,
    zip,
    guid: crypto.randomUUID(),
  });
}

/**
 * Deletes a given client
 * @param {*} param0
 * @returns
 */
export async function deleteClient(guid: string) {
  return simpleDeleteFromDatabase(fetchClients, "clients", guid, "guid");
}

/**
 * Saves a given client details
 * @param {*} param0
 * @returns
 */
export async function saveClient(
  guid: string,
  name: string,
  address: string,
  apt: string,
  city: string,
  state: string,
  zip: string,
  phone: string,
  email: string,
  accountNum: string
) {
  const errors = validateClientInfo(name, address, state, city, zip);

  if (errors) {
    return errors;
  }

  const existingClients = await fetchClients();

  const index = existingClients.findIndex((client) => {
    return client.guid === guid;
  });

  if (index === -1) {
    return {
      status: 500,
      data: { message: "Client could not be found in database." },
    };
  }

  const newClients = [...existingClients];
  newClients[index] = {
    ...newClients[index],
    name,
    address,
    apt,
    city,
    state,
    zip,
    phone,
    email,
    accountNum,
  };

  return runPostRequest(newClients, "clients");
}

/**
 * Saves a given proposal
 * @param {*} param0
 * @returns
 */
export async function saveProposal(
  guid: string,
  commission: number,
  fees: Interface.FeeObject,
  labor: Interface.LaborObject,
  models: Interface.Models,
  unitCostTax: number,
  multiplier: number
) {
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
    labor,
    fees,
    models,
  };

  // newProposals[index].data = {
  //   ...newProposals[index].data,
  //   fees,
  //   labor,
  //   models,
  // };
  // newProposals[index].data.fees = fees;
  // newProposals[index].data.labor = labor;
  // newProposals[index].data.models = models;

  return runPostRequest(newProposals, "proposals");
}

/**
 * Given the database product data, flatten all of the keys into a single array
 * @returns
 */
export const flattenProductData = (
  productData: Interface.ProductKeyObject<Interface.ProductObject>[]
) => {
  const products: Interface.FlattenedProductObject[] = [];
  Object.keys(productData).map((key) => {
    return productData[key].forEach((model: Interface.ProductObject) => {
      products.push({
        category: key,
        label: model.model,
        catalog: model.catalog,
        cost: model.cost,
        guid: model.guid,
        image: model.image,
      });
    });
  });

  return products;
};

export const getFlattenedProductData = async () => {
  const productData = await fetchProducts();
  return flattenProductData(productData);
};

const getNewProposalItem = (
  name: string,
  description: string,
  client: string
): Interface.ProposalObject => {
  const date = new Date();
  const dateNow = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  return {
    name,
    description,
    dateCreated: dateNow,
    dateModified: dateNow,
    client,
    guid: crypto.randomUUID(),
    data: {
      models: [],
      unitCostTax: 8.375,
      labor: {
        twoMenEightHours: {
          qty: 1,
          cost: 680.0,
        },
        twoMenSixteenHours: {
          qty: 0,
          cost: 1360.0,
        },
        twoMenTwentyHours: {
          qty: 0,
          cost: 1700,
        },
        threeMenTwentyFourHours: {
          qty: 0,
          cost: 2040,
        },
        threeMenThirtyHours: {
          qty: 0,
          cost: 2550,
        },
        subcontractors: {
          qty: 0,
          cost: 0,
        },
      },
      fees: {
        permit: {
          qty: 1,
          cost: 300,
        },
        financing: {
          qty: 1,
          cost: 0,
        },
        tempTank: {
          qty: 1,
          cost: 0,
        },
        removal: {
          qty: 1,
          cost: 0,
        },
        rebates: {
          qty: 1,
          cost: 0,
        },
      },
      multiplier: 1.5,
      commission: 8,
    },
  };
};

// HELPER FUNCTIONS RESIDE HERE \\

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
