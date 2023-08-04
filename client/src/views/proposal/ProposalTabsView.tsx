import { useAppDispatch, useAppSelector } from "../../services/store";
import { useKey } from "../../hooks/useKey";

import { Button, Stack } from "@mui/material";
import Tabs from "@mui/base/Tabs";

import {
  StyledTabsList,
  StyledTab,
  StyledTabPanel,
} from "../../components/StyledComponents";

import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";

import ProposalJobView from "./ProposalJobView";
import ProposalDocumentationView from "./ProposalDocumentationView";
import ProposalPdfDocumentView from "./ProposalPdfDocumentView";
import PricingWorkup from "../../components/proposal-ui/Table/PricingWorkup";

import { selectProposal } from "../../services/slices/activeProposalSlice";
import { confirmDialog } from "../../components/dialogs/ConfirmDialog";
import { saveProposal } from "../../services/slices/proposalsSlice";
import { ProposalObject } from "../../middleware/Interfaces";

export default function ProposalTabsView({
  activeProposal,
}: {
  activeProposal: ProposalObject;
}) {
  const dispatch = useAppDispatch();
  const { is_dirty } = useAppSelector((state) => state.activeProposal);

  useKey("ctrls", () => {
    saveProposal(dispatch, {
      guid: activeProposal.guid,
      fees: activeProposal.data.fees,
      labor: activeProposal.data.labor,
      products: activeProposal.data.products,
      unitCostTax: activeProposal.data.unitCostTax,
      quoteOptions: activeProposal.data.quote_options,
      start_date: activeProposal.data.start_date || "",
    });
  });

  return (
    <div className="proposals">
      <Stack direction="row" justifyContent="space-between" marginBottom={2}>
        <BreadcrumbNavigation
          initialBreadCrumbTitle="All proposals"
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
          breadcrumbName={activeProposal.name}
        />
        <Button
          variant="contained"
          onClick={async () =>
            saveProposal(dispatch, {
              guid: activeProposal.guid,
              fees: activeProposal.data.fees,
              labor: activeProposal.data.labor,
              products: activeProposal.data.products,
              unitCostTax: activeProposal.data.unitCostTax,
              quoteOptions: activeProposal.data.quote_options,
              start_date: activeProposal.data.start_date || "",
              target_quote: activeProposal.data.target_quote,
              target_commission: activeProposal.data.target_commission,
            })
          }
        >
          Save proposal
        </Button>
      </Stack>
      <Tabs defaultValue={0}>
        <StyledTabsList>
          <StyledTab value={0}>Job</StyledTab>
          <StyledTab value={1}>Pricing workup</StyledTab>
          <StyledTab value={2}>Documentation</StyledTab>
          <StyledTab value={3}>PDF</StyledTab>
        </StyledTabsList>
        <StyledTabPanel value={0}>
          <ProposalJobView activeProposal={activeProposal} />
        </StyledTabPanel>
        <StyledTabPanel value={1}>
          <PricingWorkup activeProposal={activeProposal} />
        </StyledTabPanel>
        <StyledTabPanel value={2}>
          <ProposalDocumentationView />
        </StyledTabPanel>
        <StyledTabPanel value={3}>
          <ProposalPdfDocumentView activeProposal={activeProposal} />
        </StyledTabPanel>
      </Tabs>
    </div>
  );
}
