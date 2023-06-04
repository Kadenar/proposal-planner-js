import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import Card from "@mui/material/Card";
import Tabs from "@mui/base/Tabs";
import Collapse from "@mui/material/Collapse";

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
        </StyledTabsList>
        <StyledTabPanel value={0}>
          <ProposalPricingView />
        </StyledTabPanel>
        <StyledTabPanel value={1}>
          <ProposalCardDetails />
          <ClientCardDetails activeClient={clientInfo} />
          <Card sx={{ padding: 2 }}>
            <PdfDocument
              clientInfo={clientInfo}
              proposalDetails={selectedProposal}
            />
          </Card>
        </StyledTabPanel>
      </Tabs>
    </div>
  );
}
