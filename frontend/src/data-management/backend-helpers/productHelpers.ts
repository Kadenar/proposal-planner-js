import { validateProductInfo } from "./BackendValidation.ts";
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
export async function fetchProducts(): Promise<Interface.Products> {
  return runGetRequest("products");
}

/**
 * Add a new product to the database
 * @returns
 */
export async function addProduct(
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
  filter_guid: string,
  modelName: string,
  catalogNum: string,
  unitCost: number,
  image?: any
) {
  const error = validateProductInfo(
    { label: filter_guid, guid: filter_guid },
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
