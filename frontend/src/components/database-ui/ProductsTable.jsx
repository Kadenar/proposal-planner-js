import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  editProduct,
  deleteProduct,
  addProduct,
} from "../../data-management/store/slices/productsSlice.js";
import { flattenProductData } from "../../data-management/backend-helpers/productHelpers.ts";

import MaterialTable from "@material-table/core";
import { Stack } from "@mui/material";
import { confirmDialog } from "../coreui/dialogs/ConfirmDialog";
import { productDialog } from "../coreui/dialogs/backend/ProductDialog.jsx";
import AddNewItem from "../coreui/AddNewItem";

/**
 * Component used to display the set of products that have been selected for this particular job
 * @returns
 */
export default function ProductsTable() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { filters } = useSelector((state) => state.filters);

  const flattenedProductData = useMemo(() => {
    return flattenProductData(products);
  }, [products]);

  return (
    <Stack gap={2}>
      <AddNewItem
        onClick={() =>
          productDialog({
            header: "Add product",
            guid: "",
            filters,
            filter: filters[0],
            modelName: "",
            catalogNum: "",
            unitCost: "",
            onSubmit: async ({ filter, modelName, catalogNum, unitCost }) =>
              addProduct(dispatch, { filter, modelName, catalogNum, unitCost }),
          })
        }
      />

      <MaterialTable
        title={"Products management"}
        columns={[
          { title: "Type", field: "filter_label" },
          { title: "Model name", field: "model" },
          {
            title: "Model #",
            field: "catalogNum",
          },
          {
            title: "Unit cost",
            field: "unitCost",
            type: "currency",
            searchable: false,
          },
        ]}
        data={flattenedProductData.map((model) => {
          const modelNameSanitized =
            model?.category?.replaceAll("_", " ") || " ";

          return {
            id: model.guid,
            filter_guid: model.category,
            filter_label:
              modelNameSanitized.charAt(0).toUpperCase() +
              modelNameSanitized.slice(1),
            model: model.label,
            catalogNum: model.catalog,
            unitCost: model.cost,
            guid: model.guid,
          };
        })}
        options={{
          maxColumnSort: "all_columns",
          search: true,
          filtering: true,
          actionsColumnIndex: -1,
          pageSize: 10,
        }}
        actions={[
          {
            icon: "edit",
            tooltip: "Edit product",
            onClick: (event, rowData) => {
              productDialog({
                header: "Edit product",
                guid: rowData.guid,
                filters,
                filter: {
                  label: rowData.filter_label,
                  guid: rowData.filter_guid,
                },
                modelName: rowData.model,
                catalogNum: rowData.catalogNum,
                unitCost: rowData.unitCost,
                onSubmit: async ({
                  modelName: newModelName,
                  catalogNum: newCatalogNum,
                  unitCost: newUnitCost,
                  image,
                }) =>
                  editProduct(dispatch, {
                    guid: rowData.guid,
                    filter_guid: rowData.filter_guid,
                    modelName: newModelName,
                    catalogNum: newCatalogNum,
                    unitCost: newUnitCost,
                    image,
                  }),
              });
            },
          },

          {
            icon: "delete",
            tooltip: "Remove product",
            onClick: (event, rowData) => {
              confirmDialog({
                message:
                  "Do you really want to delete this? This action cannot be undone.",
                onSubmit: async () =>
                  deleteProduct(dispatch, {
                    guid: rowData.guid,
                    filter: rowData.filter_guid,
                  }),
              });
            },
          },
        ]}
      />
    </Stack>
  );
}
