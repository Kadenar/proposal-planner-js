import React from "react";

import { useSelector, useDispatch } from "react-redux";
import MaterialTable from "@material-table/core";
import { Stack, CircularProgress, Button } from "@mui/material";

import {
  addProposal,
  copyProposal,
  deleteProposal,
} from "../../data-management/store/slices/proposalsSlice";
import { selectProposal } from "../../data-management/store/slices/selectedProposalSlice";

import { confirmDialog } from "../coreui/dialogs/ConfirmDialog";
import { newProposalDialog } from "../coreui/dialogs/NewProposalDialog";

export default function ExistingProposals() {
  const dispatch = useDispatch();
  const { proposals } = useSelector((state) => state.proposals);
  const { clients } = useSelector((state) => state.clients);

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
        }}
        actions={[
          {
            icon: "edit",

            tooltip: "Edit proposal",
            onClick: (event, rowData) =>
              selectProposal(dispatch, { proposalData: rowData }),
          },
          {
            icon: "save",
            tooltip: "Copy proposal",
            onClick: (event, rowData) => {
              newProposalDialog({
                name: rowData.name,
                description: rowData.description,
                owner: rowData.owner.client,
                clients,
                isExistingProposal: true,
                onSubmit: (name, description, client_guid) =>
                  copyProposal(dispatch, {
                    name,
                    description,
                    client_guid,
                    existing_proposal: rowData,
                  }),
              });
            },
          },
          {
            icon: "delete",
            tooltip: "Delete proposal",
            onClick: (event, rowData) => {
              confirmDialog({
                message:
                  "Do you really want to delete this? This action cannot be undone.",
                onSubmit: async () =>
                  deleteProposal(dispatch, { guid: rowData.guid }),
              });
            },
          },
        ]}
      />
    </Stack>
  );
}
