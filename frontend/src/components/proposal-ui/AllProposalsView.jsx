import React, { useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "@material-table/core";
import { Stack, CircularProgress, Button } from "@mui/material";
import { updateStore } from "../../data-management/store/Dispatcher";

import {
  addProposal,
  deleteProposal,
} from "../../data-management/backend-helpers/InteractWithBackendData.ts";

import {
  updateProposals,
  selectProposal,
} from "../../data-management/store/Reducers";

import { confirmDialog } from "../coreui/dialogs/ConfirmDialog";
import { newProposalDialog } from "../coreui/dialogs/NewProposalDialog";

export default function ExistingProposals() {
  const dispatch = useDispatch();
  const proposals = useSelector((state) => state.proposals);
  const clients = useSelector((state) => state.clients);

  const selectProposalCallback = useCallback(
    (value) => {
      dispatch(selectProposal(value));
    },
    [dispatch]
  );

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
              selectedClient: {},
              clients,
              onSubmit: async (name, description, client_guid) => {
                return updateStore({
                  dispatch,
                  dbOperation: async () =>
                    addProposal(name, description, client_guid),
                  methodToDispatch: updateProposals,
                  dataKey: "proposals",
                  successMessage: "Successfully added new proposal!",
                });
              },
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
          { title: "Client", field: "client" },
          { title: "Date created", field: "dateCreated" },
          { title: "Date modified", field: "dateModified" },
        ]}
        data={proposals.map((proposal) => {
          const matchingClient = clients.find((client) => {
            return client.guid === proposal.client_guid;
          });

          return {
            type: proposal.guid,
            name: proposal.name,
            description: proposal.description,
            client: matchingClient?.name || "Orphaned proposal",
            client_guid: matchingClient?.guid || "",
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
            icon: "settings",
            tooltip: "Edit proposal",
            onClick: (event, rowData) => {
              selectProposalCallback(rowData);
            },
          },
          {
            icon: "delete",
            tooltip: "Delete proposal",
            onClick: (event, rowData) => {
              confirmDialog({
                message:
                  "Do you really want to delete this? This action cannot be undone.",
                onSubmit: async () => {
                  return updateStore({
                    dispatch,
                    dbOperation: async () => deleteProposal(rowData.guid),
                    methodToDispatch: updateProposals,
                    dataKey: "proposals",
                    successMessage: `Successfully deleted ${rowData.label}`,
                  });
                },
              });
            },
          },
        ]}
      />
    </Stack>
  );
}
