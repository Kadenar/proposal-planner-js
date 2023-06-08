import { useSelector } from "react-redux";
import AllProposalsView from "../views/proposal/AllProposalsView";
import ProposalTabsView from "../views/proposal/ProposalTabsView";

export default function ProposalsPage() {
  const { selectedProposal } = useSelector((state) => state.selectedProposal);

  return <>{!selectedProposal ? <AllProposalsView /> : <ProposalTabsView />}</>;
}
