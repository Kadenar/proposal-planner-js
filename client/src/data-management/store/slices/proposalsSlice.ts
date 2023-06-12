import { Dispatch, createSlice } from "@reduxjs/toolkit";
import {
  addProposal as add_proposal,
  deleteProposal as delete_proposal,
  fetchProposals,
  deleteProposalsForClient as delete_proposals_for_client,
  saveProposal as save_proposal,
} from "../../middleware/proposalHelpers.ts";
import { updateStore } from "../Dispatcher.ts";
import {
  ProductOnProposal,
  ProposalObject,
  PsuedoObjectOfFees,
  PsuedoObjectOfLabor,
  QuoteOption,
} from "../../middleware/Interfaces.ts";

// REDUCERS

export const proposalsSlice = createSlice({
  name: "proposals",
  initialState: {
    proposals: [],
  },
  reducers: {
    updateProposals: (state, value) => {
      state.proposals = value.payload;
    },
  },
});

export default proposalsSlice.reducer;

// ACTIONS

const { updateProposals } = proposalsSlice.actions;

export const initializeProposals = () => async (dispatch: Dispatch) => {
  const proposalsData = await fetchProposals();
  dispatch(updateProposals(proposalsData));
};

export async function addProposal(
  dispatch: Dispatch,
  {
    name,
    description,
    client_guid,
  }: { name: string; description: string; client_guid: string | undefined }
) {
  return updateStore({
    dispatch,
    dbOperation: async () => add_proposal(name, description, client_guid, null),
    methodToDispatch: updateProposals,
    dataKey: "proposals",
    successMessage: "Successfully added new proposal!",
  });
}

export async function copyProposal(
  dispatch: Dispatch,
  {
    name,
    description,
    client_guid,
    existing_proposal,
  }: {
    name: string;
    description: string;
    client_guid: string;
    existing_proposal: ProposalObject | undefined;
  }
) {
  return updateStore({
    dispatch,
    dbOperation: async () =>
      add_proposal(name, description, client_guid, existing_proposal),
    methodToDispatch: updateProposals,
    dataKey: "proposals",
    successMessage: "Successfully copied proposal!",
  });
}

export async function deleteProposal(
  dispatch: Dispatch,
  { guid }: { guid: string }
) {
  return updateStore({
    dispatch,
    dbOperation: async () => delete_proposal(guid),
    methodToDispatch: updateProposals,
    dataKey: "proposals",
    successMessage: "Successfully deleted proposal!",
  });
}

export async function deleteProposalsForClient(
  dispatch: Dispatch,
  { clientName, clientGuid }: { clientName: string; clientGuid: string }
) {
  return updateStore({
    dispatch,
    dbOperation: async () => delete_proposals_for_client(clientGuid),
    methodToDispatch: updateProposals,
    dataKey: "proposals",
    successMessage: `Successfully deleted proposals for client ${clientName}`,
  });
}

export function saveProposal(
  dispatch: Dispatch,
  {
    guid,
    commission,
    fees,
    labor,
    products,
    unitCostTax,
    multiplier,
    quoteOptions,
  }: // title,
  // summary,
  // specifications,
  {
    guid: string;
    commission: number;
    fees: PsuedoObjectOfFees;
    labor: PsuedoObjectOfLabor;
    products: ProductOnProposal[];
    unitCostTax: number;
    multiplier: number;
    quoteOptions: QuoteOption[];
    // title: string | undefined;
    // summary: string | undefined;
    // specifications: ProposalSpec[] | undefined;
  }
) {
  return updateStore({
    dispatch,
    dbOperation: async () =>
      save_proposal(
        guid,
        commission,
        fees,
        labor,
        products,
        unitCostTax,
        multiplier,
        quoteOptions
        // title,
        // summary,
        // specifications
      ),
    methodToDispatch: updateProposals,
    dataKey: "proposals",
    successMessage: "Your proposal has been successfully saved.",
  });
}
