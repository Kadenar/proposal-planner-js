import { useAppSelector } from "../services/store";
import AllTemplatesView from "../views/template/AllTemplatesView";
import TemplateTabsView from "../views/template/TemplateTabsView";

export default function TemplatesPage() {
  const { activeProposal } = useAppSelector((state) => state.activeProposal);

  return (
    <>
      {!activeProposal ? (
        <AllTemplatesView />
      ) : (
        <TemplateTabsView activeTemplate={activeProposal} />
      )}
    </>
  );
}
