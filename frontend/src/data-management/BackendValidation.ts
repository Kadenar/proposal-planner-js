export function validateProductInfo(
  filter: {
    label: string;
    guid: string;
  },
  modelName: String,
  catalogNum: String,
  unitCost: number
) {
  if (!filter || filter.label === "" || filter.guid === "") {
    return {
      status: 500,
      data: { message: "Please specify a valid filter." },
    };
  }

  if (modelName === "") {
    return {
      status: 500,
      data: { message: "Please specify a valid model name." },
    };
  }

  if (catalogNum === "") {
    return {
      status: 500,
      data: { message: "Please specify a catalog num." },
    };
  }

  if (!unitCost || unitCost <= 0) {
    return {
      status: 500,
      data: { message: "Please specify a non-zero cost." },
    };
  }

  return null;
}

export function validateClientInfo(
  name: string,
  address: string,
  state: string,
  city: string,
  zip: string
) {
  if (name === "") {
    return {
      status: 500,
      data: { message: "Please specify a client name." },
    };
  }

  if (address === "") {
    return {
      status: 500,
      data: { message: "Please specify the client's address." },
    };
  }

  if (state === "") {
    return {
      status: 500,
      data: { message: "Please specify the client's state." },
    };
  }

  if (city === "") {
    return {
      status: 500,
      data: { message: "Please specify the client's city." },
    };
  }

  if (zip === "") {
    return {
      status: 500,
      data: { message: "Please specify the client's zip code." },
    };
  }

  return null;
}
