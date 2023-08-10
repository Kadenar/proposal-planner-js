import {
  ClickAwayListener,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import { selectProposal } from "../../services/slices/activeProposalSlice";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { newProposalDialog } from "../../components/dialogs/frontend/NewProposalDialog";
import {
  copyProposal,
  deleteProposal,
} from "../../services/slices/proposalsSlice";
import { confirmDialog } from "../../components/dialogs/ConfirmDialog";
import { ClientObject } from "../../middleware/Interfaces";
import { useNavigate } from "react-router-dom";
import { updateActiveClient } from "../../services/slices/clientsSlice";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import WorkIcon from "@mui/icons-material/Work";
import SellIcon from "@mui/icons-material/Sell";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";

interface MenuItemInfo {
  anchorEl: HTMLAnchorElement | undefined;
  rowData: any;
}
export const ProposalMenuActions = ({
  owner,
  menuItemInfo,
  setMenuItemInfo,
  open,
}: {
  owner: ClientObject;
  menuItemInfo: MenuItemInfo;
  setMenuItemInfo: (info: MenuItemInfo) => void;
  open: boolean;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { clients } = useAppSelector((state) => state.clients);

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
          <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown}>
            <MenuItem
              onClick={() => {
                updateActiveClient(dispatch, undefined);
                selectProposal(dispatch, menuItemInfo.rowData);
                navigate("/proposals");
              }}
            >
              <ListItemText> Work on proposal</ListItemText>
              <ListItemIcon>
                <WorkIcon fontSize="small" />
              </ListItemIcon>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => {}}>
              <ListItemText>Mark job as sold</ListItemText>
              <ListItemIcon>
                <SellIcon fontSize="small" />
              </ListItemIcon>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setMenuItemInfo({
                  ...menuItemInfo,
                  anchorEl: undefined,
                });

                if (!menuItemInfo.rowData) {
                  return;
                }

                newProposalDialog({
                  name: menuItemInfo.rowData.name,
                  description: `${menuItemInfo.rowData.description} copy`,
                  owner: { ...owner },
                  clients,
                  isExistingProposal: true,
                  onSubmit: (name, description, client_guid) =>
                    copyProposal(dispatch, {
                      name,
                      description,
                      client_guid,
                      existing_proposal: menuItemInfo.rowData,
                    }),
                });
              }}
            >
              <ListItemText>Copy proposal</ListItemText>
              <ListItemIcon>
                <ContentPasteGoIcon fontSize="small" />
              </ListItemIcon>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setMenuItemInfo({
                  ...menuItemInfo,
                  anchorEl: undefined,
                });

                confirmDialog({
                  message:
                    "Do you really want to delete this? This action cannot be undone.",
                  onSubmit: async () =>
                    deleteProposal(dispatch, {
                      guid: menuItemInfo.rowData.guid,
                    }),
                });
              }}
            >
              <ListItemText>Delete proposal</ListItemText>
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
