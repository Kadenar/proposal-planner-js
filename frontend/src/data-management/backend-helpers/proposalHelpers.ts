import {
  runGetRequest,
  runPostRequest,
  simpleDeleteFromDatabase,
} from "./database-actions.ts";
import * as Interface from "./Interfaces.ts";

/**
 * Fetch all proposals in the database
 * @returns
 */
export async function fetchProposals(): Promise<Interface.Proposals> {
  return runGetRequest("proposals");
}

/**
 * Add new proposal to the database
 * @returns
 */
export async function addProposal(
  name: string,
  description: string,
  client_guid: string,
  existingProposal?: Interface.ProposalObject | null
) {
  if (name === "") {
    return {
      status: 500,
      data: {
        message: "Proposal name cannot be blank.",
      },
    };
  }

  if (client_guid === "") {
    return {
      status: 500,
      data: {
        message: "Client name cannot be blank.",
      },
    };
  }

  const existingProposals = await fetchProposals();

  let newProposal = getNewProposalItem(name, description, client_guid);

  if (existingProposal) {
    newProposal = {
      ...newProposal,
      name,
      description,
      owner: {
        guid: client_guid,
      },
      data: {
        models: existingProposal.data.models,
        fees: existingProposal.data.fees,
        labor: existingProposal.data.labor,
        multiplier: existingProposal.data.multiplier,
        unitCostTax: existingProposal.data.unitCostTax,
        commission: existingProposal.data.commission,
        title: existingProposal.data.title,
        summary: existingProposal.data.summary,
        specifications: existingProposal.data.specifications,
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
  return simpleDeleteFromDatabase(fetchProposals, "proposals", guid, "guid");
}

/**
 * Saves a given proposal
 * @returns
 */
export async function saveProposal(
  guid: string,
  commission: number,
  fees: Interface.FeeObject,
  labor: Interface.LaborObject,
  models: Interface.Models,
  unitCostTax: number,
  multiplier: number,
  title: string,
  summary: string,
  specifications: string
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
      commission,
      unitCostTax,
      multiplier,
      labor,
      fees,
      models,
      title,
      summary,
      specifications,
    },
  };

  return runPostRequest(newProposals, "proposals");
}

/**
 * Fetch all proposals in the database
 * @returns
 */
export async function deleteProposalsForClient(
  client_guid: string
): Promise<any> {
  const proposals = await fetchProposals();

  const filtered_proposals = proposals.filter((proposal) => {
    return proposal.owner.guid !== client_guid;
  });

  // Run a post request with our original proposals
  return runPostRequest(filtered_proposals, "proposals");
}

/**
 * Helper to return the default json for a new proposal
 * @returns
 */
const getNewProposalItem = (
  name: string,
  description: string,
  client_guid: string
): Interface.ProposalObject => {
  const date = new Date();
  const dateNow = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

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
      models: [],
      unitCostTax: 8.375,
      labor: {
        twoMenEightHours: {
          qty: 1,
          cost: 680.0,
        },
        twoMenSixteenHours: {
          qty: 0,
          cost: 1360.0,
        },
        twoMenTwentyHours: {
          qty: 0,
          cost: 1700,
        },
        threeMenTwentyFourHours: {
          qty: 0,
          cost: 2040,
        },
        threeMenThirtyHours: {
          qty: 0,
          cost: 2550,
        },
        subcontractors: {
          qty: 0,
          cost: 0,
        },
      },
      fees: {
        permit: {
          qty: 1,
          cost: 300,
        },
        financing: {
          qty: 1,
          cost: 0,
        },
        tempTank: {
          qty: 1,
          cost: 0,
        },
        removal: {
          qty: 1,
          cost: 0,
        },
        rebates: {
          qty: 1,
          cost: 0,
        },
      },
      multiplier: 1.5,
      commission: 8,
      title: "",
      summary: "",
      specifications: "",
    },
  };
};
