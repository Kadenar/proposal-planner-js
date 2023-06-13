import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../services/store";

import MaterialTable from "@material-table/core";
import Stack from "@mui/material/Stack";

import {
  addClient,
  deleteClient,
  updateActiveClient,
} from "../../services/slices/clientsSlice";
import { deleteProposalsForClient } from "../../services/slices/proposalsSlice";

import Button from "@mui/material/Button";
import { confirmDialog } from "../../components/dialogs/ConfirmDialog";
import { clientDialog } from "../../components/dialogs/frontend/NewClientDialog";

export default function AllClientsView() {
  const dispatch = useAppDispatch();
  const { clients } = useAppSelector((state) => state.clients);
  const { proposals } = useAppSelector((state) => state.proposals);

  const clientsWithProposalInfo = useMemo(() => {
    return clients.map((client) => {
      const client_proposals = proposals.filter(
        (proposal) => client.guid === proposal?.owner?.guid
      );

      return { ...client, client_proposals };
    });
  }, [proposals, clients]);

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
              onSubmit: async (name, address, apt, state, city, zip) =>
                addClient(dispatch, { name, address, apt, state, city, zip }),
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
            id: client.guid, // needed for material table dev tools warning
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
            icon: "edit",
            tooltip: "View client",
            onClick: (event, rowData) => {
              updateActiveClient(dispatch, rowData.fullInfo);
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
                  const clientsAfterDelete = await deleteClient(dispatch, {
                    guid: client_guid,
                  });

                  if (!clientsAfterDelete) {
                    return false;
                  }

                  return deleteProposalsForClient(dispatch, {
                    clientName: rowData.name,
                    clientGuid: client_guid,
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
