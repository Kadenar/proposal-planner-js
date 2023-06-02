import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { updateSelectedClient } from "../../data-management/Reducers";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import { Stack } from "@mui/material";
import Tabs from "@mui/base/Tabs";
import {
  StyledTabsList,
  StyledTab,
  StyledTabPanel,
  StyledBreadcrumb,
} from "../coreui/StyledComponents";
import ClientProposalsView from "./ClientProposalsView";
import ClientAddressView from "./ClientAddressView";

export default function ClientTabsView() {
  const dispatch = useDispatch();

  const selectedClient = useSelector((state) => state.selectedClient);

  // Handle navigating back to the main table of proposals
  function navigateBackToAllClients(event) {
    event.preventDefault();
    dispatch(updateSelectedClient(null));
  }

  return (
    <div className="proposals">
      <Stack gap="20px" direction="row" width="100%">
        <Breadcrumbs aria-label="breadcrumb">
          <div onClick={navigateBackToAllClients}>
            <StyledBreadcrumb
              component="a"
              label="All Clients"
              icon={<EmojiPeopleIcon fontSize="small" />}
              sx={{ cursor: "pointer" }}
            />
          </div>
          <StyledBreadcrumb component="a" label={selectedClient.name} />
        </Breadcrumbs>
      </Stack>
      <Tabs defaultValue={0}>
        <StyledTabsList>
          <StyledTab value={0}>Address</StyledTab>
          <StyledTab value={1}>Proposals</StyledTab>
          <StyledTab value={2}>Jobs</StyledTab>
        </StyledTabsList>
        <StyledTabPanel value={0}>
          <ClientAddressView />
        </StyledTabPanel>
        <StyledTabPanel value={1}>
          <ClientProposalsView />
        </StyledTabPanel>
        <StyledTabPanel value={2}>
          <>Jobs will go here</>
        </StyledTabPanel>
      </Tabs>
    </div>
  );
}
