import { useAppDispatch, useAppSelector } from "../../services/store";

import Stack from "@mui/material/Stack";

import AddNewItem from "../../components/AddNewItem";
import MaterialTable from "@material-table/core";
import { laborDialog } from "../../components/dialogs/backend/LaborDialog";
import {
  addLabor,
  deleteLabor,
  editLabor,
} from "../../services/slices/laborsSlice";

import { confirmDialog } from "../../components/dialogs/ConfirmDialog";
import { addFee, deleteFee, editFee } from "../../services/slices/feesSlice";
import { feeDialog } from "../../components/dialogs/backend/FeeDialog";

const LaborAndFeesView = () => {
  const dispatch = useAppDispatch();
  const { labors } = useAppSelector((state) => state.labors);
  const { fees } = useAppSelector((state) => state.fees);

  return (
    <Stack gap={2}>
      <Stack gap={1}>
        <AddNewItem
          onClick={() =>
            laborDialog({
              header: "Add labor",
              name: "",
              cost: 0,
              allowCostOverride: false,
              onSubmit: async (name, cost, allowCostOverride) =>
                addLabor(dispatch, { name, cost, allowCostOverride }),
            })
          }
        />

        <MaterialTable
          title={"Labor management"}
          columns={[
            { title: "Name", field: "name" },
            {
              title: "Default cost",
              field: "cost",
              searchable: false,
            },
            {
              title: "Is cost editable on proposals?",
              field: "allowCostOverride",
              searchable: false,
            },
          ]}
          data={labors.map((labor) => {
            return {
              id: labor.guid,
              name: labor.name,
              cost: labor.cost,
              guid: labor.guid,
              allowCostOverride: labor.allowCostOverride,
            };
          })}
          options={{
            maxColumnSort: "all_columns",
            search: false,
            actionsColumnIndex: -1,
            pageSizeOptions: [5, 10, 15],
            pageSize: 5,
          }}
          actions={[
            {
              icon: "edit",
              tooltip: "Edit labor",
              onClick: (_, rowData) => {
                // Keeping typescript happy
                if (!rowData || rowData instanceof Array) {
                  return;
                }

                laborDialog({
                  header: "Edit labor",
                  name: rowData.name,
                  cost: rowData.cost,
                  allowCostOverride: rowData.allowCostOverride,
                  onSubmit: async (name, cost, allowCostOverride) =>
                    editLabor(dispatch, {
                      guid: rowData.guid,
                      name,
                      cost,
                      allowCostOverride,
                    }),
                });
              },
            },
            {
              icon: "delete",
              tooltip: "Remove labor",
              onClick: (_, rowData) => {
                confirmDialog({
                  message:
                    "Do you really want to delete this? This action cannot be undone.",
                  onSubmit: async () => {
                    // Keeping typescript happy
                    if (!rowData || rowData instanceof Array) {
                      return false;
                    }

                    return deleteLabor(dispatch, { guid: rowData.guid });
                  },
                });
              },
            },
          ]}
        />
      </Stack>
      <Stack gap={2}>
        <AddNewItem
          onClick={() =>
            feeDialog({
              header: "Add fee",
              name: "",
              cost: 0,
              type: "add",
              onSubmit: async (name, qty, cost, type) => {
                return addFee(dispatch, { name, qty, cost, type });
              },
            })
          }
        />

        <MaterialTable
          title="Fee management"
          columns={[
            { title: "Name", field: "name" },
            {
              title: "Default cost",
              field: "cost",
              searchable: false,
            },
            {
              title: "Type",
              field: "type",
              searchable: false,
            },
          ]}
          data={fees.map((fee) => {
            return {
              id: fee.guid,
              name: fee.name,
              cost: fee.cost,
              type: fee.type,
              guid: fee.guid,
            };
          })}
          options={{
            maxColumnSort: "all_columns",
            search: false,
            actionsColumnIndex: -1,
            pageSizeOptions: [5, 10, 15],
            pageSize: 5,
          }}
          actions={[
            {
              icon: "edit",
              tooltip: "Edit fee",
              onClick: (_, rowData) => {
                // Keeping typescript happy
                if (!rowData || rowData instanceof Array) {
                  return false;
                }

                feeDialog({
                  header: "Edit fee",
                  name: rowData.name,
                  cost: rowData.cost,
                  type: rowData.type,
                  onSubmit: async (name, qty, cost, type) =>
                    editFee(dispatch, {
                      guid: rowData.guid,
                      name,
                      qty,
                      cost,
                      type,
                    }),
                });
              },
            },
            {
              icon: "delete",
              tooltip: "Remove fee",
              onClick: (_, rowData) => {
                confirmDialog({
                  message:
                    "Do you really want to delete this? This action cannot be undone.",
                  onSubmit: async () => {
                    // Keeping typescript happy
                    if (!rowData || rowData instanceof Array) {
                      return false;
                    }

                    return deleteFee(dispatch, { guid: rowData.guid });
                  },
                });
              },
            },
          ]}
        />
      </Stack>
    </Stack>
  );
};

export default LaborAndFeesView;
