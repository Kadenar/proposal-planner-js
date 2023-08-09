import { useAppSelector } from "../services/store";
import AllTemplatesView from "../views/template/AllTemplatesView";
import TemplateTabsView from "../views/template/TemplateTabsView";

export default function TemplatesPage() {
  const { activeProposal } = useAppSelector((state) => state.activeProposal);

  return (
    <>
      {
        // Don't allow user to see template view for proposals
        !activeProposal || activeProposal.owner ? (
          <AllTemplatesView />
        ) : (
          <TemplateTabsView activeTemplate={activeProposal} />
        )
      }
    </>
  );
}
