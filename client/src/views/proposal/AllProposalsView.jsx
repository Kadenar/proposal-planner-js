import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import MaterialTable from "@material-table/core";
import { Stack, CircularProgress, Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import {
  addProposal,
  copyProposal,
  deleteProposal,
} from "../../data-management/store/slices/proposalsSlice";
import { selectProposal } from "../../data-management/store/slices/selectedProposalSlice";

import { confirmDialog } from "../../components/coreui/dialogs/ConfirmDialog";
import { newProposalDialog } from "../../components/coreui/dialogs/frontend/NewProposalDialog";

export default function AllProposalsView() {
  const dispatch = useDispatch();
  const { proposals } = useSelector((state) => state.proposals);
  const { clients } = useSelector((state) => state.clients);
  const [menuItemInfo, setMenuItemInfo] = useState({
    anchorEl: null,
    rowData: null,
  });
  const open = Boolean(menuItemInfo?.anchorEl);

  if (proposals === null) {
    return <CircularProgress />;
  }

  return (
    <Stack padding={2} gap={2}>
      <Stack spacing={1} direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={() => {
            newProposalDialog({
              name: "",
              description: "",
              owner: {
                guid: "",
              },
              clients,
              isExistingProposal: false,
              onSubmit: async (name, description, client_guid) =>
                addProposal(dispatch, { name, description, client_guid }),
            });
          }}
        >
          Create new proposal
        </Button>
      </Stack>
      <MaterialTable
        title={""}
        editable={true}
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
        onClose={() => setMenuItemInfo(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={(e) => {
            selectProposal(dispatch, { proposalData: menuItemInfo.rowData });
          }}
        >
          Edit proposal
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            setMenuItemInfo(null);
            console.log("TBD");
          }}
        >
          Mark as sold
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            setMenuItemInfo(null);
            newProposalDialog({
              name: menuItemInfo.rowData.name,
              description: menuItemInfo.rowData.description,
              owner: menuItemInfo.rowData.owner.client,
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
          onClick={(e) => {
            setMenuItemInfo(null);
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
