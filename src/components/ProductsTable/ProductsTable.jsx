import React from "react";
import { useSelector, useDispatch } from "react-redux";
import MaterialTable from "material-table";
import { Stack } from "@mui/material";
import Button from "@mui/material/Button";
import { confirmDialog } from "../coreui/dialogs/ConfirmDialog";
import { productDialog } from "../coreui/dialogs/EditProductDialog2";
import {
  PushNewProduct,
  EditExistingProduct,
  flattenProductData,
} from "../../data-management/InteractWithBackendData";
import { updateProducts } from "../../data-management/Reducers";

/**
 * Component used to display the set of products that have been selected for this particular job
 * @returns
 */
export default function ProductsTable() {
  const allProducts = useSelector((state) => state.allProducts);
  const filters = useSelector((state) => state.filters);
  const dispatch = useDispatch();

  async function addOrEditProductToDatabase(
    guid,
    selectedFilter,
    modelName,
    catalogNum,
    unitCost
  ) {
    let response = {};
    if (guid !== "") {
      console.log("editing existing product");

      response = await EditExistingProduct({
        guid,
        selectedFilter,
        modelName,
        catalogNum,
        unitCost,
      });
    } else {
      console.log("pushing new product");
      response = await PushNewProduct({
        selectedFilter,
        modelName,
        catalogNum,
        unitCost,
      });
    }

    const flattenedProductData = flattenProductData(response.data.products);
    dispatch(updateProducts(flattenedProductData));
  }

  return (
    <Stack padding={2} gap={2}>
      <Stack spacing={1} direction="row" justifyContent="flex-end">
        {/* <Button variant="contained" onClick={async () => AddGUIDs()}>
          Generate GUIDS
        </Button> */}
        <Button
          variant="contained"
          onClick={() =>
            productDialog({
              header: "Add product",
              guid: "",
              filters,
              selectedFilter: filters[0],
              modelName: "",
              catalogNum: "",
              unitCost: "",
              onSubmit: addOrEditProductToDatabase,
              validate: validateProductData,
            })
          }
        >
          Add a new product
        </Button>
      </Stack>

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
        data={allProducts.map((model) => {
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
                selectedFilter: rowData.type,
                modelName: rowData.model,
                catalogNum: rowData.catalogNum,
                unitCost: rowData.unitCost,
                onSubmit: addOrEditProductToDatabase,
                validate: validateProductData,
              });
            },
          },
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

function validateProductData(modelName, catalogNum, unitCost) {
  if (modelName === "") {
    return false;
  }

  if (catalogNum === "") {
    return false;
  }

  if (!unitCost || unitCost === "" || unitCost <= 0) {
    return false;
  }

  return true;
}
