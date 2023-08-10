import { useAppDispatch } from "../services/store";

import {
  ClickAwayListener,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import { confirmDialog } from "./dialogs/ConfirmDialog";
import { deleteSoldJob, saveJob } from "../services/slices/soldJobsSlice";

import WorkIcon from "@mui/icons-material/Work";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { editSoldJobDialog } from "./dialogs/frontend/EditSoldJobDialog";

interface MenuItemInfo {
  anchorEl: HTMLAnchorElement | undefined;
  rowData: any;
}

export const SoldJobMenuActions = ({
  menuItemInfo,
  setMenuItemInfo,
  open,
}: {
  menuItemInfo: MenuItemInfo;
  setMenuItemInfo: (info: MenuItemInfo) => void;
  open: boolean;
}) => {
  const dispatch = useAppDispatch();

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setMenuItemInfo({
        anchorEl: undefined,
        rowData: undefined,
      });
    } else if (event.key === "Escape") {
      setMenuItemInfo({
        anchorEl: undefined,
        rowData: undefined,
      });
    }
  }

  return (
    <Popper
      anchorEl={menuItemInfo?.anchorEl}
      open={open}
      placement="bottom-start"
      disablePortal
    >
      <Paper sx={{ width: 215, maxWidth: "100%" }}>
        <ClickAwayListener
          onClickAway={() =>
            setMenuItemInfo({
              anchorEl: undefined,
              rowData: undefined,
            })
          }
        >
          <MenuList
            autoFocusItem={open}
            onClick={() => {
              setMenuItemInfo({
                ...menuItemInfo,
                anchorEl: undefined,
              });
            }}
            onKeyDown={handleListKeyDown}
          >
            <MenuItem
              onClick={() => {
                editSoldJobDialog({
                  commissionReceived:
                    menuItemInfo.rowData.data.commission_received === "Yes",
                  jobCompleted: menuItemInfo.rowData.data.date_completed !== "",
                  onSubmit: async (completed, commissionReceived) =>
                    saveJob(
                      dispatch,
                      menuItemInfo.rowData.guid,
                      completed,
                      commissionReceived
                    ),
                });
              }}
            >
              <ListItemText> Edit job</ListItemText>
              <ListItemIcon>
                <WorkIcon fontSize="small" />
              </ListItemIcon>
            </MenuItem>

            <MenuItem
              onClick={() => {
                confirmDialog({
                  message:
                    "Do you really want to delete this? This action cannot be undone.",
                  onSubmit: async () =>
                    deleteSoldJob(dispatch, {
                      guid: menuItemInfo.rowData.guid,
                    }),
                });
              }}
            >
              <ListItemText>Delete job</ListItemText>
              <ListItemIcon>
                <DeleteForeverIcon fontSize="small" />
              </ListItemIcon>
            </MenuItem>
          </MenuList>
        </ClickAwayListener>
      </Paper>
    </Popper>
  );
};
