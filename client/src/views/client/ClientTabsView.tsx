import { useSelector, useDispatch } from "react-redux";

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
import { ReduxStore } from "../../data-management/middleware/Interfaces";

export default function ClientTabsView() {
  const dispatch = useDispatch();
  const { selectedClient } = useSelector((state: ReduxStore) => state.clients);

  if (!selectedClient) {
    return <>A client isn't selected, so you probably shouldn't be here!</>;
  }

  return (
    <div className="proposals">
      <BreadcrumbNavigation
        navigateBackFunc={() => updateActiveClient(dispatch, null)}
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
