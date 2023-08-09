import ProposalCardDetails from "../../components/proposal-ui/documentation/ProposalCardDetails";
import { useAppSelector } from "../../services/store";

const ProposalDocumentationView = () => {
  const { activeProposal } = useAppSelector((state) => state.activeProposal);

  return (
    <>
      {activeProposal ? (
        <ProposalCardDetails activeProposal={activeProposal} />
      ) : (
        <>A proposal must be selected to view documentation details</>
      )}
    </>
  );
};

export default ProposalDocumentationView;
