import { useAppDispatch, useAppSelector } from "../../services/store";
import { useKey } from "../../hooks/useKey";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import SaveIcon from "@mui/icons-material/Save";
import Tabs from "@mui/base/Tabs";

import {
  StyledTabsList,
  StyledTab,
  StyledTabPanel,
} from "../../components/StyledComponents";

import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";

import ProposalJobView from "../proposal/ProposalJobView";
import ProposalDocumentationView from "../proposal/ProposalDocumentationView";

import { confirmDialog } from "../../components/dialogs/ConfirmDialog";
import { saveTemplate } from "../../services/slices/templatesSlice";
import { ProposalObject } from "../../middleware/Interfaces";
import { selectProposal } from "../../services/slices/activeProposalSlice";

export default function TemplateTabsView({
  activeTemplate,
}: {
  activeTemplate: ProposalObject;
}) {
  const dispatch = useAppDispatch();
  const { is_dirty } = useAppSelector((state) => state.activeProposal);

  useKey("ctrls", () => {
    saveTemplate(dispatch, activeTemplate);
  });

  return (
    <div className="proposals">
      <Stack direction="row" justifyContent="space-between" marginBottom={2}>
        <BreadcrumbNavigation
          initialBreadCrumbTitle="All templates"
          navigateBackFunc={() => {
            if (is_dirty) {
              confirmDialog({
                message: "You have unsaved changes",
                onSubmit: async () => {
                  selectProposal(dispatch, undefined);
                  return true;
                },
              });
            } else {
              selectProposal(dispatch, undefined);
            }
          }}
          breadcrumbName={activeTemplate.name}
        />
        <Button
          variant="contained"
          onClick={async () => saveTemplate(dispatch, activeTemplate)}
          sx={{ gap: 1 }}
        >
          <SaveIcon />
          Save template
        </Button>
      </Stack>
      <Tabs defaultValue={0}>
        <StyledTabsList>
          <StyledTab value={0}>Job</StyledTab>
          <StyledTab value={1}>Documentation</StyledTab>
        </StyledTabsList>
        <StyledTabPanel value={0}>
          <ProposalJobView activeProposal={activeTemplate} />
        </StyledTabPanel>
        <StyledTabPanel value={1}>
          <ProposalDocumentationView />
        </StyledTabPanel>
      </Tabs>
    </div>
  );
}
