import axios from "axios";

/**
 * Fetch all commissions in the database
 * @returns
 */
export const FetchCommissions = async () => {
  const commissions = await axios.get("http://localhost:4000/commissions");
  return commissions.data || [];
};

/**
 * Fetch all multipliers in the database
 * @returns
 */
export const FetchMultipliers = async () => {
  const multipliers = await axios.get("http://localhost:4000/multipliers");
  return multipliers.data || [];
};

/**
 * Fetch all product types in the database
 * @returns
 */
export const FetchProductTypes = async () => {
  const types = await axios.get("http://localhost:4000/types");
  return types.data || [];
};

/**
 * Fetch all proposals in the database
 * @returns
 */
export const FetchProposalData = async () => {
  const proposals = await axios.get("http://localhost:4000/proposals");
  return proposals.data || [];
};

/**
 * Fetch all products in the database
 * @returns
 */
export const FetchProductData = async () => {
  const response = await axios.get("http://localhost:4000/products");
  return response.data || [];
};

/**
 * Creates a new product and adds it to the database
 * @param {*} newProduct
 * @returns
 */
export const PushNewProduct = async (newProduct) => {
  const { selectedFilter, modelName, catalogNum, unitCost } = newProduct;
  const existingProductData = await FetchProductData();

  const productData = {
    ...existingProductData,
    [selectedFilter.standard_value]: [
      ...(existingProductData[selectedFilter.standard_value] || []),
      ...[
        {
          model: modelName,
          catalog: catalogNum,
          cost: unitCost,
          guid: crypto.randomUUID(),
        },
      ],
    ],
  };

  const response = await axios
    .post("http://localhost:4000/products", productData)
    .then((res) => {
      return res;
    });

  return response;
};

/**
 * Edit an existing product in the database
 * @param {*} productInfo
 * @returns
 */
export const EditExistingProduct = async (productInfo) => {
  const { guid, selectedFilter, modelName, catalogNum, unitCost } = productInfo;
  const standard_value = selectedFilter.toLowerCase().replaceAll(" ", "_");

  const existingProductData = await FetchProductData();

  const index = existingProductData[standard_value].findIndex((existing) => {
    return existing.guid === guid;
  });

  const newProductsData = { ...existingProductData };

  newProductsData[standard_value][index] = {
    ...newProductsData[standard_value][index],
    model: modelName,
    catalog: catalogNum,
    cost: unitCost,
  };

  const response = await axios
    .post("http://localhost:4000/products", newProductsData)
    .then((res) => {
      return res;
    });

  return response;
};

/**
 * Delete a given product from the database
 * @param {*} productName
 * @returns
 */
export const deleteProduct = async (guid, filter) => {
  const existingProductData = await FetchProductData();

  const index = existingProductData[filter].findIndex((existing) => {
    return existing.guid === guid;
  });

  const items = [...existingProductData[filter]];
  items.splice(index, 1);

  const newProductsData = { ...existingProductData };
  newProductsData[filter] = items;

  const response = await axios
    .post("http://localhost:4000/products", newProductsData)
    .then((res) => {
      return res;
    });
  return response;
};

/**
 * Creates a new product and adds it to the database
 * @param {*} newProduct
 * @returns
 */
export const AddNewProductType = async (newType) => {
  const existingTypes = await FetchProductTypes();
  const standard_value = newType.toLowerCase().replaceAll(" ", "_");

  const response = await axios
    .post(
      "http://localhost:4000/types",
      existingTypes.concat({
        label: newType,
        standard_value,
      })
    )
    .then((res) => {
      return res;
    });

  return response;
};

/**
 * Delete a given product type from the database
 * @param {*} productName
 * @returns
 */
export const deleteProductType = async (name) => {
  const existingProductTypes = await FetchProductTypes();

  const index = existingProductTypes.findIndex((existing) => {
    return existing.standard_value === name;
  });

  const newProductTypes = [...existingProductTypes];
  newProductTypes.splice(index, 1);

  const response = await axios
    .post("http://localhost:4000/types", newProductTypes)
    .then((res) => {
      return res;
    });
  return response;
};

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
  const productData = await FetchProductData();
  return flattenProductData(productData);
};

/**
 * Edit an existing product in the database
 * @param {*} productInfo
 * @returns
 */
export const AddGUIDs = async () => {
  const existingProductData = await FetchProductData();

  const setObjectOfKeys = {};
  Object.keys(existingProductData).forEach((key) => {
    const arrayOfProductsForType = [...existingProductData[key]];

    const newArrayOfProductsForType = arrayOfProductsForType.map((prod) => {
      return { ...prod, guid: crypto.randomUUID() };
    });

    setObjectOfKeys[key] = newArrayOfProductsForType;
  });

  const response = await axios
    .post("http://localhost:4000/products", setObjectOfKeys)
    .then((res) => {
      return res;
    });

  return response;
};
