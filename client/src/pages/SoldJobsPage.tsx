import { useState } from "react";

import MaterialTable from "@material-table/core";
import { Stack } from "@mui/material";

import { useAppSelector } from "../services/store";
import { ccyFormat } from "../lib/pricing-utils";

export default function SoldJobsPage() {
  const { soldJobs } = useAppSelector((state) => state.soldJobs);

  const [menuItemInfo, setMenuItemInfo] = useState<{
    anchorEl: HTMLAnchorElement | undefined;
    rowData: any;
  }>({
    anchorEl: undefined,
    rowData: undefined,
  });
  const open = Boolean(menuItemInfo.anchorEl);

  return (
    <Stack padding={2} gap={2}>
      <MaterialTable
        title=""
        columns={[
          { title: "Name", field: "data.name" },
          { title: "Job price", field: "data.job_price" },
          { title: "Commission", field: "data.commission" },
          { title: "Commission received", field: "data.commission_received" },
          { title: "Date sold", field: "data.date_sold" },
          { title: "Date completed", field: "data.date_completed" },
        ]}
        data={soldJobs.map((job) => {
          return {
            id: job.guid, // needed for material table dev tools warning
            guid: job.guid,
            data: {
              ...job.data,
              job_price: ccyFormat(job.data.job_price),
              commission: ccyFormat(job.data.commission),
              commission_received: job.data.commission_received ? "Yes" : "No",
            },
          };
        })}
        options={{
          pageSizeOptions: [5, 10, 15, 20],
          pageSize: 15,
          actionsColumnIndex: -1,
          headerStyle: {
            paddingRight: 15,
          },
        }}
        actions={[
          {
            icon: "pending",
            tooltip: "Actions",
            onClick: (event, rowData) =>
              setMenuItemInfo({
                anchorEl: event.currentTarget,
                rowData,
              }),
          },
        ]}
      />
      {/* <ProposalMenuActions
        owner={menuItemInfo?.rowData?.owner}
        menuItemInfo={menuItemInfo}
        setMenuItemInfo={setMenuItemInfo}
        open={open}
      /> */}
    </Stack>
  );
}
