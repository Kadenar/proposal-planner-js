import AllProposalsView from "../views/proposal/AllProposalsView";
import ProposalTabsView from "../views/proposal/ProposalTabsView";
import { useAppSelector } from "../data-management/store/store";

export default function ProposalsPage() {
  const { activeProposal } = useAppSelector((state) => state.activeProposal);

  return <>{!activeProposal ? <AllProposalsView /> : <ProposalTabsView />}</>;
}
