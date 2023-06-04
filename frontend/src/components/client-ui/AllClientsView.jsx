import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "@material-table/core";
import { Stack } from "@mui/material";
import { updateStore } from "../../data-management/store/Dispatcher";

import {
  addNewClient,
  deleteClient,
  deleteProposalsForClient,
} from "../../data-management/backend-helpers/InteractWithBackendData.ts";

import {
  updateClients,
  updateSelectedClient,
  updateProposals,
} from "../../data-management/store/Reducers";

import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import { confirmDialog } from "../coreui/dialogs/ConfirmDialog";
import { clientDialog } from "../coreui/dialogs/NewClientDialog";

export default function AllClientsView() {
  const dispatch = useDispatch();

  const clients = useSelector((state) => state.clients);
  const proposals = useSelector((state) => state.proposals);

  const clientsWithProposalInfo = useMemo(() => {
    if (proposals == null || clients == null) {
      return 0;
    }

    return clients.map((client) => {
      const client_proposals = proposals.filter((proposal) => {
        return proposal.client_guid === client.guid;
      });

      return { ...client, client_proposals };
    });
  }, [proposals, clients]);

  if (clients === null) {
    return <CircularProgress />;
  }

  return (
    <Stack padding={2} gap={2}>
      <Stack spacing={1} direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={() => {
            clientDialog({
              name: "",
              address: "",
              apt: "",
              state: "",
              city: "",
              zip: "",
              onSubmit: async (name, address, apt, state, city, zip) => {
                return updateStore({
                  dispatch,
                  dbOperation: async () =>
                    addNewClient({ name, address, apt, state, city, zip }),
                  methodToDispatch: updateClients,
                  dataKey: "clients",
                  successMessage: "Successfully added new client!",
                });
              },
            });
          }}
        >
          Create new client
        </Button>
      </Stack>
      <MaterialTable
        title={""}
        columns={[
          { title: "Name", field: "name" },
          { title: "Address", field: "address" },
          { title: "Account number", field: "accountNum" },
          { title: "Phone #", field: "phone" },
          { title: "Email", field: "email" },
          {
            title: "# of proposals",
            field: "proposals",
            cellStyle: {
              paddingLeft: "50px",
            },
          },
        ]}
        data={clientsWithProposalInfo.map((client) => {
          return {
            type: client.guid,
            name: client.name,
            address: `${client.address} ${client.apt} ${client.state} ${client.city} ${client.zip}`,
            accountNum: client.accountNum,
            phone: client.phone,
            email: client.email,
            proposals: client.client_proposals?.length || 0,
            fullInfo: client,
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
            tooltip: "View client",
            onClick: (event, rowData) => {
              dispatch(updateSelectedClient(rowData.fullInfo));
            },
          },
          {
            icon: "delete",
            tooltip: "Delete client",
            onClick: (event, rowData) => {
              confirmDialog({
                message:
                  "Are you sure? This action cannot be undone. Upon deleting a client, ALL proposals belonging to that client will also be deleted.",
                onSubmit: async () => {
                  const client_guid = rowData.fullInfo.guid;
                  const updatedClients = await updateStore({
                    dispatch,
                    dbOperation: async () => deleteClient(client_guid),
                    methodToDispatch: updateClients,
                    dataKey: "clients",
                    successMessage: `Successfully deleted client ${rowData.name}`,
                  });

                  if (!updatedClients) {
                    return false;
                  }

                  return await updateStore({
                    dispatch,
                    dbOperation: async () =>
                      deleteProposalsForClient(client_guid),
                    methodToDispatch: updateProposals,
                    dataKey: "proposals",
                    successMessage: `Successfully deleted proposals for client ${rowData.name}`,
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
