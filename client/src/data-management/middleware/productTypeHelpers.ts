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
  return runGetRequest("types");
}

/**
 * Add a new product type to the database
 * @returns
 */
export async function addProductType(label: string, specifications?: string[]) {
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
      specifications: specifications?.filter((spec) => spec.trim() !== ""),
    }),
    "types"
  );
}

/**
 * Edit a property type
 * @returns
 */
export const editProductType = async (
  guid: string,
  newLabel: string,
  specifications?: string[]
) => {
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
    specifications: specifications?.filter((spec) => spec.trim() !== ""),
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
