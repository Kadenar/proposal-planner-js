import { UserPreferences } from "./Interfaces.ts";
import { runGetRequest, runPostRequest } from "./database-actions.ts";

/**
 * Fetch all preferences in the database
 * @returns
 */
export async function fetchPreferences(): Promise<UserPreferences> {
  return await runGetRequest("preferences");
}

/**
 * Saves new preferences
 * @returns
 */
export async function savePreferences(
  preferenceToUpdate: "darkMode" | "expandedSideBar",
  newValue: boolean | string | undefined
) {
  const existingPreferences = await fetchPreferences();
  if (existingPreferences[preferenceToUpdate] === undefined) {
    return {
      status: 500,
      data: {
        message: "Preference is not configured.",
      },
    };
  }

  const newPreferences = {
    ...existingPreferences,
    [preferenceToUpdate]: newValue,
  };

  return await runPostRequest(newPreferences, "preferences");
}
