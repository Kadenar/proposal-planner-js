import React from "react";
import ProductsTable from "../database-ui/ProductsTable";
import ProductTypesTable from "../database-ui/ProductTypesTable";
import CommissionMultipliers from "../database-ui/CommissionMultipliers";

import Tabs from "@mui/base/Tabs";
import {
  StyledTabsList,
  StyledTab,
  StyledTabPanel,
} from "../coreui/StyledComponents";
import LaborAndFeeTables from "../database-ui/LaborAndFeeTables";

export default function DatabasePage() {
  return (
    <div className="proposals">
      <Tabs defaultValue={0}>
        <StyledTabsList>
          <StyledTab value={0}>Products</StyledTab>
          <StyledTab value={1}>Product types</StyledTab>
          <StyledTab value={2}>Labor & Fees</StyledTab>
          <StyledTab value={3}>Commissions & Multipliers</StyledTab>
        </StyledTabsList>
        <StyledTabPanel value={0}>
          <ProductsTable />
        </StyledTabPanel>
        <StyledTabPanel value={1}>
          <ProductTypesTable />
        </StyledTabPanel>
        <StyledTabPanel value={2}>
          <LaborAndFeeTables />
        </StyledTabPanel>
        <StyledTabPanel value={3}>
          <CommissionMultipliers />
        </StyledTabPanel>
      </Tabs>
    </div>
  );
}
