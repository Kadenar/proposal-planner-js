import { Multiplier } from "./Interfaces.ts";
import { runGetRequest } from "./database-actions.ts";

import {
  simpleDeleteFromDatabase,
  simpleAddToDatabase,
} from "./database-actions.ts";

/**
 * Fetch all multipliers in the database
 * @returns
 */
export async function fetchMultipliers(): Promise<Multiplier[]> {
  return runGetRequest("multipliers");
}

/**
 * Add a new multiplier to the database
 * @returns
 */
export async function addMultiplier(value: number) {
  return simpleAddToDatabase(fetchMultipliers, "multipliers", value);
}

/**
 * Edit an existing multiplier to the database
 * @returns
 */
export async function editMultiplier(guid: string, value: number) {
  console.error("IMPLEMENT THIS METHOD BEFORE ATTEMPTING TO USE IT!");
  return undefined;
}

/**
 * Delete a given multiplier from the database
 * @returns
 */
export const deleteMultiplier = async (guid: string) => {
  return simpleDeleteFromDatabase(
    fetchMultipliers,
    "multipliers",
    guid,
    "guid"
  );
};
