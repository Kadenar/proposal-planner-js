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
    <Stack spacing={2}>
      <Stack gap={2}>
        <AddNewItem
          onClick={() =>
            laborDialog({
              header: "Add labor",
              name: "",
              qty: 0,
              cost: 0,
              onSubmit: async (name, qty, cost) =>
                addLabor(dispatch, { name, qty, cost }),
            })
          }
        />

        <MaterialTable
          title={
            "Labor management - (This controls defaults for new proposals)"
          }
          columns={[
            { title: "Name", field: "name" },
            {
              title: "Default quantity",
              field: "qty",
              searchable: false,
            },
            {
              title: "Default cost",
              field: "cost",
              searchable: false,
            },
          ]}
          data={labors.map((labor) => {
            return {
              id: labor.guid,
              name: labor.name,
              qty: labor.qty,
              cost: labor.cost,
              guid: labor.guid,
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
                  name: rowData.name, // TODO figure out why typescript isnt happy
                  qty: rowData.qty,
                  cost: rowData.cost,
                  onSubmit: async (name, qty, cost) =>
                    editLabor(dispatch, {
                      guid: rowData.guid,
                      name,
                      qty,
                      cost,
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
              qty: 0,
              cost: 0,
              type: "add",
              onSubmit: async (name, qty, cost, type) => {
                return addFee(dispatch, { name, qty, cost, type });
              },
            })
          }
        />

        <MaterialTable
          title={"Fee management - (This controls defaults for new proposals)"}
          columns={[
            { title: "Name", field: "name" },
            {
              title: "Default quantity",
              field: "qty",
              searchable: false,
            },
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
              qty: fee.qty,
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
                  qty: rowData.qty,
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
