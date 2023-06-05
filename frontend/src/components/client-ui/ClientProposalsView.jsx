import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import MaterialTable from "@material-table/core";

import { confirmDialog } from "../coreui/dialogs/ConfirmDialog";
import { newProposalDialog } from "../coreui/dialogs/NewProposalDialog";

import { updateActiveClient } from "../../data-management/store/slices/clientsSlice";
import { selectProposal } from "../../data-management/store/slices/selectedProposalSlice";
import {
  addProposal,
  deleteProposal,
} from "../../data-management/store/slices/proposalsSlice";

const ClientProposalsView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { clients, selectedClient } = useSelector((state) => state.clients);
  const { proposals } = useSelector((state) => state.proposals);

  const proposalsForClient = useMemo(() => {
    return proposals.filter(
      (proposal) => selectedClient.guid === proposal?.owner?.guid
    );
  }, [proposals, selectedClient]);

  return (
    <MaterialTable
      title={`Proposals for ${selectedClient.name}`}
      columns={[
        { title: "Name", field: "name" },
        { title: "Description", field: "description" },
        { title: "Date created", field: "dateCreated" },
        { title: "Date modified", field: "dateModified" },
      ]}
      data={proposalsForClient.map((proposal) => {
        return {
          id: proposal.guid, // needed for material table dev tools warning
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
          onClick: (event, rowData) => {
            updateActiveClient(dispatch, { value: null });
            selectProposal(dispatch, { proposalData: rowData });
            navigate("/proposals");
          },
        },
        {
          icon: "save",
          tooltip: "Copy proposal",
          onClick: (event, rowData) => {
            newProposalDialog({
              name: rowData.name,
              description: rowData.description,
              owner: rowData.owner,
              clients,
              isExistingProposal: true,
              onSubmit: async (name, description, client_guid) =>
                addProposal(dispatch, { name, description, client_guid }),
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
              onSubmit: async () => {
                return deleteProposal(dispatch, { guid: rowData.guid });
              },
            });
          },
        },
      ]}
    />
  );
};

export default ClientProposalsView;
