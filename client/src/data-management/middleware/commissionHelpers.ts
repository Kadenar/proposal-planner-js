import { Commission } from "./Interfaces.ts";
import {
  runGetRequest,
  simpleDeleteFromDatabase,
  simpleAddToDatabase,
} from "./database-actions.ts";

/**
 * Fetch all commissions in the database
 * @returns
 */
export async function fetchCommissions(): Promise<Commission[]> {
  return runGetRequest("commissions");
}

/**
 * Add a new commission to the database
 * @returns
 */
export async function addCommission(value: string) {
  return simpleAddToDatabase(fetchCommissions, "commissions", value);
}

export async function editCommission(guid: string, value: string) {
  console.error("IMPLEMENT THIS METHOD BEFORE ATTEMPTING TO USE IT!");
  return null;
}

/**
 * Delete a given commission from the database
 * @returns
 */
export async function deleteCommission(value: string) {
  return simpleDeleteFromDatabase(fetchCommissions, "commissions", value);
}
