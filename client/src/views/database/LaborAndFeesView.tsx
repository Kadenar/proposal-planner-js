import { useDispatch, useSelector } from "react-redux";

import Stack from "@mui/material/Stack";

import AddNewItem from "../../components/coreui/AddNewItem";
import MaterialTable from "@material-table/core";
import { laborDialog } from "../../components/coreui/dialogs/backend/LaborDialog";
import {
  addLabor,
  deleteLabor,
  editLabor,
} from "../../data-management/store/slices/laborsSlice";

import { confirmDialog } from "../../components/coreui/dialogs/ConfirmDialog";
import {
  addFee,
  deleteFee,
  editFee,
} from "../../data-management/store/slices/feesSlice";
import { feeDialog } from "../../components/coreui/dialogs/backend/FeeDialog";
import { ReduxStore } from "../../data-management/middleware/Interfaces";

const LaborAndFeesView = () => {
  const dispatch = useDispatch();
  const { labors } = useSelector((state: ReduxStore) => state.labors);
  const { fees } = useSelector((state: ReduxStore) => state.fees);

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
                laborDialog({
                  header: "Edit labor",
                  name: rowData.name,
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
                  onSubmit: async () =>
                    deleteLabor(dispatch, { guid: rowData.guid }),
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
              onClick: (
                event,
                rowData: {
                  id: string;
                  guid: string;
                  name: string;
                  qty: number;
                  cost: number;
                  type: string;
                }
              ) => {
                console.log(event);
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
                  onSubmit: async () =>
                    deleteFee(dispatch, { guid: rowData.guid }),
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
