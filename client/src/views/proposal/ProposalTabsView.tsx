import { useMemo } from "react";

import Tabs from "@mui/base/Tabs";

import {
  StyledTabsList,
  StyledTab,
  StyledTabPanel,
} from "../../components/coreui/StyledComponents";

import ProposalPricingView from "./ProposalPricingView";
import ClientCardDetails from "../../components/proposal-ui/documentation/ClientCardDetails";
import { PdfDocument } from "../../components/proposal-ui/documentation/pdf/PdfDocument";
import BreadcrumbNavigation from "../../components/coreui/BreadcrumbNavigation";
import ProposalCardDetails from "../../components/proposal-ui/documentation/ProposalCardDetails";

import { selectProposal } from "../../data-management/store/slices/activeProposalSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../data-management/store/store";
import { confirmDialog } from "../../components/coreui/dialogs/ConfirmDialog";
import { saveProposal } from "../../data-management/store/slices/proposalsSlice";
import { useKey } from "../../hooks/useKey";

export default function ProposalTabsView() {
  const dispatch = useAppDispatch();
  const { clients } = useAppSelector((state) => state.clients);
  const { activeProposal, is_dirty } = useAppSelector(
    (state) => state.activeProposal
  );

  useKey("ctrls", () => {
    if (!activeProposal) {
      return;
    }
    saveProposal(dispatch, {
      guid: activeProposal.guid,
      commission: activeProposal.data.commission,
      fees: activeProposal.data.fees,
      labor: activeProposal.data.labor,
      products: activeProposal.data.products,
      unitCostTax: activeProposal.data.unitCostTax,
      multiplier: activeProposal.data.multiplier,
      quoteOptions: activeProposal.data.quote_options,
    });
  });

  // Fetch client information
  const clientInfo = useMemo(() => {
    return clients.find((client) => {
      return client.guid === activeProposal?.owner?.guid;
    });
  }, [activeProposal, clients]);

  return (
    activeProposal && (
      <div className="proposals">
        <BreadcrumbNavigation
          initialBreadCrumbTitle={"All proposals"}
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
        <Tabs defaultValue={0}>
          <StyledTabsList>
            <StyledTab value={0}>Costs</StyledTab>
            <StyledTab value={1}>Documentation</StyledTab>
            <StyledTab value={2}>PDF</StyledTab>
          </StyledTabsList>
          <StyledTabPanel value={0}>
            <ProposalPricingView />
          </StyledTabPanel>
          <StyledTabPanel value={1}>
            <ClientCardDetails activeClient={clientInfo} />
            <ProposalCardDetails />
          </StyledTabPanel>
          <StyledTabPanel value={2}>
            <PdfDocument
              clientInfo={clientInfo}
              proposalDetails={activeProposal}
            />
          </StyledTabPanel>
        </Tabs>
      </div>
    )
  );
}
