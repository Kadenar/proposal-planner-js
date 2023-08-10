import { useState } from "react";

import MaterialTable from "@material-table/core";
import { Stack } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { selectProposal } from "../../services/slices/activeProposalSlice";

import { confirmDialog } from "../../components/dialogs/ConfirmDialog";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { newTemplateDialog } from "../../components/dialogs/frontend/NewTemplateDialog";
import {
  copyTemplate,
  deleteTemplate,
} from "../../services/slices/templatesSlice";

export default function AllTemplatesView() {
  const dispatch = useAppDispatch();
  const { templates } = useAppSelector((state) => state.templates);

  const [menuItemInfo, setMenuItemInfo] = useState<{
    anchorEl: HTMLAnchorElement | undefined;
    rowData: any;
  }>({
    anchorEl: undefined,
    rowData: undefined,
  });
  const open = Boolean(menuItemInfo.anchorEl);

  return (
    <Stack padding={2} gap={2}>
      <MaterialTable
        title=""
        columns={[
          { title: "Name", field: "name" },
          { title: "Description", field: "description" },
          { title: "Date created", field: "date_created" },
          { title: "Date modified", field: "date_modified" },
        ]}
        data={templates.map((template) => {
          return {
            id: template.guid, // needed for material table dev tools warning
            name: template.name,
            description: template.description,
            date_created: template.date_created,
            date_modified: template.date_modified,
            guid: template.guid,
            data: template.data,
          };
        })}
        options={{
          pageSizeOptions: [5, 10, 15, 20],
          pageSize: 15,
          actionsColumnIndex: -1,
          headerStyle: {
            paddingRight: 15,
          },
        }}
        actions={[
          {
            icon: "pending",
            tooltip: "Actions",
            onClick: (event, rowData) =>
              setMenuItemInfo({
                anchorEl: event.currentTarget,
                rowData,
              }),
          },
        ]}
      />
      <Menu
        anchorEl={menuItemInfo?.anchorEl}
        open={open}
        onClose={() =>
          setMenuItemInfo({
            anchorEl: undefined,
            rowData: undefined,
          })
        }
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={(e) => {
            selectProposal(dispatch, menuItemInfo.rowData);
          }}
        >
          Work on template
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            setMenuItemInfo({
              ...menuItemInfo,
              anchorEl: undefined,
            });

            if (!menuItemInfo.rowData) {
              return;
            }

            newTemplateDialog({
              name: menuItemInfo.rowData.name,
              description: `${menuItemInfo.rowData.description} copy`,
              isExistingTemplate: true,
              onSubmit: (name, description) =>
                copyTemplate(dispatch, {
                  name,
                  description,
                  existing_template: menuItemInfo.rowData,
                }),
            });
          }}
        >
          Copy template
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            setMenuItemInfo({
              ...menuItemInfo,
              anchorEl: undefined,
            });

            confirmDialog({
              message:
                "Do you really want to delete this? This action cannot be undone.",
              onSubmit: async () =>
                deleteTemplate(dispatch, { guid: menuItemInfo.rowData.guid }),
            });
          }}
        >
          Delete template
        </MenuItem>
      </Menu>
    </Stack>
  );
}
