export interface UserPreferences {
  expandedSideBar: boolean;
  darkMode: boolean;
}

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
export interface ProductOnProposal {
  category: string;
  guid: string;
  quote_option: number; // 0 = All, 1-5 = specific quote
  qty: number;
}

// Used when calculating pricing information for a given product on a proposal
export interface ProductOnProposalWithPricing extends ProductOnProposal {
  cost: number;
  model: string;
  modelNum: string;
}

// -> Products are stored keyed under a category
export type PsuedoObjectOfProducts = Record<string, ProductObject[]>;
export interface FlattenedProductObject extends ProductObject {
  category: string;
}
export interface ProductTypeObject {
  label: string;
  guid: string;
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
  type: "add" | "subtract";
}
export interface FeeOnProposal {
  guid: string;
  cost: number;
}

export interface Labor {
  guid: string;
  name: string;
  cost: number;
  allowCostOverride: boolean;
}
export interface LaborOnProposal {
  guid: string;
  cost: number;
  qty: number;
}

export interface TemplateObject {
  guid: string;
  name: string;
  description: string;
  date_created: string;
  date_modified: string;
  data: ProposalData;
}

export interface ProposalObject extends TemplateObject {
  owner: {
    guid: string;
  };
}

export interface SoldJob {
  guid: string; // this will match the guid of the proposal itself
  data: {
    date_sold: string;
    date_completed?: string;
    commission_received: boolean;
    job_price: number;
    commission: number;
  };
}

// Information stored within data object for a proposal
export interface ProposalData {
  fees: FeeOnProposal[];
  labor: LaborOnProposal[];
  products: ProductOnProposal[];
  unit_cost_tax: number;
  quote_options: QuoteOption[]; // this array is 0 indexed, so index 0 = quote 1, etc
  start_date?: string;
  target_quote?: number;
  target_commission?: number;
}
export interface QuoteOption {
  guid: string;
  title: string | undefined;
  summary: string | undefined;
  specifications: ProposalSpec[];
  hasProducts: boolean;
}

// Specifications that are available to be imported
export interface AvailableSpecification extends ProposalSpec {
  checked: boolean;
}

// Specifications the user intends to import
export interface AddedSpecification {
  guid: string;
  originalText: string;
  modifiedText: string;
}

export interface ProposalSpec {
  guid: string;
  text: string;
}

export interface Multiplier {
  value: number;
  name: string;
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

// Company markups / used for pricing workup
export interface Markup {
  commissionAmount: number;
  commissionPercent: number;
  sellPrice: number;
  companyMargin: number;
}

export interface PdfInvoice {
  start_date: string | undefined;
  submitted_to: string | undefined;
  address: string | undefined;
  phone: string | undefined;
  email: string | undefined;
  current_date: string | undefined;
  accountNum: string | undefined;
  title: string | undefined;
  summary: string | undefined;
  specifications: ProposalSpec[];
  invoiceTotal: number;
  financingOptions: Record<string, Financing[]>;
}

export interface AddressInfo {
  type: string;
  state: string;
  county: string;
  zip: number;
  primary_city: string;
}
