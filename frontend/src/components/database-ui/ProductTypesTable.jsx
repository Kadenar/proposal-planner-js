import React from "react";
import { useSelector, useDispatch } from "react-redux";
import MaterialTable from "@material-table/core";
import { Stack } from "@mui/material";
import { confirmDialog } from "../coreui/dialogs/ConfirmDialog";
import { productTypeDialog } from "../coreui/dialogs/ProductTypeDialog";
import {
  addNewProductType,
  editProductType,
  deleteProductType,
} from "../../data-management/backend-helpers/InteractWithBackendData.ts";
import AddNewItem from "../coreui/AddNewItem";

import { updateStore } from "../../data-management/store/Dispatcher";
import { updateFilters } from "../../data-management/store/Reducers";

/**
 * Component used to display the set of products that have been selected for this particular job
 * @returns
 */
export default function ProductTypesTable() {
  const filters = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  return (
    <Stack gap={2}>
      <AddNewItem
        onClick={() =>
          productTypeDialog({
            header: "Add product type?",
            productType: "",
            onSubmit: async (value) => {
              return updateStore({
                dispatch,
                dbOperation: async () => addNewProductType(value),
                methodToDispatch: updateFilters,
                dataKey: "types",
                successMessage: "Successfully added new product type!",
              });
            },
          })
        }
      />

      <MaterialTable
        title={"Database management"}
        columns={[
          { title: "Label", field: "label" },
          { title: "Key name", field: "guid", searchable: false },
        ]}
        data={filters.map((filter) => {
          return {
            label: filter.label,
            guid: filter.guid,
          };
        })}
        options={{
          sorting: true,
          search: true,
          actionsColumnIndex: -1,
          pageSizeOptions: [5, 10, 15, 20],
          pageSize: 15,
        }}
        actions={[
          {
            icon: "settings",
            tooltip: "Edit type",
            onClick: (event, rowData) => {
              productTypeDialog({
                header: "Edit product type",
                productType: rowData.label,
                onSubmit: async (value) => {
                  return updateStore({
                    dispatch,
                    dbOperation: async () =>
                      editProductType(value, rowData.guid),
                    methodToDispatch: updateFilters,
                    dataKey: "types",
                    successMessage: `Successfully edited ${rowData.label} to ${value}`,
                  });
                },
              });
            },
          },
          {
            icon: "delete",
            tooltip: "Remove type",
            onClick: (event, rowData) => {
              confirmDialog({
                message:
                  "Do you really want to delete this? This action cannot be undone.",
                onSubmit: async () => {
                  return updateStore({
                    dispatch,
                    dbOperation: async () => deleteProductType(rowData.guid),
                    methodToDispatch: updateFilters,
                    dataKey: "types",
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
