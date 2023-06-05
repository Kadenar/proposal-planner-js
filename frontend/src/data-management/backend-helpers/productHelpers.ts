import {
  runGetRequest,
  runPostRequest,
  simpleDeleteItemInArrayFromDatabase,
} from "./database-actions.ts";
import * as Interface from "./Interfaces.ts";

/**
 * Fetch all products in the database
 * @returns
 */
export async function fetchProducts(): Promise<Interface.ObjectOfProducts> {
  return runGetRequest("products");
}

/**
 * Add a new product to the database
 * @returns
 */
export async function addProduct(
  filter_guid: string,
  modelName: string,
  catalogNum: string,
  unitCost: number,
  image?: any
) {
  const error = validateProductInfo(
    filter_guid,
    modelName,
    catalogNum,
    unitCost
  );

  if (error) {
    return error;
  }

  const existingProductData = await fetchProducts();

  const conflict = existingProductData[filter_guid]?.find(
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

  if (newProducts[filter_guid] === undefined) {
    newProducts[filter_guid] = [
      {
        model: modelName,
        catalog: catalogNum,
        cost: unitCost,
        image: image,
        guid: crypto.randomUUID(),
      },
    ];
  } else {
    newProducts[filter_guid] = [
      ...newProducts[filter_guid],
      {
        guid: crypto.randomUUID(),
        model: modelName,
        catalog: catalogNum,
        cost: unitCost,
        image: image,
      },
    ];
  }

  // Filter out any categories that have no products associated with them
  const filteredProducts: Interface.ObjectOfProducts = {};
  Object.keys(newProducts)
    .filter((product) => newProducts[product].length !== 0)
    .forEach((name) => {
      filteredProducts[name] = newProducts[name];
    });

  return runPostRequest(filteredProducts, "products");
}

/**
 * Edit an existing product in the database
 * @returns
 */
export async function editExistingProduct(
  guid: string,
  filter_guid: string,
  modelName: string,
  catalogNum: string,
  unitCost: number,
  image?: any
) {
  const error = validateProductInfo(
    filter_guid,
    modelName,
    catalogNum,
    unitCost
  );

  if (error) {
    return error;
  }

  const existingProductData = await fetchProducts();

  const index = existingProductData[filter_guid].findIndex(
    (existingProduct: Interface.ProductObject) => {
      return existingProduct.guid === guid;
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
  return simpleDeleteItemInArrayFromDatabase(
    fetchProducts,
    "products",
    filter,
    guid,
    "guid"
  );
}

/**
 * Given the database product data, flatten all of the keys into a single array
 * @returns
 */
export const flattenProductData = (productData: Interface.ObjectOfProducts) => {
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

function validateProductInfo(
  filter_guid: string,
  modelName: string,
  catalogNum: string,
  unitCost: number
) {
  if (filter_guid === "") {
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
      data: { message: "Please specify a model #." },
    };
  }

  if (!unitCost || unitCost <= 0) {
    return {
      status: 500,
      data: { message: "Please specify a non-zero cost." },
    };
  }

  return null;
}
