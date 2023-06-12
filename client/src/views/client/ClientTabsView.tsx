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
import { confirmDialog } from "../../components/coreui/dialogs/ConfirmDialog";

export default function ClientTabsView() {
  const dispatch = useAppDispatch();
  const { selectedClient, is_dirty } = useAppSelector((state) => state.clients);

  if (!selectedClient) {
    return <>A client isn't selected, so you probably shouldn't be here!</>;
  }

  return (
    <div className="proposals">
      <BreadcrumbNavigation
        navigateBackFunc={() => {
          if (is_dirty) {
            confirmDialog({
              message: "You have unsaved changes",
              onSubmit: async () => {
                updateActiveClient(dispatch, undefined);
                return true;
              },
            });
          } else {
            updateActiveClient(dispatch, undefined);
          }
        }}
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
          <ClientAddressView selectedClient={selectedClient} />
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
