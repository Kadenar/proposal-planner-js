import {
  validateClientInfo,
  validateProductInfo,
} from "./BackendValidation.ts";
import {
  runGetRequest,
  runPostRequest,
  simpleDeleteItemInArrayFromDatabase,
  simpleDeleteFromDatabase,
  simpleAddToDatabase,
  simpleAddObjectToDatabase,
} from "./BackendHelpers.ts";
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
 * Fetch all proposals in the database
 * @returns
 */
export async function deleteProposalsForClient(
  client_guid: string
): Promise<any> {
  const proposals = await fetchProposals();

  const filtered_proposals = proposals.filter((proposal) => {
    return proposal.client_guid !== client_guid;
  });

  // Run a post request with our original proposals
  return runPostRequest(filtered_proposals, "proposals");
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
  selectedFilter: { label: string; guid: string },
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

  const conflict = existingProductData[selectedFilter.guid].find(
    (existing: Interface.ProductObject) => {
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

  if (newProducts[selectedFilter.guid] === undefined) {
    newProducts[selectedFilter.guid] = [
      {
        model: modelName,
        catalog: catalogNum,
        cost: unitCost,
        image: image,
        guid: crypto.randomUUID(),
      },
    ];
  } else {
    newProducts[selectedFilter.guid] = [
      ...(existingProductData[selectedFilter.guid] || [selectedFilter.guid]),
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
    { label: selectedFilter, guid: selectedFilter },
    modelName,
    catalogNum,
    unitCost
  );

  if (error) {
    return error;
  }

  const filter_guid = selectedFilter.toLowerCase().replaceAll(" ", "_");
  const existingProductData = await fetchProducts();

  const index = existingProductData[filter_guid].findIndex(
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
  newProductsData[filter_guid][index] = {
    ...newProductsData[filter_guid][index],
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

  const guid = label.toLowerCase().replaceAll(" ", "_");
  const conflict = existingTypes.find((existing) => {
    return existing.guid === guid;
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
      guid,
    }),
    "types"
  );
}

/**
 * Edits a property type
 * @param label the new label of the property type
 * @param guid the new back_end value of the property type
 * @returns
 */
export const editProductType = async (label: string, guid: string) => {
  const existingTypes = await fetchProductTypes();

  // A product type with the same guid already exists
  const new_guid = label.toLowerCase().replaceAll(" ", "_");
  const conflict = existingTypes.find((existing) => {
    return existing.guid === new_guid;
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
    return existing.guid === guid;
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
    guid: guid,
  };

  return runPostRequest(newProductTypes, "types");
};

/**
 * Delete a given product type from the database
 * @param {*} productName
 * @returns
 */
export async function deleteProductType(name: string) {
  return simpleDeleteFromDatabase(fetchProductTypes, "types", name, "guid");
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
  client_guid: string
) {
  if (name === "") {
    return {
      status: 500,
      data: {
        message: "Proposal name cannot be blank.",
      },
    };
  }

  if (client_guid === "") {
    return {
      status: 500,
      data: {
        message: "Client name cannot be blank.",
      },
    };
  }

  const existingProposals = await fetchProposals();
  const newProposal = getNewProposalItem(name, description, client_guid);
  return runPostRequest(existingProposals.concat(newProposal), "proposals");
}

/**
 * Delete a given proposal from the database
 * @returns
 */
export async function deleteProposal(guid: string) {
  return simpleDeleteFromDatabase(fetchProposals, "proposals", guid, "guid");
}

export async function addNewClient(clientInfo: Interface.ClientObject) {
  const error = validateClientInfo(
    clientInfo.name,
    clientInfo.address,
    clientInfo.state,
    clientInfo.city,
    clientInfo.zip
  );

  if (error) {
    return error;
  }

  return simpleAddObjectToDatabase(fetchClients, "clients", {
    guid: crypto.randomUUID(),
    name: clientInfo.name,
    address: clientInfo.address,
    apt: clientInfo.apt,
    state: clientInfo.state,
    city: clientInfo.city,
    zip: clientInfo.zip,
  });
}

/**
 * Deletes a given client
 * @returns
 */
export async function deleteClient(guid: string) {
  const response = await simpleDeleteFromDatabase(
    fetchClients,
    "clients",
    guid,
    "guid"
  );

  return response;
}

/**
 * Saves a given client details
 * @returns
 */
export async function saveClient(clientInfo: Interface.ClientObject) {
  const errors = validateClientInfo(
    clientInfo.name,
    clientInfo.address,
    clientInfo.state,
    clientInfo.city,
    clientInfo.zip
  );

  if (errors) {
    return errors;
  }

  const existingClients = await fetchClients();

  const index = existingClients.findIndex((client) => {
    return client.guid === clientInfo.guid;
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
    name: clientInfo.name,
    address: clientInfo.address,
    apt: clientInfo.apt,
    city: clientInfo.city,
    state: clientInfo.state,
    zip: clientInfo.zip,
    phone: clientInfo.phone,
    email: clientInfo.email,
    accountNum: clientInfo.accountNum,
  };

  return runPostRequest(newClients, "clients");
}

/**
 * Saves a given proposal
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
  client_guid: string
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
    client_guid,
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
