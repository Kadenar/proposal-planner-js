import { createSlice } from "@reduxjs/toolkit";
import {
  addProposal as add_proposal,
  deleteProposal as delete_proposal,
  fetchProposals,
  deleteProposalsForClient as delete_proposals_for_client,
  saveProposal as save_proposal,
} from "../../middleware/proposalHelpers.ts";
import { updateStore } from "../Dispatcher.js";

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

export const initializeProposals = () => async (dispatch) => {
  const proposalsData = await fetchProposals();
  dispatch(updateProposals(proposalsData));
};

export async function addProposal(
  dispatch,
  { name, description, client_guid }
) {
  return updateStore({
    dispatch,
    dbOperation: async () => add_proposal(name, description, client_guid, null), // TODO handle images at some point
    methodToDispatch: updateProposals,
    dataKey: "proposals",
    successMessage: "Successfully added new proposal!",
  });
}

export async function copyProposal(
  dispatch,
  { name, description, client_guid, existing_proposal }
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

export async function deleteProposal(dispatch, { guid }) {
  return updateStore({
    dispatch,
    dbOperation: async () => delete_proposal(guid),
    methodToDispatch: updateProposals,
    dataKey: "proposals",
    successMessage: "Successfully deleted proposal!",
  });
}

export async function deleteProposalsForClient(
  dispatch,
  { clientName, clientGuid }
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
  dispatch,
  {
    guid,
    commission,
    fees,
    labor,
    products,
    unitCostTax,
    multiplier,
    title,
    summary,
    specifications,
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
        title,
        summary,
        specifications
      ),
    methodToDispatch: updateProposals,
    dataKey: "proposals",
    successMessage: "Your proposal has been successfully saved.",
  });
}
