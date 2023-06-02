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
} from "../../data-management/InteractWithBackendData";
import { updateFilters } from "../../data-management/Reducers";
import AddNewItem from "../coreui/AddNewItem";

import { updateStore } from "../../data-management/Dispatcher";

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
                dbOperation: async () => addNewProductType({ label: value }),
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
          { title: "Key name", field: "standard_value", searchable: false },
        ]}
        data={filters.map((filter) => {
          return {
            label: filter.label,
            standard_value: filter.standard_value,
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
                      editProductType({
                        label: value,
                        standard_value: rowData.standard_value,
                      }),
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
                    dbOperation: async () =>
                      deleteProductType({ name: rowData.standard_value }),
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
