import React, { useCallback } from "react";

import { useDispatch, batch, useSelector } from "react-redux";
import MaterialTable from "material-table";
import { Stack } from "@mui/material";
import { updateStore } from "../../data-management/Dispatcher";

import {
  addProposal,
  deleteProposal,
} from "../../data-management/InteractWithBackendData";

import {
  updateCommission,
  updateFee,
  updateLaborQuantity,
  updateMultiplier,
  updateSelectedProposal,
  updateUnitCostTax,
  updateLaborCost,
  addProductToTable,
  resetProposal,
  updateProposals,
} from "../../data-management/Reducers";

import { CircularProgress } from "@material-ui/core";
import Button from "@mui/material/Button";
import { confirmDialog } from "../coreui/dialogs/ConfirmDialog";
import { newProposalDialog } from "../coreui/dialogs/NewProposalDialog";

export default function ExistingProposals() {
  const dispatch = useDispatch();
  const allProposals = useSelector((state) => state.allProposals);

  const selectProposal = useCallback(
    (value) => {
      // Batch to prevent multiple rerenders
      batch(() => {
        // Handle the job table contents
        dispatch(resetProposal());

        dispatch(updateSelectedProposal(value));
        dispatch(updateUnitCostTax(value.data.unitCostTax));
        dispatch(updateCommission(value.data.commission));
        dispatch(updateMultiplier(value.data.multiplier));

        value.data.models.forEach((model) => {
          dispatch(
            addProductToTable({
              guid: model.guid,
              name: model.name,
              catalogNum: model.catalogNum,
              unitCost: model.unitCost,
              quantity: model.qty,
              totalCost: model.unitCost * model.qty,
            })
          );
        });

        const fees = value.data.fees;
        Object.keys(fees).forEach((fee) => {
          dispatch(updateFee(fee, fees[fee].cost));
        });

        const labors = value.data.labor;
        Object.keys(labors).forEach((labor) => {
          dispatch(updateLaborQuantity(labor, labors[labor].qty));
          dispatch(updateLaborCost(labor, labors[labor].cost));
        });
      });
    },
    [dispatch]
  );

  if (allProposals === null) {
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
              onSubmit: async (name, description) => {
                return updateStore({
                  dispatch,
                  dbOperation: async () =>
                    addProposal({
                      name,
                      description,
                    }),
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
        data={allProposals.map((proposal) => {
          return {
            type: proposal.guid,
            name: proposal.name,
            description: proposal.description,
            client: proposal.client,
            dateCreated: proposal.dateCreated,
            dateModified: proposal.dateModified,
            guid: proposal.guid,
            data: proposal.data,
          };
        })}
        actions={[
          {
            icon: "settings",
            tooltip: "Edit proposal",
            onClick: (event, rowData) => {
              selectProposal(rowData);
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
                    dbOperation: async () =>
                      deleteProposal({ guid: rowData.guid }),
                    methodToDispatch: updateProposals,
                    dataKey: "proposals",
                    successMessage: `Successfully deleted ${rowData.label}`,
                  });
                },
              });
            },
          },
        ]}
        options={{
          pageSizeOptions: [5, 10, 15, 20],
          pageSize: 15,
          actionsColumnIndex: -1,
        }}
      />
    </Stack>
  );
}
