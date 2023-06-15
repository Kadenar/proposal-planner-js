import AllProposalsView from "../views/proposal/AllProposalsView";
import ProposalTabsView from "../views/proposal/ProposalTabsView";
import { useAppSelector } from "../services/store";

export default function ProposalsPage() {
  const { activeProposal } = useAppSelector((state) => state.activeProposal);

  return (
    <>
      {!activeProposal ? (
        <AllProposalsView />
      ) : (
        <ProposalTabsView activeProposal={activeProposal} />
      )}
    </>
  );
}
