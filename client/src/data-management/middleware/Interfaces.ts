// PRODUCTS \\
export interface ProductObject {
  model: string;
  cost: number;
  guid: string;
  catalog: string;
  image: any;
}
export interface FlattenedProductObject {
  category: string;
  label: string;
  catalog: string;
  cost: number;
  guid: string;
  image: any;
}

export interface Products extends Array<ProductObject> {}
export interface ObjectOfProducts {
  [key: string]: Products;
}

// PRODUCT TYPES \\
export interface ProductTypeObject {
  label: string;
  guid: string;
  documentationHelp?: Array<string>;
}
export interface ProductTypes extends Array<ProductTypeObject> {}

// CLIENTS \\
export interface ClientObject {
  guid: string;
  name: string;
  address: string;
  state: string;
  city: string;
  zip: string;
  apt?: string;
  phone?: string;
  email?: string;
  accountNum?: string;
}
export interface Clients extends Array<ClientObject> {}

// PROPOSALS\\

// Costs

// Object of fee arrays
export interface ArrayOfFeeObjects extends Array<ObjectOfFee> {}
export interface ArrayOfFees extends Array<Fee> {}

// A Specific fee array
export interface ObjectOfFee {
  [key: string]: Fee;
}

// object that represents a single fee
export interface Fee {
  cost: number;
  guid: string;
  name: string;
  qty: number;
  type: "add" | "subtract";
}

// Object of labor arrays
export interface ArrayOfLaborObjects extends Array<ObjectOfLabor> {}

// Array of Labors
export interface ArrayOfLabors extends Array<Labor> {}

// A specific labor object
export interface ObjectOfLabor {
  [key: string]: Labor;
}

// Object that represents a single labor
export interface Labor {
  cost: number;
  guid: string;
  name: string;
  qty: number;
}

// Products added to a given proposal
export interface ModelObject {
  product: {
    name: string;
    catalogNum: string;
    qty: number;
    unitCost: number;
  };
  quote_option: number;
}
export interface Models extends Array<ModelObject> {}

export interface ProposalData {
  fees: ArrayOfFeeObjects;
  labor: ArrayOfLaborObjects;
  products: Models;
  multiplier: number;
  unitCostTax: number;
  commission: number;
  title: string;
  summary: string;
  specifications: string;
}
export interface ProposalObject {
  guid: string;
  name: string;
  description: string;
  owner: {
    guid: string;
  };
  dateCreated: string;
  dateModified: string;
  data: ProposalData;
}
export interface Proposals extends Array<ProposalObject> {}
