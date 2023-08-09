import { Multiplier } from "./Interfaces.ts";
import { runGetRequest } from "./database-actions.ts";

/**
 * Fetch all multipliers in the database
 * @returns
 */
export async function fetchMultipliers(): Promise<
  Record<string, Multiplier[]>
> {
  return runGetRequest("multipliers");
}

/**
 * Edit an existing multiplier in the database
 * @returns
 */
export async function editMultiplier(
  category: string,
  guid: string,
  value: number
) {
  console.error("IMPLEMENT THIS METHOD BEFORE ATTEMPTING TO USE IT!");

  // Find the category within multipliers

  // Find the guid within the category

  // Change the value
  return undefined;
}
