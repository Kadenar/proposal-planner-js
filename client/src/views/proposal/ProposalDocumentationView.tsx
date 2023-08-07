import { useMemo } from "react";
import ClientCardDetails from "../../components/proposal-ui/documentation/ClientCardDetails";
import ProposalCardDetails from "../../components/proposal-ui/documentation/ProposalCardDetails";
import { useAppSelector } from "../../services/store";

const ProposalDocumentationView = () => {
  const { activeProposal } = useAppSelector((state) => state.activeProposal);
  const { clients } = useAppSelector((state) => state.clients);

  // Fetch client information
  const clientInfo = useMemo(() => {
    return clients.find((client) => {
      return client.guid === activeProposal?.owner?.guid;
    });
  }, [activeProposal, clients]);

  return (
    <>
      {clientInfo && <ClientCardDetails activeClient={clientInfo} />}
      {activeProposal ? (
        <ProposalCardDetails activeProposal={activeProposal} />
      ) : (
        <>A proposal must be selected to view documentation details</>
      )}
    </>
  );
};

export default ProposalDocumentationView;
