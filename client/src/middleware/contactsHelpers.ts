import { ContactObject } from "./Interfaces.ts";
import {
  runGetRequest,
  runPostRequest,
  simpleDeleteFromDatabase,
  simpleAddObjectToDatabase,
} from "./database-actions.ts";

/**
 * Fetch all contacts in the database
 * @returns
 */
export async function fetchContacts(): Promise<ContactObject[]> {
  const response = await runGetRequest("contacts");
  return response;
}

export async function addContact(name: string, email: string, phone: string) {
  const error = validateContactInfo(name);

  if (error) {
    return error;
  }

  return simpleAddObjectToDatabase(fetchContacts, "contacts", {
    guid: crypto.randomUUID(),
    name,
    email,
    phone,
  });
}

/**
 * Saves a given contact details
 * @returns
 */
export async function editContact(contactInfo: ContactObject) {
  const errors = validateContactInfo(contactInfo.name);

  if (errors) {
    return errors;
  }

  const existingContacts = await fetchContacts();

  const index = existingContacts.findIndex((contact) => {
    return contact.guid === contactInfo.guid;
  });

  if (index === -1) {
    return {
      status: 500,
      data: { message: "Contact could not be found in database." },
    };
  }

  const newContacts = [...existingContacts];
  newContacts[index] = {
    ...newContacts[index],
    name: contactInfo.name,
    phone: contactInfo.phone,
    email: contactInfo.email,
  };

  return runPostRequest(newContacts, "contacts");
}

/**
 * Deletes a given contact
 * @returns
 */
export async function deleteContact(guid: string) {
  const response = await simpleDeleteFromDatabase(
    fetchContacts,
    "contacts",
    guid,
    "guid"
  );

  return response;
}

function validateContactInfo(name: string) {
  if (!name || name === "") {
    return {
      status: 500,
      data: { message: "Please specify a contact name." },
    };
  }

  return undefined;
}
