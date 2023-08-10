import { useMemo } from "react";
import { useAppSelector } from "../services/store";
import DashboardView from "../views/dashboard/DashboardView";
import lodash from "lodash";

export default function HomePage() {
  const { soldJobs } = useAppSelector((state) => state.soldJobs);

  const salesData = useMemo(() => {
    const jobsCompletedPartioned = lodash.partition(soldJobs, function (o) {
      return o.data.date_completed !== "";
    });

    // Create an array containing both received and outstanding commissions
    const commissionsPartioned = lodash.partition(soldJobs, function (o) {
      return o.data.commission_received;
    });

    return {
      commissionsReceived: commissionsPartioned[0]
        .map(({ data: { commission } }) => commission)
        .reduce((sum, i) => sum + i, 0),
      commissionsOutstanding: commissionsPartioned[1]
        .map(({ data: { commission } }) => commission)
        .reduce((sum, i) => sum + i, 0),
      jobsCompleted: jobsCompletedPartioned[0].length,
      jobsOutstanding: jobsCompletedPartioned[1].length,
      totalJobsSold: soldJobs.length,
    };
  }, [soldJobs]);

  return <DashboardView salesData={salesData} />;
}
