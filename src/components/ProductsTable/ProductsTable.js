import React from "react";
import { useSelector } from "react-redux";
import MaterialTable from "material-table";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";

/**
 * Component used to display the set of products that have been selected for this particular job
 * @returns
 */
export default function ProductsTable() {
  // Grab our product data from the store
  const allProducts = useSelector((state) => state.allProducts);

  return (
    <Stack paddingTop={2} gap={2}>
      <div style={{ textAlign: "right" }}>
        <Button
          variant="contained"
          onClick={() => {
            // TODO
          }}
        >
          Add a new product
        </Button>
      </div>

      <MaterialTable
        title={"Available products"}
        columns={[
          { title: "Type", field: "type" },
          { title: "Model", field: "model" },
          { title: "Catalog #", field: "catalogNum" },
          {
            title: "Unit cost",
            field: "unitCost",
            type: "currency",
            searchable: false,
          },
        ]}
        data={allProducts.map((model) => {
          const modelNameSanitized = model?.name?.replace("_", " ") || " ";

          return {
            type:
              modelNameSanitized.charAt(0).toUpperCase() +
              modelNameSanitized.slice(1),
            model: model.label,
            catalogNum: model.catalog,
            unitCost: model.cost,
          };
        })}
        options={{ sorting: true, search: true, filtering: true, actionsColumnIndex: -1 }}
        actions={[
          {
            icon: "settings",
            tooltip: "Edit product",
            onClick: (event, rowData) => {
              // Do save operation
            },
          },
          {
            icon: "delete",
            tooltip: "Remove product",
            onClick: (event, rowData) => {
              // Do save operation
            },
          },
        ]}
      />
    </Stack>
  );
}
