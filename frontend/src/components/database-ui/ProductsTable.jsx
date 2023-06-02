import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import MaterialTable from "@material-table/core";
import { Stack } from "@mui/material";
import { confirmDialog } from "../coreui/dialogs/ConfirmDialog";
import { productDialog } from "../coreui/dialogs/ProductDialog";
import {
  addNewProduct,
  editExistingProduct,
  deleteProduct,
  flattenProductData,
} from "../../data-management/InteractWithBackendData.ts";
import { updateProducts } from "../../data-management/Reducers";
import AddNewItem from "../coreui/AddNewItem";
import { updateStore } from "../../data-management/Dispatcher";

/**
 * Component used to display the set of products that have been selected for this particular job
 * @returns
 */
export default function ProductsTable() {
  const allProducts = useSelector((state) => state.allProducts);
  const filters = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  const flattenedProductData = useMemo(() => {
    return flattenProductData(allProducts);
  }, [allProducts]);

  return (
    <Stack gap={2}>
      <AddNewItem
        onClick={() =>
          productDialog({
            header: "Add product",
            guid: "",
            filters,
            selectedFilter: filters[0],
            modelName: "",
            catalogNum: "",
            unitCost: "",
            onSubmit: async (
              newFilter,
              newModelName,
              newCatalogNum,
              newUnitCost
            ) => {
              const result = await updateStore({
                dispatch,
                dbOperation: async () => {
                  addNewProduct(
                    newFilter,
                    newModelName,
                    newCatalogNum,
                    newUnitCost
                  );
                },
                methodToDispatch: updateProducts,
                dataKey: "products",
                successMessage: "Successfully added product.",
              });

              return result;
            },
          })
        }
      />

      <MaterialTable
        title={"Database management"}
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
        data={flattenedProductData.map((model) => {
          const modelNameSanitized =
            model?.category?.replaceAll("_", " ") || " ";

          return {
            key: model.category,
            type:
              modelNameSanitized.charAt(0).toUpperCase() +
              modelNameSanitized.slice(1),
            model: model.label,
            catalogNum: model.catalog,
            unitCost: model.cost,
            guid: model.guid,
          };
        })}
        options={{
          sorting: true,
          search: true,
          filtering: true,
          actionsColumnIndex: -1,
          pageSize: 10,
        }}
        actions={[
          {
            icon: "settings",
            tooltip: "Edit product",
            onClick: (event, rowData) => {
              productDialog({
                header: "Edit product",
                guid: rowData.guid,
                filters,
                selectedFilter: {
                  label: rowData.type,
                  guid: rowData.key,
                },
                modelName: rowData.model,
                catalogNum: rowData.catalogNum,
                unitCost: rowData.unitCost,
                onSubmit: async (
                  newModelName,
                  newCatalogNum,
                  newUnitCost,
                  image
                ) => {
                  return updateStore({
                    dispatch,
                    dbOperation: async () => {
                      editExistingProduct(
                        rowData.guid,
                        rowData.key,
                        newModelName,
                        newCatalogNum,
                        newUnitCost,
                        image
                      );
                    },
                    methodToDispatch: updateProducts,
                    dataKey: "products",
                    successMessage: `Successfully updated ${rowData.model}`,
                  });
                },
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
                onSubmit: async () => {
                  return updateStore({
                    dispatch,
                    dbOperation: async () => {
                      deleteProduct({
                        guid: rowData.guid,
                        filter: rowData.key,
                      });
                    },
                    methodToDispatch: updateProducts,
                    dataKey: "products",
                    successMessage: `Successfully deleted ${rowData.model}`,
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
