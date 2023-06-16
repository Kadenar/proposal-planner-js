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
  const products: PsuedoObjectOfProducts = await runGetRequest("products");

  const ordered = Object.keys(products)
    .sort()
    .reduce((obj, key) => {
      obj[key] = products[key];
      return obj;
    }, {} as PsuedoObjectOfProducts);

  return ordered;
}

/**
 * Add a new product to the database
 * @returns
 */
export async function addProduct(
  filter_guid: string | undefined,
  modelName: string,
  modelNum: string,
  description: string,
  cost: number,
  image?: any
) {
  try {
    validateProductInfo(
      filter_guid || "",
      filter_guid,
      modelName,
      modelNum,
      cost
    );
  } catch (e) {
    if (e instanceof Error) {
      return {
        status: 500,
        data: { message: e.message },
      };
    }

    return {
      status: 500,
      data: {
        message: "Internal server error - Could not validate product info.",
      },
    };
  }

  const existingProductData = await fetchProducts();

  if (
    existingProductData[filter_guid]?.find((existing: ProductObject) => {
      return existing.modelNum === modelNum || existing.modelNum === modelNum;
    })
  ) {
    return {
      status: 500,
      data: {
        message:
          "Another product with the same name / model number already exists.",
      },
    };
  }

  const updatedProducts = insertNewProduct(
    { ...existingProductData },
    filter_guid,
    modelName,
    modelNum,
    cost,
    description,
    image
  );

  // Filter out any categories that have no products associated with them
  const filteredProducts: PsuedoObjectOfProducts = {};
  Object.keys(updatedProducts)
    .filter((product) => updatedProducts[product].length !== 0)
    .forEach((name) => {
      filteredProducts[name] = updatedProducts[name];
    });

  return runPostRequest(filteredProducts, "products");
}

// Helper method for inserting a new product into the database (handling when the category does not exist)
const insertNewProduct = (
  newProducts: PsuedoObjectOfProducts,
  filter_guid: string,
  modelName: string,
  modelNum: string,
  cost: number,
  description: string,
  image?: any
) => {
  if (newProducts[filter_guid] === undefined) {
    newProducts[filter_guid] = [
      {
        guid: crypto.randomUUID(),
        model: modelName,
        modelNum,
        cost,
        description,
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
        description,
        cost,
        image,
      },
    ];
  }

  return newProducts;
};

/**
 * Edit an existing product in the database
 * @returns
 */
export async function editExistingProduct(
  guid: string,
  existing_filter_guid: string,
  new_filter_guid: string | undefined,
  modelName: string,
  modelNum: string,
  description: string,
  cost: number,
  image?: any
) {
  try {
    validateProductInfo(
      existing_filter_guid,
      new_filter_guid,
      modelName,
      modelNum,
      cost
    );
  } catch (e: unknown) {
    if (e instanceof Error) {
      return {
        status: 500,
        data: { message: e.message },
      };
    }

    return {
      status: 500,
      data: {
        message: "Internal server error - Could not validate product info.",
      },
    };
  }

  const existingProductData = await fetchProducts();

  // Find the existing product in current category
  const index = existingProductData[existing_filter_guid].findIndex(
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

  let newProductsData = { ...existingProductData };

  // If moving the product to a new category...
  if (existing_filter_guid !== new_filter_guid) {
    // Check for conflicts in the new location
    const conflictIndex = existingProductData[new_filter_guid]?.findIndex(
      (existingProduct: ProductObject) => {
        return existingProduct.guid === guid;
      }
    );

    if (conflictIndex && conflictIndex !== -1) {
      return {
        status: 500,
        data: {
          message:
            "Cannot move product to specified category. It already exists there.",
        },
      };
    }

    // Remove the product from the existing category
    newProductsData[existing_filter_guid].splice(index, 1);

    // Add the product to the new category
    newProductsData = insertNewProduct(
      newProductsData,
      new_filter_guid,
      modelName,
      modelNum,
      cost,
      description,
      image
    );
  }
  // Otherwise, just edit it in place
  else {
    newProductsData[existing_filter_guid][index] = {
      ...newProductsData[existing_filter_guid][index],
      model: modelName,
      modelNum,
      cost,
      description,
      image,
    };
  }

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
  Object.keys(productData).map((category) => {
    return productData[category].forEach((model: ProductObject) => {
      products.push({
        category,
        model: model.model,
        modelNum: model.modelNum,
        cost: model.cost,
        description: model.description,
        guid: model.guid,
        image: model.image,
      });
    });
  });

  return products;
};

function validateProductInfo(
  existing_filter_guid: string,
  new_filter_guid: string | undefined,
  modelName: string,
  modelNum: string,
  cost: number
): asserts new_filter_guid is NonNullable<string> {
  if (
    !existing_filter_guid ||
    !new_filter_guid ||
    existing_filter_guid === "" ||
    new_filter_guid === ""
  ) {
    throw Error("Please specify a valid filter.");
  }

  if (modelName === "") {
    throw Error("Please specify a valid model name.");
  }

  if (modelNum === "") {
    throw Error("Please specify a model #.");
  }

  if (cost <= 0) {
    throw Error("Please specify a non-zero cost.");
  }
}
