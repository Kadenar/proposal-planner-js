import { useAppDispatch, useAppSelector } from "../../services/store";

import MaterialTable from "@material-table/core";
import Stack from "@mui/material/Stack";
import { confirmDialog } from "../../components/dialogs/ConfirmDialog";
import { productTypeDialog } from "../../components/dialogs/backend/ProductTypeDialog";

import AddNewItem from "../../components/AddNewItem";
import {
  addProductType,
  deleteProductType,
  editProductType,
} from "../../services/slices/productTypesSlice";

/**
 * Component used to display the set of products that have been selected for this particular job
 * @returns
 */
export default function AllProductTypesView() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.filters);

  return (
    <Stack gap={2}>
      <AddNewItem
        onClick={() =>
          productTypeDialog({
            header: "Add product type",
            productType: "",
            specifications: [],
            onSubmit: async (value, specifications) =>
              addProductType(dispatch, { label: value, specifications }),
          })
        }
      />

      <MaterialTable
        title={"Product types management"}
        columns={[
          { title: "Label", field: "label" },
          { title: "Key name", field: "guid", searchable: false },
        ]}
        data={filters.map((filter) => {
          return {
            id: filter.guid,
            label: filter.label,
            guid: filter.guid,
            specifications: filter.specifications,
          };
        })}
        options={{
          maxColumnSort: "all_columns",
          search: true,
          actionsColumnIndex: -1,
          pageSizeOptions: [5, 10, 15, 20],
          pageSize: 15,
        }}
        actions={[
          {
            icon: "edit",
            tooltip: "Edit type",
            onClick: (_, rowData) => {
              productTypeDialog({
                header: "Edit product type",
                productType: rowData.label,
                specifications: rowData.specifications,
                onSubmit: async (value, specifications) =>
                  editProductType(dispatch, {
                    guid: rowData.guid,
                    value,
                    specifications,
                  }),
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
                onSubmit: async () =>
                  deleteProductType(dispatch, { guid: rowData.guid }),
              });
            },
          },
        ]}
      />
    </Stack>
  );
}
