// Supported objects in the system
export interface ProductObject {
  guid: string;
  model: string;
  modelNum: string;
  description: string;
  cost: number;
  image?: any;
}
// Products added to a given proposal are mapped different than the products themselves
export interface ProductOnProposal extends ProductObject {
  quote_option: number; // 0 = All, 1-5 = specific quote
  qty: number;
}

// -> Products are stored keyed under a category
export type PsuedoObjectOfProducts = Record<string, ProductObject[]>;
export interface FlattenedProductObject extends ProductObject {
  category: string;
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

export interface ContactObject {
  guid: string;
  name: string;
  email: string;
  phone: string;
}

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
  description: string;
  dateCreated: string;
  dateModified: string;
  owner: {
    guid: string;
  };
  data: ProposalData;
}
// Information stored within data object for a proposal
export interface ProposalData {
  fees: FeesOnProposal;
  labor: LaborOnProposal;
  products: ProductOnProposal[];
  multiplier: number;
  unitCostTax: number;
  commission: number;
  quote_options: QuoteOption[]; // this array is 0 indexed, so index 0 = quote 1, etc
  start_date?: string;
}
export interface QuoteOption {
  title: string | undefined;
  summary: string | undefined;
  specifications: ProposalSpec[];
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
  guid: string;
}
export interface Financing {
  guid: string;
  name: string;
  interest: number;
  term_length: number;
  term_type: string | "months" | "years";
  provider: string | "Synchrony Financial" | "National Energy Improvement Fund";
  costPerMonth?: number;
}

// Objects of a given type
export type FeesOnProposal = Record<string, Fee>;
export type LaborOnProposal = Record<string, Labor>;

export interface PdfInvoice {
  start_date: string | undefined;
  submitted_to: string | undefined;
  address: string | undefined;
  phone: string | undefined;
  email: string | undefined;
  current_date: string | undefined;
  accountNum: string | undefined;
  quoteOptions: QuoteOption[];
  invoiceTotals: Record<number, Record<string, number>>;
  financingOptions: Record<string, Financing[]>;
}

export interface AddressInfo {
  type: string;
  state: string;
  county: string;
  zip: number;
  primary_city: string;
}
