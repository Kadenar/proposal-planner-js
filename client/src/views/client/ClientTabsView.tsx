import { useAppDispatch, useAppSelector } from "../../services/store";

import Tabs from "@mui/base/Tabs";
import {
  StyledTabsList,
  StyledTab,
  StyledTabPanel,
} from "../../components/StyledComponents";
import BreadcrumbNavigation from "../../components/BreadcrumbNavigation";
import ClientProposalsView from "./ClientProposalsView";
import ClientAddressView from "./ClientAddressView";
import {
  saveClient,
  updateActiveClient,
} from "../../services/slices/clientsSlice";
import { confirmDialog } from "../../components/dialogs/ConfirmDialog";
import { ClientObject } from "../../middleware/Interfaces";
import { Button, Stack } from "@mui/material";

export default function ClientTabsView({
  selectedClient,
}: {
  selectedClient: ClientObject;
}) {
  const dispatch = useAppDispatch();
  const { is_dirty } = useAppSelector((state) => state.clients);

  return (
    <>
      <Stack direction="row" justifyContent="space-between" marginBottom={2}>
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
          initialBreadCrumbTitle="All clients"
          breadcrumbName={selectedClient.name}
        />
        <Button
          variant="contained"
          onClick={async () => {
            saveClient(dispatch, {
              ...selectedClient,
            });
          }}
        >
          Save client
        </Button>
      </Stack>

      <Tabs defaultValue={0}>
        <StyledTabsList>
          <StyledTab value={0}>Address</StyledTab>
          <StyledTab value={1}>Proposals</StyledTab>
          {/* <StyledTab value={2}>Jobs</StyledTab> */}
        </StyledTabsList>
        <StyledTabPanel value={0}>
          <ClientAddressView selectedClient={selectedClient} />
        </StyledTabPanel>
        <StyledTabPanel value={1}>
          <ClientProposalsView selectedClient={selectedClient} />
        </StyledTabPanel>
        {/* <StyledTabPanel value={2}>
            <>Jobs will go here</>
          </StyledTabPanel> */}
      </Tabs>
    </>
  );
}
