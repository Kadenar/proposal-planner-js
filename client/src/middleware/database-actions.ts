import axios, { AxiosResponse } from "axios";

export async function runGetRequest(path: string) {
  if (path === "") {
    return {
      status: 500,
      data: { message: "No path specified in get request." },
    };
  }

  const axiosGetResponse = await axios.get(`http://localhost:4000/${path}`);
  return axiosGetResponse.data || [];
}

/**
 * Runs a POST request to the back-end server at the given path and passes the given items
 * @param items the items to post to the database
 * @param path the path to run the post request against
 * @returns response with success or failure along with an informational message
 */
export async function runPostRequest(items: object, path: string) {
  const axiosPostResponse = await axios
    .post(`http://localhost:4000/${path}`, items)
    .then((res) => {
      return res;
    });

  return axiosPostResponse;
}

export async function simpleAddToDatabase(
  fetchItemsFunc = async (): Promise<any> => {},
  path: string,
  valueToAdd: string | number,
  conflictChecker = { key: "value", checkForConflicts: true }
) {
  const existingItems = await fetchItemsFunc();

  if (conflictChecker.checkForConflicts) {
    const conflict = existingItems.find((existing: any) => {
      return existing[conflictChecker.key] === valueToAdd;
    });

    if (conflict) {
      return {
        status: 500,
        data: {
          message: "Item already exists. Specify a different value.",
        },
      };
    }
  }

  const newItem = {
    value: valueToAdd,
    guid: crypto.randomUUID(),
  };
  return runPostRequest(existingItems.concat(newItem), path);
}

/**
 *
 * @param fetchItemsFunc
 * @param path
 * @param objectToAdd
 * @returns
 */
export async function simpleAddObjectToDatabase(
  fetchItemsFunc = async (): Promise<any> => {},
  path: string,
  objectToAdd: object
) {
  const existingItems = await fetchItemsFunc();
  return runPostRequest(existingItems.concat(objectToAdd), path);
}

// Deletes a top level item from the database
export async function simpleDeleteFromDatabase(
  fetchItemsFunc = async (): Promise<any> => {},
  path = "",
  valueToDelete: string | number,
  key = "value"
) {
  if (path === "") {
    return {
      status: 500,
      data: { message: "Internal server error - incorrect path for delete." },
    };
  }

  const existingItems = await fetchItemsFunc();

  const index = existingItems.findIndex((existing: any) => {
    return existing[key] === valueToDelete;
  });

  if (index === -1) {
    return {
      status: 500,
      data: { message: "Could not find entry to delete." },
    };
  }

  const newItems = [...existingItems];
  newItems.splice(index, 1);

  return runPostRequest(newItems, path);
}

// Deletes an item from an array in the database
export async function simpleDeleteItemInArrayFromDatabase(
  fetchItemsFunc = async (): Promise<any> => {},
  path: string,
  arrayKey: string,
  valueToDelete: string,
  valueKey = "guid"
): Promise<
  | AxiosResponse<any, any>
  | {
      status: number;
      data: {
        message: string;
      };
    }
> {
  if (path === "") {
    return {
      status: 500,
      data: { message: "Internal server error - incorrect path for delete." },
    };
  }

  const existingItems = await fetchItemsFunc();

  const index = existingItems[arrayKey].findIndex((existing: any) => {
    return existing[valueKey] === valueToDelete;
  });

  if (index === -1) {
    return {
      status: 500,
      data: { message: "Could not find entry to delete." },
    };
  }

  const items = [...existingItems[arrayKey]];
  items.splice(index, 1);

  const newItems = { ...existingItems };
  newItems[arrayKey] = items;

  return runPostRequest(newItems, path);
}
