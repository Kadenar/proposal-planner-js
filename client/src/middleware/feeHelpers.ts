import {
  runGetRequest,
  runPostRequest,
  simpleAddObjectToDatabase,
  simpleDeleteFromDatabase,
} from "./database-actions.ts";
import { Fee } from "./Interfaces.ts";

/**
 * Fetch all fees in the database
 * @returns
 */
export async function fetchFees(): Promise<Fee[]> {
  return runGetRequest("fees");
}

/**
 * Add a new fee to the database
 * @returns
 */
export async function addFee(
  name: string,
  qty: number,
  cost: number,
  type: string
) {
  const error = validateFee(name, qty, cost);

  if (error) {
    return error;
  }

  return simpleAddObjectToDatabase(fetchFees, "fees", {
    guid: crypto.randomUUID(),
    name,
    qty,
    cost,
    type,
  });
}

/**
 * Edit an existing fee to the database
 * @returns
 */
export async function editFee(
  guid: string,
  name: string,
  qty: number,
  cost: number,
  type: string
) {
  const errors = validateFee(name, qty, cost);

  if (errors) {
    return errors;
  }

  const existingFees = await fetchFees();

  const index = existingFees.findIndex((fee) => {
    return fee.guid === guid;
  });

  if (index === -1) {
    return {
      status: 500,
      data: { message: "Fee could not be found in database." },
    };
  }

  if (type !== "add" && type !== "subtract") {
    return {
      status: 500,
      data: { message: "Fee can only have type of add or subtract." },
    };
  }

  const newFees = [...existingFees];
  newFees[index] = {
    ...newFees[index],
    name,
    qty,
    cost,
    type,
  };

  return runPostRequest(newFees, "fees");
}

/**
 * Delete a given fee from the database
 * @returns
 */
export const deleteFee = async (guid: string) => {
  return simpleDeleteFromDatabase(fetchFees, "fees", guid, "guid");
};

function validateFee(name: string, qty: number, cost: number) {
  if (!name || name === "") {
    return {
      status: 500,
      data: { message: "Please specify a client name." },
    };
  }

  if (qty < 0) {
    return {
      status: 500,
      data: { message: "Please specify a non-negative quantity." },
    };
  }

  if (cost < 0) {
    return {
      status: 500,
      data: { message: "Please specify a non-negative cost." },
    };
  }

  return undefined;
}
