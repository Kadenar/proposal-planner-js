import ProposalJobPricing from "./ProposalJobPricing";
import ProposalJobDocumentation from "./ProposalJobDocumentation";
import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Tabs from "@mui/base/Tabs";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { updateSelectedProposal } from "../../data-management/Reducers";
import { Stack } from "@mui/material";
import {
  StyledTabsList,
  StyledTab,
  StyledTabPanel,
  StyledBreadcrumb,
} from "../coreui/StyledComponents";

export default function ProposalTabs() {
  const selectedProposal = useSelector((state) => state.selectedProposal);
  const dispatch = useDispatch();

  // Handle navigating back to the main table of proposals
  function navigateBackToAllProposalsTable(event) {
    event.preventDefault();
    dispatch(updateSelectedProposal(null));
  }

  return (
    <div className="proposals">
      <Stack gap="20px" direction="row" width="100%">
        <Breadcrumbs aria-label="breadcrumb">
          <div onClick={navigateBackToAllProposalsTable}>
            <StyledBreadcrumb
              component="a"
              label="Home"
              icon={<HomeIcon fontSize="small" />}
              sx={{ cursor: "pointer" }}
            />
          </div>
          <StyledBreadcrumb component="a" label={selectedProposal.name} />
        </Breadcrumbs>
      </Stack>
      <Tabs defaultValue={0}>
        <StyledTabsList>
          <StyledTab value={0}>Costs</StyledTab>
          <StyledTab value={1}>Documentation</StyledTab>
        </StyledTabsList>
        <StyledTabPanel value={0}>
          <ProposalJobPricing />
        </StyledTabPanel>
        <StyledTabPanel value={1}>
          <ProposalJobDocumentation />
        </StyledTabPanel>
      </Tabs>
    </div>
  );
}
