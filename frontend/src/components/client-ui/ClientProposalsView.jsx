import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import MaterialTable from "@material-table/core";

import { updateStore } from "../../data-management/Dispatcher";
import { confirmDialog } from "../coreui/dialogs/ConfirmDialog";
import {
  updateProposals,
  updateSelectedClient,
  updateSelectedProposal,
} from "../../data-management/Reducers";
import { deleteProposal } from "../../data-management/InteractWithBackendData.ts";

const ClientProposalsView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedClient = useSelector((state) => state.selectedClient);
  const allProposals = useSelector((state) => state.allProposals);

  const proposalsForClient = useMemo(() => {
    return allProposals.filter((proposal) => {
      return proposal.client === selectedClient.name;
    });
  }, [allProposals, selectedClient]);

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
          type: proposal.guid,
          name: proposal.name,
          client: proposal.client,
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
          icon: "settings",
          tooltip: "View proposal",
          onClick: (event, rowData) => {
            dispatch(updateSelectedClient(null));
            dispatch(updateSelectedProposal(rowData));
            navigate("/proposals");
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
                  successMessage: `Successfully deleted ${rowData.name}`,
                });
              },
            });
          },
        },
      ]}
    />
  );
};

export default ClientProposalsView;
