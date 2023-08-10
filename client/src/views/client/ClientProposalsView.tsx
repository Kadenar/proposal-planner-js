import { useMemo, useState } from "react";
import { useAppSelector } from "../../services/store";

import MaterialTable from "@material-table/core";

import { ClientObject } from "../../middleware/Interfaces";

import Stack from "@mui/material/Stack";
import { ProposalMenuActions } from "../proposal/ProposalMenuActions";

const ClientProposalsView = ({
  selectedClient,
}: {
  selectedClient: ClientObject;
}) => {
  const { proposals } = useAppSelector((state) => state.proposals);

  const proposalsForClient = useMemo(() => {
    return proposals.filter(
      (proposal) => selectedClient?.guid === proposal?.owner?.guid
    );
  }, [proposals, selectedClient]);

  const [menuItemInfo, setMenuItemInfo] = useState<{
    anchorEl: HTMLAnchorElement | undefined;
    rowData: any;
  }>({
    anchorEl: undefined,
    rowData: undefined,
  });
  const open = Boolean(menuItemInfo.anchorEl);

  return (
    <Stack gap={2}>
      <MaterialTable
        title={`Proposals for ${selectedClient?.name}`}
        columns={[
          { title: "Name", field: "name" },
          { title: "Description", field: "description" },
          { title: "Date created", field: "date_created" },
          { title: "Date modified", field: "date_modified" },
        ]}
        data={proposalsForClient.map((proposal) => {
          return {
            id: proposal.guid,
            name: proposal.name,
            owner: proposal.owner,
            description: proposal.description,
            date_created: proposal.date_created,
            date_modified: proposal.date_modified,
            guid: proposal.guid,
            data: proposal.data,
          };
        })}
        options={{
          pageSizeOptions: [5, 10, 15, 20],
          pageSize: 5,
          actionsColumnIndex: -1,
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
        owner={selectedClient}
        menuItemInfo={menuItemInfo}
        setMenuItemInfo={setMenuItemInfo}
        open={open}
      />
    </Stack>
  );
};

export default ClientProposalsView;
