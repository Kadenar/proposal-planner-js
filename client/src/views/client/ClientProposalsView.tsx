import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import MaterialTable from "@material-table/core";

import { confirmDialog } from "../../components/coreui/dialogs/ConfirmDialog";
import { newProposalDialog } from "../../components/coreui/dialogs/frontend/NewProposalDialog";

import { updateActiveClient } from "../../data-management/store/slices/clientsSlice";
import { selectProposal } from "../../data-management/store/slices/activeProposalSlice";
import {
  addProposal,
  deleteProposal,
} from "../../data-management/store/slices/proposalsSlice";
import { ProposalObject } from "../../data-management/middleware/Interfaces";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {
  useAppDispatch,
  useAppSelector,
} from "../../data-management/store/store";

const ClientProposalsView = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { clients, selectedClient } = useAppSelector((state) => state.clients);
  const { proposals } = useAppSelector((state) => state.proposals);

  const proposalsForClient = useMemo(() => {
    return proposals.filter(
      (proposal) => selectedClient?.guid === proposal?.owner?.guid
    );
  }, [proposals, selectedClient]);

  return (
    <Stack gap={2}>
      {selectedClient && (
        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={() => {
              newProposalDialog({
                name: "",
                description: "",
                owner: {
                  ...selectedClient,
                },
                clients,
                isExistingProposal: false,
                onSubmit: async (name, description, client_guid) =>
                  addProposal(dispatch, { name, description, client_guid }),
              });
            }}
          >
            Create a proposal
          </Button>
        </Stack>
      )}
      <MaterialTable
        title={`Proposals for ${selectedClient?.name}`}
        columns={[
          { title: "Name", field: "name" },
          { title: "Description", field: "description" },
          { title: "Date created", field: "dateCreated" },
          { title: "Date modified", field: "dateModified" },
        ]}
        data={proposalsForClient.map((proposal) => {
          return {
            id: proposal.guid,
            name: proposal.name,
            owner: proposal.owner,
            description: proposal.description,
            dateCreated: proposal.dateCreated,
            dateModified: proposal.dateModified,
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
            icon: "edit",
            tooltip: "View proposal",
            onClick: (_, rowData: RowData<ProposalObject>) => {
              updateActiveClient(dispatch, undefined);
              selectProposal(dispatch, rowData);
              navigate("/proposals");
            },
          },
          {
            icon: "save",
            tooltip: "Copy proposal",
            onClick: (_, rowData) => {
              // TODO Figure out why typescript is yelling at me about this
              newProposalDialog({
                name: rowData.name,
                description: rowData.description,
                owner: rowData.owner,
                clients,
                isExistingProposal: true,
                onSubmit: async (
                  // TODO Come back to for typescript complaining
                  name: string,
                  description: string,
                  client_guid: string | undefined
                ) => addProposal(dispatch, { name, description, client_guid }),
              });
            },
          },
          {
            icon: "delete",
            tooltip: "Delete proposal",
            onClick: (_, rowData) => {
              confirmDialog({
                message:
                  "Do you really want to delete this? This action cannot be undone.",
                onSubmit: async () => {
                  return deleteProposal(dispatch, { guid: rowData.guid }); // TODO Figure out why typescript is yelling at me about this
                },
              });
            },
          },
        ]}
      />
    </Stack>
  );
};

export default ClientProposalsView;
