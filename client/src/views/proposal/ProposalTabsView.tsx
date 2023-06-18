import { useAppDispatch, useAppSelector } from "../../services/store";
import { useKey } from "../../hooks/useKey";

import Tabs from "@mui/base/Tabs";

import {
  StyledTabsList,
  StyledTab,
  StyledTabPanel,
} from "../../components/StyledComponents";

import ProposalPricingView from "./ProposalPricingView";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";

import { selectProposal } from "../../services/slices/activeProposalSlice";
import { confirmDialog } from "../../components/dialogs/ConfirmDialog";
import { saveProposal } from "../../services/slices/proposalsSlice";
import { ProposalObject } from "../../middleware/Interfaces";
import ProposalDocumentationView from "./ProposalDocumentationView";
import ProposalPdfDocumentView from "./ProposalPdfDocumentView";
import { Button, Stack } from "@mui/material";

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
      commission: activeProposal.data.commission,
      fees: activeProposal.data.fees,
      labor: activeProposal.data.labor,
      products: activeProposal.data.products,
      unitCostTax: activeProposal.data.unitCostTax,
      multiplier: activeProposal.data.multiplier,
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
              commission: activeProposal.data.commission,
              fees: activeProposal.data.fees,
              labor: activeProposal.data.labor,
              products: activeProposal.data.products,
              unitCostTax: activeProposal.data.unitCostTax,
              multiplier: activeProposal.data.multiplier,
              quoteOptions: activeProposal.data.quote_options,
              start_date: activeProposal.data.start_date || "",
            })
          }
        >
          Save proposal
        </Button>
      </Stack>
      <Tabs defaultValue={0}>
        <StyledTabsList>
          <StyledTab value={0}>Costs</StyledTab>
          <StyledTab value={1}>Documentation</StyledTab>
          <StyledTab value={2}>PDF</StyledTab>
        </StyledTabsList>
        <StyledTabPanel value={0}>
          <ProposalPricingView activeProposal={activeProposal} />
        </StyledTabPanel>
        <StyledTabPanel value={1}>
          <ProposalDocumentationView />
        </StyledTabPanel>
        <StyledTabPanel value={2}>
          <ProposalPdfDocumentView activeProposal={activeProposal} />
        </StyledTabPanel>
      </Tabs>
    </div>
  );
}
