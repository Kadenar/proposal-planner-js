import { useAppDispatch, useAppSelector } from "../../services/store";

import MaterialTable from "@material-table/core";
import Stack from "@mui/material/Stack";
import { confirmDialog } from "../../components/dialogs/ConfirmDialog";

import AddNewItem from "../../components/AddNewItem";

import {
  addFinancingOption,
  deleteFinancingOption,
  editFinancingOption,
} from "../../services/slices/financingSlice";
import { financingDialog } from "../../components/dialogs/backend/FinancingDialog";

export default function FinancingOptionsView() {
  const dispatch = useAppDispatch();
  const { financing } = useAppSelector((state) => state.financing);

  return (
    <Stack gap={1}>
      <AddNewItem
        onClick={() =>
          financingDialog({
            header: "Add financing option",
            name: "",
            interest: 0,
            term_length: 0,
            term_type: "months",
            provider: "",
            onSubmit: async (
              name,
              interest,
              term_length,
              term_type,
              provider
            ) =>
              addFinancingOption(dispatch, {
                name,
                interest,
                term_length,
                term_type,
                provider,
              }),
          })
        }
      />

      <MaterialTable
        title="Financing options"
        columns={[
          { title: "Name", field: "name" },
          { title: "Interest", field: "interest" },
          { title: "Term length", field: "term_length" },
          { title: "Term type", field: "term_type" },
          { title: "Provider", field: "provider" },
        ]}
        data={financing.map((option) => {
          return {
            id: option.guid,
            guid: option.guid,
            name: option.name,
            interest: option.interest,
            term_length: option.term_length,
            term_type: option.term_type,
            provider: option.provider,
          };
        })}
        options={{
          maxColumnSort: "all_columns",
          search: true,
          actionsColumnIndex: -1,
          pageSizeOptions: [5, 10, 15, 20],
          pageSize: 10,
        }}
        actions={[
          {
            icon: "edit",
            tooltip: "Edit financing",
            onClick: (_, rowData) => {
              // Keeping typescript happy
              if (!rowData || rowData instanceof Array) {
                return false;
              }

              financingDialog({
                header: "Edit financing option",
                name: rowData.name,
                interest: rowData.interest,
                term_length: rowData.term_length,
                term_type: rowData.term_type,
                provider: rowData.provider,
                onSubmit: async (
                  name,
                  interest,
                  term_length,
                  term_type,
                  provider
                ) =>
                  editFinancingOption(dispatch, {
                    guid: rowData.guid,
                    name,
                    interest,
                    term_length,
                    term_type,
                    provider,
                  }),
              });
            },
          },
          {
            icon: "delete",
            tooltip: "Remove option",
            onClick: (event, rowData) => {
              confirmDialog({
                message:
                  "Do you really want to delete this? This action cannot be undone.",
                onSubmit: async () => {
                  // Keeping typescript happy
                  if (!rowData || rowData instanceof Array) {
                    return false;
                  }

                  return deleteFinancingOption(dispatch, {
                    guid: rowData.guid,
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
