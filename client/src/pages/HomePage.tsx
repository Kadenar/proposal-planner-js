import { useMemo } from "react";
import { useAppSelector } from "../services/store";
import DashboardView from "../views/dashboard/DashboardView";
import { groupBy, partition } from "lodash";

const MONTHS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
export default function HomePage() {
  const { soldJobs } = useAppSelector((state) => state.soldJobs);
  const { proposals } = useAppSelector((state) => state.proposals);
  const { clients } = useAppSelector((state) => state.clients);

  const commissionInfo = useMemo(() => {
    // Create an array containing both received and outstanding commissions
    const commissionsPartioned = partition(soldJobs, function (o) {
      return o.data.commission_received;
    });

    return {
      numberOfCommissionsReceived: commissionsPartioned[0].length,
      commissionsReceived: commissionsPartioned[0]
        .map(({ data: { commission } }) => commission)
        .reduce((sum, i) => sum + i, 0),
      numberOfCommissionsOutstanding: commissionsPartioned[1].length,
      commissionsOutstanding: commissionsPartioned[1]
        .map(({ data: { commission } }) => commission)
        .reduce((sum, i) => sum + i, 0),
    };
  }, [soldJobs]);

  // Compute information about jobs that have been completed
  const jobInfo = useMemo(() => {
    const jobsCompletedPartioned = partition(soldJobs, function (o) {
      return o.data.date_completed !== "";
    });

    // Jobs that have been completed by the company
    const jobsCompletedByMonthObj = groupBy(
      jobsCompletedPartioned[0],
      function (o) {
        const d = new Date(o.data.date_completed || "");
        return d.getMonth();
      }
    );

    // Construct array of with jobs pertaining to appropriate month
    const jobsCompletedByMonthArr = MONTHS.map((date) => {
      if (jobsCompletedByMonthObj[date]) {
        return {
          jobs: jobsCompletedByMonthObj[date],
        };
      }

      return {
        jobs: [],
      };
    });

    // Jobs that were sold by the salesmen
    const jobsSoldByMonthObj = groupBy(soldJobs, function (o) {
      const d = new Date(o.data.date_sold || "");
      return d.getMonth();
    });

    // Array of months with array of jobs in each month
    const jobsSoldByMonthArr = MONTHS.map((date) => {
      if (jobsSoldByMonthObj[date]) {
        return {
          jobs: jobsSoldByMonthObj[date],
        };
      }

      return {
        jobs: [],
      };
    });

    return {
      jobsCompleted: jobsCompletedPartioned[0].length,
      jobsOutstanding: jobsCompletedPartioned[1].length,
      jobsCompletedByMonthArr,
      jobsSoldByMonthArr,
    };
  }, [soldJobs]);

  const salesData = useMemo(() => {
    return {
      numberOfClients: clients.length,
      numberOfDraftedProposals: proposals.length,

      // Commission info
      numberOfCommissionsReceived: commissionInfo.numberOfCommissionsReceived,
      commissionsReceived: commissionInfo.commissionsReceived,
      numberOfCommissionsOutstanding:
        commissionInfo.numberOfCommissionsOutstanding,
      commissionsOutstanding: commissionInfo.numberOfCommissionsOutstanding,

      // Job info
      totalJobsSold: soldJobs.length,
      jobsCompleted: jobInfo.jobsCompleted,
      jobsOutstanding: jobInfo.jobsOutstanding,
      jobsCompletedByMonth: jobInfo.jobsCompletedByMonthArr,
      jobsSoldByMonth: jobInfo.jobsSoldByMonthArr,
    };
  }, [commissionInfo, jobInfo, soldJobs, proposals.length, clients.length]);

  return <DashboardView salesData={salesData} />;
}
