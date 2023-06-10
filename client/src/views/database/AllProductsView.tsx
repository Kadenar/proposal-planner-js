import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  editProduct,
  deleteProduct,
  addProduct,
} from "../../data-management/store/slices/productsSlice.ts";
import { flattenProductData } from "../../data-management/middleware/productHelpers.ts";

import MaterialTable from "@material-table/core";
import { Stack } from "@mui/material";
import { confirmDialog } from "../../components/coreui/dialogs/ConfirmDialog.tsx";
import { productDialog } from "../../components/coreui/dialogs/backend/ProductDialog.tsx";
import AddNewItem from "../../components/coreui/AddNewItem.tsx";
import { ReduxStore } from "../../data-management/middleware/Interfaces.ts";

/**
 * Component used to display the set of products that have been selected for this particular job
 * @returns
 */
export default function AllProductsView() {
  const dispatch = useDispatch();
  const { products } = useSelector((state: ReduxStore) => state.products);
  const { filters } = useSelector((state: ReduxStore) => state.filters);

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
            modelNum: "",
            cost: 0,
            onSubmit: async ({ filter, modelName, modelNum, cost }) =>
              addProduct(dispatch, { filter, modelName, modelNum, cost }),
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
            field: "modelNum",
          },
          {
            title: "Unit cost",
            field: "cost",
            type: "currency",
            searchable: false,
          },
        ]}
        data={flattenedProductData.map((model) => {
          const modelNameSanitized =
            model?.category?.replaceAll("_", " ") || " ";

          return {
            id: model.guid,
            filter_guid: model.modelNum,
            filter_label:
              modelNameSanitized.charAt(0).toUpperCase() +
              modelNameSanitized.slice(1),
            model: model.label,
            modelNum: model.modelNum,
            cost: model.cost,
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
            onClick: (_, rowData) => {
              productDialog({
                header: "Edit product",
                guid: rowData.guid,
                filters,
                filter: {
                  label: rowData.filter_label, // TODO Figure out why typescript is mad
                  guid: rowData.filter_guid,
                },
                modelName: rowData.model,
                modelNum: rowData.modelNum,
                cost: rowData.cost,
                onSubmit: async ({
                  modelName: newModelName,
                  modelNum: newModelNum,
                  cost: newCost,
                  image,
                }) =>
                  editProduct(dispatch, {
                    guid: rowData.guid,
                    filter_guid: rowData.filter_guid,
                    modelName: newModelName,
                    modelNum: newModelNum,
                    cost: newCost,
                    image,
                  }),
              });
            },
          },

          {
            icon: "delete",
            tooltip: "Remove product",
            onClick: (_, rowData) => {
              confirmDialog({
                message:
                  "Do you really want to delete this? This action cannot be undone.",
                onSubmit: async () =>
                  deleteProduct(dispatch, {
                    guid: rowData.guid,
                    filter_guid: rowData.filter_guid,
                  }),
              });
            },
          },
        ]}
      />
    </Stack>
  );
}
