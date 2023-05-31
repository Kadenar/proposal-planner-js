import React, { useState, useEffect, useCallback } from "react";

import { useDispatch, batch } from "react-redux";
import MaterialTable from "material-table";
import { Stack } from "@mui/material";

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
} from "../../data-management/Reducers";
import { FetchProposalData } from "../../data-management/InteractWithBackendData";
import { CircularProgress } from "@material-ui/core";
import Button from "@mui/material/Button";
import { confirmDialog } from "../coreui/dialogs/ConfirmDialog";

export default function ListOfExistingProposals() {
  const dispatch = useDispatch();
  const [allProposals, setProposals] = useState(null);

  useEffect(() => {
    const asyncFunc = async () => {
      const proposals = await FetchProposalData();
      setProposals(proposals);
    };

    return asyncFunc();
  }, []);

  const selectProposal = useCallback(
    (value) => {
      // Batch to prevent multiple rerenders
      batch(() => {
        dispatch(updateSelectedProposal(value.name));
        dispatch(updateUnitCostTax(value.data.unitCostTax));
        dispatch(updateCommission(value.data.commission));
        dispatch(updateMultiplier(value.data.multiplier));

        // Handle the job table contents
        dispatch(resetProposal());

        value.data.models.forEach((model) => {
          dispatch(
            addProductToTable({
              label: model.name,
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
        <Button variant="contained">Create new proposal</Button>
      </Stack>
      <MaterialTable
        title={""}
        columns={[
          { title: "Name", field: "name" },
          { title: "Description", field: "description" },
          { title: "Date", field: "date" },
        ]}
        data={allProposals.map((proposal) => {
          return {
            type:
              proposal.name.charAt(0).toUpperCase() + proposal.name.slice(1),
            name: proposal.name,
            description: proposal.description,
            date: proposal.dateCreated,
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
            tooltip: "Remove product",
            onClick: (event, rowData) => {
              confirmDialog("Do you really want to delete this?", () =>
                console.log("deleting all the data!")
              );
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
