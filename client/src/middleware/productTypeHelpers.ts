import { ProductTypeObject } from "./Interfaces.ts";
import {
  runGetRequest,
  runPostRequest,
  simpleDeleteFromDatabase,
} from "./database-actions.ts";

/**
 * Fetch all product types in the database
 * @returns
 */
export async function fetchProductTypes(): Promise<ProductTypeObject[]> {
  const results: ProductTypeObject[] = await runGetRequest("types");
  const sorted = results.sort((a, b) =>
    a.label > b.label ? 1 : b.label > a.label ? -1 : 0
  );

  return sorted;
}

/**
 * Add a new product type to the database
 * @returns
 */
export async function addProductType(label: string) {
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
 * Edit a property type
 * @returns
 */
export const editProductType = async (guid: string, newLabel: string) => {
  const existingTypes = await fetchProductTypes();

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
    label: newLabel,
    guid: guid, // ? keep guid and only change label - otherwise replace with new_guid,
  };

  return runPostRequest(newProductTypes, "types");
};

/**
 * Delete a given product type from the database
 * @returns
 */
export async function deleteProductType(name: string) {
  return simpleDeleteFromDatabase(fetchProductTypes, "types", name, "guid");
}
