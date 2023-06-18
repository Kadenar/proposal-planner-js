import {
  runGetRequest,
  runPostRequest,
  simpleAddObjectToDatabase,
  simpleDeleteFromDatabase,
} from "./database-actions.ts";
import { Financing } from "./Interfaces.ts";

/**
 * Fetch all financing in the database
 * @returns
 */
export async function fetchFinancingOptions(): Promise<Financing[]> {
  return runGetRequest("financing");
}

/**
 * Add a new financing option to the database
 * @returns
 */
export async function addFinancingOption(
  name: string,
  interest: number,
  term_length: number,
  term_type: string | "months" | "years",
  provider: string
) {
  const error = validateFinancingOption(
    name,
    interest,
    term_length,
    term_type,
    provider
  );

  if (error) {
    return error;
  }
  const financingObject: Financing = {
    guid: crypto.randomUUID(),
    name,
    interest,
    term_length,
    term_type,
    provider,
  };

  return simpleAddObjectToDatabase(
    fetchFinancingOptions,
    "financing",
    financingObject
  );
}

/**
 * Edit an existing financing option in the database
 * @returns
 */
export async function editFinancingOption(
  guid: string,
  name: string,
  interest: number,
  term_length: number,
  term_type: string | "months" | "years",
  provider: string
) {
  const errors = validateFinancingOption(
    name,
    interest,
    term_length,
    term_type,
    provider
  );

  if (errors) {
    return errors;
  }

  const existingFinancingOptions = await fetchFinancingOptions();

  const index = existingFinancingOptions.findIndex((option) => {
    return option.guid === guid;
  });

  if (index === -1) {
    return {
      status: 500,
      data: { message: "Financing option could not be found in database." },
    };
  }

  const newFinancing = [...existingFinancingOptions];
  newFinancing[index] = {
    ...newFinancing[index],
    name,
    interest,
    term_length,
    term_type,
    provider,
  };

  return runPostRequest(newFinancing, "financing");
}

/**
 * Delete a given financing option from the database
 * @returns
 */
export const deleteFinancingOption = async (guid: string) => {
  return simpleDeleteFromDatabase(
    fetchFinancingOptions,
    "financing",
    guid,
    "guid"
  );
};

function validateFinancingOption(
  name: string,
  interest: number,
  term_length: number,
  term_type: string | "months" | "years",
  provider: string
) {
  if (!name || name === "") {
    return {
      status: 500,
      data: { message: "Please specify a client name." },
    };
  }

  if (interest < 0) {
    return {
      status: 500,
      data: { message: "Please specify a non-negative interest rate." },
    };
  }

  if (term_length < 0) {
    return {
      status: 500,
      data: { message: "Please specify a valid term length." },
    };
  }

  if (!term_type || term_type === "") {
    return {
      status: 500,
      data: { message: "Please specify a term type." },
    };
  }

  if (!provider || provider === "") {
    return {
      status: 500,
      data: { message: "Please specify a provider." },
    };
  }

  return undefined;
}
