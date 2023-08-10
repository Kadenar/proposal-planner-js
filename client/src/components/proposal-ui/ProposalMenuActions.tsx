import {
  ClickAwayListener,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import { selectProposal } from "../../services/slices/activeProposalSlice";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { newProposalDialog } from "../dialogs/frontend/NewProposalDialog";
import {
  copyProposal,
  deleteProposal,
} from "../../services/slices/proposalsSlice";
import { confirmDialog } from "../dialogs/ConfirmDialog";
import { ClientObject, QuoteOption } from "../../middleware/Interfaces";
import { useNavigate } from "react-router-dom";
import { updateActiveClient } from "../../services/slices/clientsSlice";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import WorkIcon from "@mui/icons-material/Work";
import SellIcon from "@mui/icons-material/Sell";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import { newSoldJobDialog } from "../dialogs/frontend/NewSoldJobDialog";
import { addSoldJob } from "../../services/slices/soldJobsSlice";

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
  const { soldJobs } = useAppSelector((state) => state.soldJobs);

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

  const isJobSold = soldJobs.find(
    (job) => job.guid === menuItemInfo?.rowData?.guid
  );
  const doesProposalHaveQuoteOptions =
    menuItemInfo?.rowData?.data.quote_options.find(
      (quote: QuoteOption) => quote.hasProducts
    );
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
            {!isJobSold && doesProposalHaveQuoteOptions && (
              <MenuItem
                onClick={() => {
                  newSoldJobDialog({
                    proposal: menuItemInfo.rowData,
                    quote_option: menuItemInfo.rowData.data.target_quote || 0,
                    target_commission:
                      menuItemInfo.rowData.data.target_commission || 0,
                    onSubmit: async (job_price, commission) =>
                      addSoldJob(dispatch, {
                        proposal_name: menuItemInfo.rowData.name,
                        proposal_guid: menuItemInfo.rowData.guid,
                        job_price,
                        commission,
                      }),
                  });
                }}
              >
                <ListItemText>Mark job as sold</ListItemText>
                <ListItemIcon>
                  <SellIcon fontSize="small" />
                </ListItemIcon>
              </MenuItem>
            )}
            <MenuItem
              onClick={() => {
                newProposalDialog({
                  name: menuItemInfo.rowData.name,
                  description: `${menuItemInfo.rowData.description} copy`,
                  owner: { ...owner },
                  clients,
                  isExistingProposal: true,
                  onSubmit: async (name, description, client_guid) =>
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
