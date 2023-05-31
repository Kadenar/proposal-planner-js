import React from "react";
import { useSelector } from "react-redux";
import ListOfExistingProposals from "../Proposals/ListOfExistingProposals";
import ProposalDefinitionWrapper from "../Proposals/ProposalDefinitionWrapper";

export default function ProposalsPage() {
  const selectedProposal = useSelector((state) => state.selectedProposal);

  return (
    <>
      {selectedProposal === "" ? (
        <ListOfExistingProposals />
      ) : (
        <ProposalDefinitionWrapper />
      )}
    </>
  );
}
