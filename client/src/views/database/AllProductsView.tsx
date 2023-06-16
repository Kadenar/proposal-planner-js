import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../services/store.ts";

import {
  editProduct,
  deleteProduct,
  addProduct,
} from "../../services/slices/productsSlice.ts";
import { flattenProductData } from "../../middleware/productHelpers.ts";

import MaterialTable from "@material-table/core";
import { Stack } from "@mui/material";
import { confirmDialog } from "../../components/dialogs/ConfirmDialog.tsx";
import { productDialog } from "../../components/dialogs/backend/ProductDialog.tsx";
import AddNewItem from "../../components/AddNewItem.tsx";

/**
 * Component used to display the set of products that have been selected for this particular job
 * @returns
 */
export default function AllProductsView() {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);
  const { filters } = useAppSelector((state) => state.filters);

  const flattenedProductData = useMemo(() => {
    return flattenProductData(products);
  }, [products]);

  return (
    <Stack gap={2}>
      <AddNewItem
        onClick={() =>
          productDialog({
            header: "Add product",
            filters,
            filter: filters[0],
            modelName: "",
            modelNum: "",
            description: "",
            cost: 0,
            onSubmit: async (filter, modelName, modelNum, description, cost) =>
              addProduct(dispatch, {
                filter,
                modelName,
                modelNum,
                description,
                cost,
              }),
          })
        }
      />

      <MaterialTable
        title={"Products management"}
        columns={[
          { title: "Type", field: "productLabel", width: "250px" },
          { title: "Model name", field: "model" },
          {
            title: "Model #",
            field: "modelNum",
            width: "300px",
          },
          {
            title: "Description",
            field: "description",
            width: "700px",
          },
          {
            title: "Unit cost",
            field: "cost",
            type: "currency",
            searchable: false,
            width: "300px",
          },
        ]}
        data={flattenedProductData.map((model) => {
          const modelNameSanitized =
            model?.category?.replaceAll("_", " ") || " ";

          return {
            id: model.guid,
            productCategory: model.category,
            productLabel:
              modelNameSanitized.charAt(0).toUpperCase() +
              modelNameSanitized.slice(1),
            model: model.model,
            modelNum: model.modelNum,
            description: model.description,
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
              // Keeping typescript happy
              if (!rowData || rowData instanceof Array) {
                return;
              }

              productDialog({
                header: "Edit product",
                filters,
                filter: {
                  label: rowData.productLabel,
                  guid: rowData.productCategory,
                },
                modelName: rowData.model,
                modelNum: rowData.modelNum,
                description: rowData.description,
                cost: rowData.cost,
                onSubmit: async (
                  selectedFilter,
                  modelName,
                  modelNum,
                  description,
                  cost
                ) =>
                  editProduct(dispatch, {
                    guid: rowData.guid,
                    existing_filter_guid: rowData.productCategory,
                    new_filter_guid: selectedFilter?.guid,
                    modelName,
                    modelNum,
                    description,
                    cost,
                    image: undefined,
                  }),
              });
            },
          },

          {
            icon: "delete",
            tooltip: "Remove product",
            onClick: (_, rowData) => {
              // Keeping typescript happy
              if (!rowData || rowData instanceof Array) {
                return;
              }

              confirmDialog({
                message:
                  "Do you really want to delete this? This action cannot be undone.",
                onSubmit: async () =>
                  deleteProduct(dispatch, {
                    guid: rowData.guid,
                    filter_guid: rowData.productCategory,
                  }),
              });
            },
          },
        ]}
      />
    </Stack>
  );
}
