import React from "react";
import { useSelector } from "react-redux";
import AllProposalsView from "../proposal-ui/AllProposalsView";
import ProposalTabsView from "../proposal-ui/ProposalTabsView";

export default function ProposalsPage() {
  const selectedProposal = useSelector((state) => state.selectedProposal);

  return <>{!selectedProposal ? <AllProposalsView /> : <ProposalTabsView />}</>;
}
