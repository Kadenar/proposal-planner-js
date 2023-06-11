// Supported objects in the system
export interface ProductObject {
  guid: string;
  model: string;
  cost: number;
  modelNum: string;
  image?: any;
  quote_option?: number;
}

// -> Products are stored keyed under a category
export type PsuedoObjectOfProducts = Record<string, ProductObject[]>;
export interface FlattenedProductObject {
  category: string;
  label: string;
  modelNum: string;
  cost: number;
  guid: string;
  image?: any;
}
export interface ProductTypeObject {
  label: string;
  guid: string;
  specifications?: string[];
}

export interface NewClientObject {
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
export interface ClientObject extends NewClientObject {
  guid: string;
}

export type Nullable<ClientObject> = ClientObject | null;

export interface Fee {
  guid: string;
  name: string;
  cost: number;
  qty: number;
  type: "add" | "subtract";
}
export interface Labor {
  guid: string;
  name: string;
  cost: number;
  qty: number;
}

export interface ProposalObject {
  guid: string;
  name: string;
  description: string | undefined;
  dateCreated: string;
  dateModified: string;
  owner: {
    guid: string;
  };
  data: ProposalData;
}
// Information stored within data object for a proposal
export interface ProposalData {
  fees: PsuedoObjectOfFees;
  labor: PsuedoObjectOfLabor;
  products: ProductOnProposal[];
  multiplier: number;
  unitCostTax: number;
  commission: number;
  title: string | undefined;
  summary: string | undefined;
  specifications: ProposalSpec[] | undefined;
}
export interface ProposalSpec {
  originalText: string;
  modifiedText: string;
}

export interface Commission {
  guid: string;
  value: number;
}
export interface Multiplier {
  value: number;
}

// Objects of a given type
export type PsuedoObjectOfFees = Record<string, Fee>;
export type PsuedoObjectOfLabor = Record<string, Labor>;

// Products added to a given proposal are mapped different than the products themselves
export type PsuedoObjectOfModel = Record<string, ProductOnProposal>;
export type ProductOnProposal = {
  guid: string;
  name: string;
  modelNum: string;
  cost: number;
  qty: number;
  quote_option: number;
};

export interface PdfInvoice {
  submitted_to: string | undefined;
  address: string | undefined;
  phone: string | undefined;
  email: string | undefined;
  current_date: string | undefined;
  accountNum: string | undefined;
  proposal_title: string | undefined;
  proposal_summary: string | undefined;
  proposal_specifications: string | undefined;
  invoiceTotals: number;
}

export interface ReduxStore {
  clients: {
    clients: ClientObject[];
    selectedClient: ClientObject | null;
  };
  commissions: {
    commissions: Commission[];
  };
  fees: {
    fees: Fee[];
  };
  filters: {
    filters: ProductTypeObject[];
  };
  labors: {
    labors: Labor[];
  };
  multipliers: {
    multipliers: Multiplier[];
  };
  products: {
    products: PsuedoObjectOfProducts;
  };
  proposals: {
    proposals: ProposalObject[];
  };
  selectedProposal: {
    selectedProposal: ProposalObject | null;
  };
}
