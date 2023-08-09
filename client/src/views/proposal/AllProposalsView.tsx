import { useState } from "react";

import MaterialTable from "@material-table/core";
import { Stack } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import {
  copyProposal,
  deleteProposal,
} from "../../services/slices/proposalsSlice";
import { selectProposal } from "../../services/slices/activeProposalSlice";

import { confirmDialog } from "../../components/dialogs/ConfirmDialog";
import { newProposalDialog } from "../../components/dialogs/frontend/NewProposalDialog";
import { useAppDispatch, useAppSelector } from "../../services/store";

export default function AllProposalsView() {
  const dispatch = useAppDispatch();
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
          { title: "Date created", field: "dateCreated" },
          { title: "Date modified", field: "dateModified" },
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
            dateCreated: proposal.dateCreated,
            dateModified: proposal.dateModified,
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
      <Menu
        anchorEl={menuItemInfo?.anchorEl}
        open={open}
        onClose={() =>
          setMenuItemInfo({
            anchorEl: undefined,
            rowData: undefined,
          })
        }
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={(e) => {
            selectProposal(dispatch, menuItemInfo.rowData);
          }}
        >
          Work on proposal
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuItemInfo({
              ...menuItemInfo,
              anchorEl: undefined,
            });

            if (!menuItemInfo.rowData) {
              return;
            }

            newProposalDialog({
              name: menuItemInfo.rowData.name,
              description: `${menuItemInfo.rowData.description} copy`,
              owner: menuItemInfo.rowData.owner,
              clients,
              isExistingProposal: true,
              onSubmit: (name, description, client_guid) =>
                copyProposal(dispatch, {
                  name,
                  description,
                  client_guid,
                  existing_proposal: menuItemInfo.rowData,
                }),
            });
          }}
        >
          Copy proposal
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMenuItemInfo({
              ...menuItemInfo,
              anchorEl: undefined,
            });

            confirmDialog({
              message:
                "Do you really want to delete this? This action cannot be undone.",
              onSubmit: async () =>
                deleteProposal(dispatch, { guid: menuItemInfo.rowData.guid }),
            });
          }}
        >
          Delete proposal
        </MenuItem>
      </Menu>
    </Stack>
  );
}
