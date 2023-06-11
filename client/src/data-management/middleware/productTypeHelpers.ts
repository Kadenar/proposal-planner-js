import { ProductTypeObject, ProductTypeSpecifications } from "./Interfaces.ts";
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
export async function addProductType(
  label: string,
  specifications?: ProductTypeSpecifications
) {
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

  // TODO - Probably want to filter out any specifications that were left blank

  return runPostRequest(
    existingTypes.concat({
      label,
      guid,
      specifications,
    }),
    "types"
  );
}

/**
 * Edit a property type
 * @returns
 */
export const editProductType = async (
  newLabel: string,
  guid: string,
  specifications?: ProductTypeSpecifications
) => {
  const existingTypes = await fetchProductTypes();

  // A product type with the same guid already exists
  // const new_guid = newLabel.toLowerCase().replaceAll(" ", "_");
  // const conflict = existingTypes.find((existing) => {
  //   return existing.guid === new_guid;
  // });

  // if (conflict) {
  //   return {
  //     status: 500,
  //     data: {
  //       message: "Product type already exists. Specify a different name.",
  //     },
  //   };
  // }

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
    specifications,
  };

  // TODO Probably want to filter out specifications

  return runPostRequest(newProductTypes, "types");
};

/**
 * Delete a given product type from the database
 * @returns
 */
export async function deleteProductType(name: string) {
  return simpleDeleteFromDatabase(fetchProductTypes, "types", name, "guid");
}
