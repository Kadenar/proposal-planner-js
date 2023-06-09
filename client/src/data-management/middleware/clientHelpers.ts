import { ClientObject } from "./Interfaces.ts";
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
export async function fetchClients(): Promise<ClientObject[]> {
  const response = await runGetRequest("clients");
  return response;
}

export async function addClient(clientInfo: ClientObject) {
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
export async function saveClient(clientInfo: ClientObject) {
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

function validateClientInfo(
  name: string,
  address: string,
  state: string,
  city: string,
  zip: string
) {
  if (!name || name === "") {
    return {
      status: 500,
      data: { message: "Please specify a client name." },
    };
  }

  if (!address || address === "") {
    return {
      status: 500,
      data: { message: "Please specify the client's address." },
    };
  }

  if (!state || state === "") {
    return {
      status: 500,
      data: { message: "Please specify the client's state." },
    };
  }

  if (!city || city === "") {
    return {
      status: 500,
      data: { message: "Please specify the client's city." },
    };
  }

  if (!zip || zip === "") {
    return {
      status: 500,
      data: { message: "Please specify the client's zip code." },
    };
  }

  return null;
}
