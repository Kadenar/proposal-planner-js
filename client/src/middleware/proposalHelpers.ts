import {
  FeeOnProposal,
  LaborOnProposal,
  ProposalObject,
  ProductOnProposal,
  QuoteOption,
} from "./Interfaces.ts";
import {
  runGetRequest,
  runPostRequest,
  simpleDeleteFromDatabase,
} from "./database-actions.ts";
import { fetchFees } from "./feeHelpers.ts";
import { fetchLabors } from "./laborHelpers.ts";

/**
 * Fetch all proposals in the database
 * @returns
 */
export async function fetchProposals(): Promise<ProposalObject[]> {
  return await runGetRequest("proposals");
}

/**
 * Add new proposal to the database
 * @returns
 */
export async function addProposal(
  name: string,
  description: string,
  client_guid: string | undefined,
  existingProposal?: ProposalObject | null
) {
  if (name === "") {
    return {
      status: 500,
      data: {
        message: "Proposal name cannot be blank.",
      },
    };
  }

  if (!client_guid || client_guid === "") {
    return {
      status: 500,
      data: {
        message: "Client name cannot be blank.",
      },
    };
  }

  const existingProposals = await fetchProposals();

  let newProposal = await getNewProposalItem(name, description, client_guid);

  if (existingProposal) {
    newProposal = {
      ...newProposal,
      name,
      description,
      owner: {
        guid: client_guid,
      },
      data: {
        products: existingProposal.data.products,
        fees: existingProposal.data.fees,
        labor: existingProposal.data.labor,
        unitCostTax: existingProposal.data.unitCostTax,
        quote_options: existingProposal.data.quote_options,
      },
    };
    return runPostRequest(existingProposals.concat(newProposal), "proposals");
  }

  return runPostRequest(existingProposals.concat(newProposal), "proposals");
}

/**
 * Delete a given proposal from the database
 * @returns
 */
export async function deleteProposal(guid: string) {
  return await simpleDeleteFromDatabase(
    fetchProposals,
    "proposals",
    guid,
    "guid"
  );
}

/**
 * Saves a given proposal
 * @returns
 */
export async function saveProposal(
  guid: string,
  fees: FeeOnProposal[],
  labor: LaborOnProposal[],
  products: ProductOnProposal[],
  unitCostTax: number,
  quoteOptions: QuoteOption[],
  start_date: string,
  target_quote: number | undefined,
  target_commission: number | undefined
) {
  const existingProposals = await fetchProposals();
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  const index = existingProposals.findIndex((proposal) => {
    return proposal.guid === guid;
  });

  if (index === -1) {
    return {
      status: 500,
      data: { message: "Proposal could not be found in database." },
    };
  }

  const newProposals = [...existingProposals];

  newProposals[index] = {
    ...newProposals[index],
    dateModified: `${month}/${day}/${year}`,
    data: {
      ...newProposals[index].data,
      unitCostTax,
      labor,
      fees,
      products,
      quote_options: quoteOptions,
      start_date,
      target_quote,
      target_commission,
    },
  };

  return await runPostRequest(newProposals, "proposals");
}

/**
 * Fetch all proposals in the database
 * @returns
 */
export async function deleteProposalsForClient(client_guid: string) {
  const proposals = await fetchProposals();

  const filtered_proposals = proposals.filter((proposal) => {
    return proposal.owner.guid !== client_guid;
  });

  // Run a post request with our original proposals
  return await runPostRequest(filtered_proposals, "proposals");
}

/**
 * Helper to return the default json for a new proposal
 * @returns
 */
const getNewProposalItem = async (
  name: string,
  description: string,
  client_guid: string
): Promise<ProposalObject> => {
  const date = new Date();
  const dateNow = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  const fees = await fetchFees();
  const labors = await fetchLabors();

  return {
    guid: crypto.randomUUID(),
    name,
    description,
    dateCreated: dateNow,
    dateModified: dateNow,
    owner: {
      guid: client_guid,
    },
    data: {
      products: [],
      unitCostTax: 8.375,
      labor: labors.map((labor) => {
        return {
          guid: labor.guid,
          cost: labor.cost,
          qty: 0,
        };
      }),
      fees: fees.map((fee) => {
        return {
          guid: fee.guid,
          cost: fee.cost,
        };
      }),
      quote_options: [],
      start_date: "",
    },
  };
};
