import MaterialTable from "@material-table/core";
import { useAppDispatch, useAppSelector } from "../services/store";
import { Stack } from "@mui/material";
import { confirmDialog } from "../components/dialogs/ConfirmDialog";
import { deleteContact, editContact } from "../services/slices/contactsSlice";
import { contactDialog } from "../components/dialogs/frontend/ContactDialog";

const ContactsView = () => {
  const dispatch = useAppDispatch();
  const { contacts } = useAppSelector((state) => state.contacts);

  return (
    <Stack padding={2} gap={2}>
      <MaterialTable
        title=""
        columns={[
          { title: "Name", field: "name" },
          { title: "Email", field: "email" },
          { title: "Phone #", field: "phone" },
        ]}
        data={contacts.map((contact) => {
          return {
            id: contact.guid, // needed for material table dev tools warning
            guid: contact.guid,
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
          };
        })}
        options={{
          pageSizeOptions: [5, 10, 15, 20],
          pageSize: 15,
          actionsColumnIndex: -1,
        }}
        actions={[
          {
            icon: "edit",
            tooltip: "View contact",
            onClick: (_, rowData) => {
              // Keeping typescript happy
              if (!rowData || rowData instanceof Array) {
                return;
              }

              contactDialog({
                header: "Edit contact",
                name: rowData.name,
                email: rowData.email,
                phone: rowData.phone,
                onSubmit: async (name, email, phone) =>
                  editContact(dispatch, {
                    guid: rowData.guid,
                    name,
                    email,
                    phone,
                  }),
              });
            },
          },
          {
            icon: "delete",
            tooltip: "Delete contact",
            onClick: (_, rowData) => {
              // Keeping typescript happy
              if (!rowData || rowData instanceof Array) {
                return;
              }

              confirmDialog({
                message:
                  "Are you sure? This action cannot be undone. Upon deleting a client, ALL proposals belonging to that client will also be deleted.",
                onSubmit: async () => {
                  return deleteContact(dispatch, {
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
};

export default ContactsView;
