import ProposalDefinition from "../Proposals/ProposalDefinition";
import DocumentationDefinition from "./DocumentationDefinition";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { emphasize, styled } from "@mui/material/styles";
import Tabs from "@mui/base/Tabs";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Chip from "@mui/material/Chip";
import HomeIcon from "@mui/icons-material/Home";
import { updateSelectedProposal } from "../../data-management/Reducers";
import { Stack } from "@mui/material";
import {
  StyledTabsList,
  StyledTab,
  StyledTabPanel,
} from "../coreui/StyledTabs";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    marginBottom: "15px",
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

export default function ProposalDefinitionWrapper() {
  const selectedProposal = useSelector((state) => state.selectedProposal);
  const dispatch = useDispatch();

  // Handle navigating back to the main table of proposals
  function navigateBackToAllProposalsTable(event) {
    event.preventDefault();
    dispatch(updateSelectedProposal(""));
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
          <StyledBreadcrumb component="a" label={selectedProposal} />
        </Breadcrumbs>
      </Stack>
      <Tabs defaultValue={0}>
        <StyledTabsList>
          <StyledTab value={0}>Costs</StyledTab>
          <StyledTab value={1}>Documentation</StyledTab>
        </StyledTabsList>
        <StyledTabPanel value={0}>
          <ProposalDefinition />
        </StyledTabPanel>
        <StyledTabPanel value={1}>
          <DocumentationDefinition />
        </StyledTabPanel>
      </Tabs>
    </div>
  );
}
