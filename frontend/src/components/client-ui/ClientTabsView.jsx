import React from "react";
import { useSelector, useDispatch } from "react-redux";

import { updateSelectedClient } from "../../data-management/store/Reducers";

import Tabs from "@mui/base/Tabs";
import {
  StyledTabsList,
  StyledTab,
  StyledTabPanel,
} from "../coreui/StyledComponents";
import BreadcrumbNavigation from "../coreui/BreadcrumbNavigation";
import ClientProposalsView from "./ClientProposalsView";
import ClientAddressView from "./ClientAddressView";

export default function ClientTabsView() {
  const dispatch = useDispatch();

  const selectedClient = useSelector((state) => state.selectedClient);

  return (
    <div className="proposals">
      <BreadcrumbNavigation
        navigateBackFunc={() => dispatch(updateSelectedClient(null))}
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
