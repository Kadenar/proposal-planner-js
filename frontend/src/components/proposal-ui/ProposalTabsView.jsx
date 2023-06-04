import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import Tabs from "@mui/base/Tabs";

import {
  StyledTabsList,
  StyledTab,
  StyledTabPanel,
} from "../coreui/StyledComponents";

import ProposalPricingView from "./pricing/ProposalPricingView";
import ClientCardDetails from "./documentation/ClientCardDetails";
import { PdfDocument } from "./documentation/pdf/PdfDocument";
import BreadcrumbNavigation from "../coreui/BreadcrumbNavigation";
import { selectProposal } from "../../data-management/store/Reducers";
import ProposalCardDetails from "./documentation/ProposalCardDetails";

export default function ProposalTabsView() {
  const clients = useSelector((state) => state.clients);
  const selectedProposal = useSelector((state) => state.selectedProposal);
  const dispatch = useDispatch();

  // Fetch client information
  const clientInfo = useMemo(() => {
    return clients.find((client) => {
      return client.guid === selectedProposal.client_guid;
    });
  }, [selectedProposal, clients]);

  return (
    <div className="proposals">
      <BreadcrumbNavigation
        initialBreadCrumbTitle={"All proposals"}
        navigateBackFunc={() => dispatch(selectProposal(null))}
        breadcrumbName={selectedProposal.name}
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
            proposalDetails={selectedProposal}
          />
        </StyledTabPanel>
      </Tabs>
    </div>
  );
}
