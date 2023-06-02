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
export interface ProductKeyObject<ProductObject> {
  [key: string]: ProductObject;
}
export interface Products extends Array<ProductKeyObject<ProductObject>> {}

// PRODUCT TYPES \\
export interface ProductTypeObject {
  label: string;
  standard_value: string;
}
export interface ProductTypes extends Array<ProductTypeObject> {}

// CLIENTS \\
export interface ClientObject {
  guid: string;
  name: string;
  address: string;
  apt: string;
  state: string;
  city: string;
  zip: string;
  phone: string;
  email: string;
  accountNum: string;
}
export interface Clients extends Array<ClientObject> {}

// PROPOSALS\\
export interface CostObject {
  qty: number;
  cost: number;
}
export interface FeeObject {
  financing: CostObject;
  permit: CostObject;
  rebates: CostObject;
  removal: CostObject;
  tempTank: CostObject;
}
export interface Fees extends Array<FeeObject> {}

export interface LaborObject {
  twoMenEightHours: CostObject;
  twoMenSixteenHours: CostObject;
  twoMenTwentyHours: CostObject;
  threeMenTwentyFourHours: CostObject;
  threeMenThirtyHours: CostObject;
  subcontractors: CostObject;
}
export interface Labors extends Array<LaborObject> {}

export interface ModelObject {
  name: string;
  catalogNum: string;
  qty: number;
  unitCost: number;
}
export interface Models extends Array<ModelObject> {}

export interface ProposalData {
  fees: FeeObject;
  labor: LaborObject;
  models: Models;
  multiplier: number;
  unitCostTax: number;
  commission: number;
}
export interface ProposalObject {
  guid: string;
  name: string;
  description: string;
  client: string;
  dateCreated: string;
  dateModified: string;
  data: ProposalData;
}
export interface Proposals extends Array<ProposalObject> {}
