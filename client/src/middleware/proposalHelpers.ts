import { ProposalObject, TemplateObject } from "./Interfaces.ts";
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
  existingProposal?: ProposalObject | TemplateObject | null
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
        unit_cost_tax: existingProposal.data.unit_cost_tax,
        quote_options: existingProposal.data.quote_options,
      },
    };
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
export async function saveProposal(proposalToSave: ProposalObject) {
  const existingProposals = await fetchProposals();
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  const index = existingProposals.findIndex((proposal) => {
    return proposal.guid === proposalToSave.guid;
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
    date_modified: `${month}/${day}/${year}`,
    data: {
      ...newProposals[index].data,
      unit_cost_tax: proposalToSave.data.unit_cost_tax,
      labor: proposalToSave.data.labor,
      fees: proposalToSave.data.fees,
      products: proposalToSave.data.products,
      quote_options: proposalToSave.data.quote_options,
      start_date: proposalToSave.data.start_date || "",
      target_quote: proposalToSave.data.target_quote,
      target_commission: proposalToSave.data.target_commission,
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
    date_created: dateNow,
    date_modified: dateNow,
    owner: {
      guid: client_guid,
    },
    data: {
      products: [],
      unit_cost_tax: 8.375,
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
      quote_options: [
        {
          guid: "quote_1",
          name: "Quote 1",
          title: "",
          summary: "",
          specifications: [],
          hasProducts: false,
        },
        {
          guid: "quote_2",
          name: "Quote 2",
          title: "",
          summary: "",
          specifications: [],
          hasProducts: false,
        },
        {
          guid: "quote_3",
          name: "Quote 3",
          title: "",
          summary: "",
          specifications: [],
          hasProducts: false,
        },
        {
          guid: "quote_4",
          name: "Quote 4",
          title: "",
          summary: "",
          specifications: [],
          hasProducts: false,
        },
        {
          guid: "quote_5",
          name: "Quote 5",
          title: "",
          summary: "",
          specifications: [],
          hasProducts: false,
        },
      ],
      start_date: "",
    },
  };
};
