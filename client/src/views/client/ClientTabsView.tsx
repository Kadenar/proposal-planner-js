import Tabs from "@mui/base/Tabs";
import {
  StyledTabsList,
  StyledTab,
  StyledTabPanel,
} from "../../components/coreui/StyledComponents";
import BreadcrumbNavigation from "../../components/coreui/BreadcrumbNavigation";
import ClientProposalsView from "./ClientProposalsView";
import ClientAddressView from "./ClientAddressView";
import { updateActiveClient } from "../../data-management/store/slices/clientsSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../data-management/store/store";

export default function ClientTabsView() {
  const dispatch = useAppDispatch();
  const { selectedClient } = useAppSelector((state) => state.clients);

  if (!selectedClient) {
    return <>A client isn't selected, so you probably shouldn't be here!</>;
  }

  return (
    <div className="proposals">
      <BreadcrumbNavigation
        navigateBackFunc={() => updateActiveClient(dispatch, undefined)}
        initialBreadCrumbTitle={"All clients"}
        breadcrumbName={selectedClient.name}
      />
      <Tabs defaultValue={0}>
        <StyledTabsList>
          <StyledTab value={0}>Address</StyledTab>
          <StyledTab value={1}>Proposals</StyledTab>
          <StyledTab value={2}>Jobs</StyledTab>
        </StyledTabsList>
        <StyledTabPanel value={0}>
          <ClientAddressView />
        </StyledTabPanel>
        <StyledTabPanel value={1}>
          <ClientProposalsView />
        </StyledTabPanel>
        <StyledTabPanel value={2}>
          <>Jobs will go here</>
        </StyledTabPanel>
      </Tabs>
    </div>
  );
}
