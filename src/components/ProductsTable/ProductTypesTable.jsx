import React from "react";
import { useSelector, useDispatch } from "react-redux";
import MaterialTable from "material-table";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { confirmDialog } from "../coreui/dialogs/ConfirmDialog";
import { productTypeDialog } from "../coreui/dialogs/AddProductType";
import { AddNewProductType } from "../../data-management/InteractWithBackendData";
import { updateFilters } from "../../data-management/Reducers";

/**
 * Component used to display the set of products that have been selected for this particular job
 * @returns
 */
export default function ProductsTable() {
  const filters = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  return (
    <Stack padding={2} gap={2}>
      <Stack spacing={1} direction="row" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={() =>
            productTypeDialog(
              "Add product type?",
              "",
              (value) => {
                return filters.find(
                  (filter) => filter.label.toLowerCase() === value.toLowerCase()
                );
              },
              async (value) => {
                const newProductTypes = await AddNewProductType(value);
                dispatch(updateFilters(newProductTypes.data.types));
              }
            )
          }
        >
          Add a new product type
        </Button>
      </Stack>

      <MaterialTable
        title={"Database management"}
        columns={[
          { title: "Key name", field: "standard_value", searchable: false },
          { title: "Label", field: "label" },
        ]}
        data={filters.map((filter) => {
          return {
            standard_value: filter.standard_value,
            label: filter.label,
          };
        })}
        options={{
          sorting: true,
          search: true,
          actionsColumnIndex: -1,
          pageSize: 10,
        }}
        actions={[
          //   {
          //     icon: "settings",
          //     tooltip: "Edit product",
          //     onClick: (event, rowData) => {
          //       productDialog(
          //         "Edit product",
          //         true,
          //         filters,
          //         rowData.standard_value,
          //         () => console.log("test")
          //       );
          //     },
          //   },
          {
            icon: "delete",
            tooltip: "Remove product",
            onClick: (event, rowData) => {
              confirmDialog("Do you really want to delete this?", () =>
                console.log("deleting product from table!")
              );
            },
          },
        ]}
      />
    </Stack>
  );
}
