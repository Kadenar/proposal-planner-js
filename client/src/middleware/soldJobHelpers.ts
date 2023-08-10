import { SoldJob } from "./Interfaces";
import {
  runGetRequest,
  runPostRequest,
  simpleDeleteFromDatabase,
} from "./database-actions";

/**
 * Fetch all jobs in the database
 * @returns
 */
export async function fetchSoldJobs(): Promise<SoldJob[]> {
  return await runGetRequest("jobs");
}

/**
 * Add new job to the database
 * @returns
 */
export async function addSoldJob(
  proposal_guid: string,
  proposal_name: string,
  job_price: number,
  commission: number
) {
  const existingJobs = await fetchSoldJobs();

  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  const newJob = {
    guid: proposal_guid,
    data: {
      name: proposal_name,
      job_price,
      commission,
      date_sold: `${month}/${day}/${year}`,
      date_completed: "",
      commission_received: false,
    },
  };
  return runPostRequest(existingJobs.concat(newJob), "jobs");
}

export async function updateSoldJob(
  guid: string,
  isSold: boolean,
  commissionReceived: boolean
) {
  const existingJobs = await fetchSoldJobs();

  const index = existingJobs.findIndex((job) => {
    return job.guid === guid;
  });

  if (index === -1) {
    return {
      status: 500,
      data: { message: "Job could not be found in database." },
    };
  }

  const newJobs = [...existingJobs];

  let dateSold = newJobs[index].data.date_sold;

  // If updating the job as sold (not already sold), set the date to now
  if (isSold && dateSold !== "") {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    dateSold = `${month}/${day}/${year}`;
  }

  newJobs[index] = {
    ...newJobs[index],
    data: {
      ...newJobs[index].data,
      commission_received: commissionReceived,
      date_sold: dateSold,
    },
  };

  return runPostRequest(newJobs, "jobs");
}

/**
 * Delete a given job from the database
 * @returns
 */
export async function deleteSoldJob(guid: string) {
  return await simpleDeleteFromDatabase(fetchSoldJobs, "jobs", guid, "guid");
}
