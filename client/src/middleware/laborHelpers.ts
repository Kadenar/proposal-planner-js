import { Labor } from "./Interfaces.ts";
import {
  runGetRequest,
  runPostRequest,
  simpleAddObjectToDatabase,
  simpleDeleteFromDatabase,
} from "./database-actions.ts";

/**
 * Fetch all labors in the database
 * @returns
 */
export async function fetchLabors(): Promise<Labor[]> {
  return runGetRequest("labors");
}

/**
 * Add a new labor to the database
 * @returns
 */
export async function addLabor(
  name: string,
  cost: number,
  allowCostOverride: boolean
) {
  const error = validateLabor(name, cost);

  if (error) {
    return error;
  }

  return simpleAddObjectToDatabase(fetchLabors, "labors", {
    guid: crypto.randomUUID(),
    name,
    cost,
    allowCostOverride,
  });
}

/**
 * Edit an existing fee to the database
 * @returns
 */
export async function editLabor(
  guid: string,
  name: string,
  cost: number,
  allowCostOverride: boolean
) {
  const errors = validateLabor(name, cost);

  if (errors) {
    return errors;
  }

  const existingLabors = await fetchLabors();

  const index = existingLabors.findIndex((labor) => {
    return labor.guid === guid;
  });

  if (index === -1) {
    return {
      status: 500,
      data: { message: "Labor could not be found in database." },
    };
  }

  const newLabors = [...existingLabors];
  newLabors[index] = {
    ...newLabors[index],
    name,
    cost,
    allowCostOverride,
  };

  return runPostRequest(newLabors, "labors");
}

/**
 * Delete a given labor from the database
 * @returns
 */
export const deleteLabor = async (guid: string) => {
  return simpleDeleteFromDatabase(fetchLabors, "labors", guid, "guid");
};

function validateLabor(name: string, cost: number) {
  if (!name || name === "") {
    return {
      status: 500,
      data: { message: "Please specify a client name." },
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
