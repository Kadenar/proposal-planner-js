import {
  runGetRequest,
  runPostRequest,
  simpleDeleteItemInArrayFromDatabase,
} from "./database-actions.ts";
import {
  PsuedoObjectOfProducts,
  ProductObject,
  FlattenedProductObject,
} from "./Interfaces.ts";

/**
 * Fetch all products in the database
 * @returns
 */
export async function fetchProducts(): Promise<PsuedoObjectOfProducts> {
  return runGetRequest("products");
}

/**
 * Add a new product to the database
 * @returns
 */
export async function addProduct(
  filter_guid: string | undefined,
  modelName: string,
  modelNum: string,
  cost: number,
  image?: any
) {
  const error = validateProductInfo(filter_guid, modelName, modelNum, cost);

  if (error) {
    return error;
  }

  const existingProductData = await fetchProducts();

  const conflict = existingProductData[filter_guid]?.find(
    (existing: ProductObject) => {
      return existing.modelNum === modelNum || existing.modelNum === modelNum;
    }
  );

  if (conflict) {
    return {
      status: 500,
      data: {
        message:
          "Another product with the same name / modelNum number already exists.",
      },
    };
  }

  const newProducts = { ...existingProductData };

  if (newProducts[filter_guid] === undefined) {
    newProducts[filter_guid] = [
      {
        guid: crypto.randomUUID(),
        model: modelName,
        modelNum,
        cost,
        image,
      },
    ];
  } else {
    newProducts[filter_guid] = [
      ...newProducts[filter_guid],
      {
        guid: crypto.randomUUID(),
        model: modelName,
        modelNum,
        cost,
        image,
      },
    ];
  }

  // Filter out any categories that have no products associated with them
  const filteredProducts: PsuedoObjectOfProducts = {};
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
  modelNum: string,
  cost: number,
  image?: any
) {
  const error = validateProductInfo(filter_guid, modelName, modelNum, cost);

  if (error) {
    return error;
  }

  const existingProductData = await fetchProducts();

  const index = existingProductData[filter_guid].findIndex(
    (existingProduct: ProductObject) => {
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
    modelNum,
    cost,
    image,
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
export const flattenProductData = (productData: PsuedoObjectOfProducts) => {
  const products: FlattenedProductObject[] = [];
  Object.keys(productData).map((key) => {
    return productData[key].forEach((model: ProductObject) => {
      products.push({
        category: key,
        label: model.model,
        modelNum: model.modelNum,
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
  filter_guid: string | undefined,
  modelName: string,
  modelNum: string,
  cost: number
) {
  if (!filter_guid || filter_guid === "") {
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

  if (modelNum === "") {
    return {
      status: 500,
      data: { message: "Please specify a model #." },
    };
  }

  if (cost <= 0) {
    return {
      status: 500,
      data: { message: "Please specify a non-zero cost." },
    };
  }

  return undefined;
}
