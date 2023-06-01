import React from "react";
import { useSelector } from "react-redux";
import AllProposalsView from "../proposal-ui/AllProposalsView";
import ProposalTabs from "../proposal-ui/ProposalTabs";

export default function ProposalsPage() {
  const selectedProposal = useSelector((state) => state.selectedProposal);

  return <>{!selectedProposal ? <AllProposalsView /> : <ProposalTabs />}</>;
}
