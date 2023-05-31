import React from "react";
import ProductsTable from "../ProductsTable/ProductsTable";
import ProductTypesTable from "../ProductsTable/ProductTypesTable";

import Tabs from "@mui/base/Tabs";
import {
  StyledTabsList,
  StyledTab,
  StyledTabPanel,
} from "../coreui/StyledTabs";

export default function DatabasePage() {
  return (
    <div className="proposals">
      <Tabs defaultValue={0}>
        <StyledTabsList>
          <StyledTab value={0}>Products</StyledTab>
          <StyledTab value={1}>Product types</StyledTab>
        </StyledTabsList>
        <StyledTabPanel value={0}>
          <ProductsTable />
        </StyledTabPanel>
        <StyledTabPanel value={1}>
          <ProductTypesTable />
        </StyledTabPanel>
      </Tabs>
    </div>
  );
}
