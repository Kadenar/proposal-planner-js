import { useState } from "react";

import MaterialTable from "@material-table/core";
import { Stack } from "@mui/material";

import { useAppSelector } from "../../services/store";
import { ProposalMenuActions } from "./ProposalMenuActions";

export default function AllProposalsView() {
  const { proposals } = useAppSelector((state) => state.proposals);
  const { clients } = useAppSelector((state) => state.clients);

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
          { title: "Name", field: "name" },
          { title: "Description", field: "description" },
          { title: "Client", field: "owner.name" },
          { title: "Date created", field: "date_created" },
          { title: "Date modified", field: "date_modified" },
        ]}
        data={proposals.map((proposal) => {
          return {
            id: proposal.guid, // needed for material table dev tools warning
            name: proposal.name,
            description: proposal.description,
            owner: {
              ...proposal.owner,
              name:
                clients.find((client) => client.guid === proposal?.owner?.guid)
                  ?.name || "Orphaned proposal",
            },
            date_created: proposal.date_created,
            date_modified: proposal.date_modified,
            guid: proposal.guid,
            data: proposal.data,
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
      <ProposalMenuActions
        owner={menuItemInfo?.rowData?.owner}
        menuItemInfo={menuItemInfo}
        setMenuItemInfo={setMenuItemInfo}
        open={open}
      />
    </Stack>
  );
}
