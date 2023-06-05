import * as Interface from "./Interfaces.ts";
import { validateClientInfo } from "./BackendValidation.ts";
import {
  runGetRequest,
  runPostRequest,
  simpleDeleteFromDatabase,
  simpleAddObjectToDatabase,
} from "./database-actions.ts";

/**
 * Fetch all clients in the database
 * @returns
 */
export async function fetchClients(): Promise<Interface.Clients> {
  return runGetRequest("clients");
}

export async function addClient(clientInfo: Interface.ClientObject) {
  const error = validateClientInfo(
    clientInfo.name,
    clientInfo.address,
    clientInfo.state,
    clientInfo.city,
    clientInfo.zip
  );

  if (error) {
    return error;
  }

  return simpleAddObjectToDatabase(fetchClients, "clients", {
    guid: crypto.randomUUID(),
    name: clientInfo.name,
    address: clientInfo.address,
    apt: clientInfo.apt,
    state: clientInfo.state,
    city: clientInfo.city,
    zip: clientInfo.zip,
  });
}

/**
 * Saves a given client details
 * @returns
 */
export async function saveClient(clientInfo: Interface.ClientObject) {
  const errors = validateClientInfo(
    clientInfo.name,
    clientInfo.address,
    clientInfo.state,
    clientInfo.city,
    clientInfo.zip
  );

  if (errors) {
    return errors;
  }

  const existingClients = await fetchClients();

  const index = existingClients.findIndex((client) => {
    return client.guid === clientInfo.guid;
  });

  if (index === -1) {
    return {
      status: 500,
      data: { message: "Client could not be found in database." },
    };
  }

  const newClients = [...existingClients];
  newClients[index] = {
    ...newClients[index],
    name: clientInfo.name,
    address: clientInfo.address,
    apt: clientInfo.apt,
    city: clientInfo.city,
    state: clientInfo.state,
    zip: clientInfo.zip,
    phone: clientInfo.phone,
    email: clientInfo.email,
    accountNum: clientInfo.accountNum,
  };

  return runPostRequest(newClients, "clients");
}

/**
 * Deletes a given client
 * @returns
 */
export async function deleteClient(guid: string) {
  const response = await simpleDeleteFromDatabase(
    fetchClients,
    "clients",
    guid,
    "guid"
  );

  return response;
}
