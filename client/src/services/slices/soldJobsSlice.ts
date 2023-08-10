import { Dispatch, createSlice } from "@reduxjs/toolkit";
import {
  addSoldJob as add_job,
  deleteSoldJob as delete_job,
  fetchSoldJobs,
  updateSoldJob as save_job,
} from "../../middleware/soldJobHelpers";
import { updateStore } from "../Dispatcher";
import { SoldJob } from "../../middleware/Interfaces.ts";
import { markProposalAsDirty } from "./activeProposalSlice.ts";

// REDUCERS

const initialState: { soldJobs: SoldJob[] } = {
  soldJobs: [],
};

export const soldJobsSlice = createSlice({
  name: "soldJobs",
  initialState,
  reducers: {
    updateSoldJobs: (state, value) => {
      state.soldJobs = value.payload;
    },
  },
});

export default soldJobsSlice.reducer;

// ACTIONS

const { updateSoldJobs } = soldJobsSlice.actions;

export const initializeSoldJobs = () => async (dispatch: Dispatch) => {
  const soldJobsData = await fetchSoldJobs();
  dispatch(updateSoldJobs(soldJobsData));
};

export async function addSoldJob(
  dispatch: Dispatch,
  {
    proposal_guid,
    proposal_name,
    job_price,
    commission,
  }: {
    proposal_guid: string;
    proposal_name: string;
    job_price: number;
    commission: number;
  }
) {
  return updateStore({
    dispatch,
    dbOperation: async () =>
      add_job(proposal_guid, proposal_name, job_price, commission),
    methodToDispatch: updateSoldJobs,
    dataKey: "jobs",
    successMessage: "Successfully marked proposal as sold!",
  });
}

export async function deleteSoldJob(
  dispatch: Dispatch,
  { guid }: { guid: string }
) {
  return updateStore({
    dispatch,
    dbOperation: async () => delete_job(guid),
    methodToDispatch: updateSoldJobs,
    dataKey: "jobs",
    successMessage: "Successfully removed sold job!",
  });
}

export async function saveJob(
  dispatch: Dispatch,
  guid: string,
  completed: boolean,
  received_commission: boolean
) {
  const response = await updateStore({
    dispatch,
    dbOperation: async () => save_job(guid, completed, received_commission),
    methodToDispatch: updateSoldJobs,
    dataKey: "jobs",
    successMessage: "Your sold job has been successfully updated.",
  });

  if (response) {
    markProposalAsDirty(dispatch, false);
  }

  return response;
}
