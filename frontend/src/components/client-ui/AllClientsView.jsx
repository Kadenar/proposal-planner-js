import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialTable from "@material-table/core";
import { Stack } from "@mui/material";
import { updateStore } from "../../data-management/Dispatcher";

import {
  addNewClient,
  deleteClient,
} from "../../data-management/InteractWithBackendData";

import {
  updateClients,
  updateSelectedClient,
} from "../../data-management/Reducers";

import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import { confirmDialog } from "../coreui/dialogs/ConfirmDialog";
import { clientDialog } from "../coreui/dialogs/NewClientDialog";

export default function AllClientsView() {
  const dispatch = useDispatch();

  const allClients = useSelector((state) => state.allClients);
  const allProposals = useSelector((state) => state.allProposals);

  const allClientsWithProposalInfo = useMemo(() => {
    if (allProposals == null || allClients == null) {
      return 0;
    }

    return allClients.map((client) => {
      const proposals = allProposals.filter((proposal) => {
        return proposal.client === client.name;
      });

      return { ...client, proposals };
    });
  }, [allProposals, allClients]);

  if (allClients === null) {
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
                    addNewClient({
                      name,
                      address,
                      apt,
                      state,
                      city,
                      zip,
                    }),
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
          { title: "# of proposals", field: "proposals" },
        ]}
        data={allClientsWithProposalInfo.map((client) => {
          return {
            type: client.guid,
            name: client.name,
            address: `${client.address} ${client.apt} ${client.state} ${client.city} ${client.zip}`,
            accountNum: client.accountNum,
            phone: client.phone,
            email: client.email,
            proposals: client.proposals.length,
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
                  "Do you really want to delete this? This action cannot be undone.",
                onSubmit: async () => {
                  return updateStore({
                    dispatch,
                    dbOperation: async () =>
                      deleteClient({ guid: rowData.fullInfo.guid }),
                    methodToDispatch: updateClients,
                    dataKey: "clients",
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
