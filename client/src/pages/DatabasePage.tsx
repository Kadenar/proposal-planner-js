import AllProductsView from "../views/database/AllProductsView";
import AllProductTypesView from "../views/database/AllProductTypesView";
// import CommissionMultipliersView from "../views/database/CommissionMultipliersView";

import Tabs from "@mui/base/Tabs";
import {
  StyledTabsList,
  StyledTab,
  StyledTabPanel,
} from "../components/StyledComponents";
import LaborAndFeesView from "../views/database/LaborAndFeesView";
import FinancingOptionsView from "../views/database/FinancingOptionsView";

export default function DatabasePage() {
  return (
    <div className="proposals">
      <Tabs defaultValue={0}>
        <StyledTabsList>
          <StyledTab value={0}>Products</StyledTab>
          <StyledTab value={1}>Product types</StyledTab>
          <StyledTab value={2}>Labor & Fees</StyledTab>
          <StyledTab value={3}>Financing</StyledTab>
          {/* <StyledTab value={3}>Commissions & Multipliers</StyledTab> */}
        </StyledTabsList>
        <StyledTabPanel value={0}>
          <AllProductsView />
        </StyledTabPanel>
        <StyledTabPanel value={1}>
          <AllProductTypesView />
        </StyledTabPanel>
        <StyledTabPanel value={2}>
          <LaborAndFeesView />
        </StyledTabPanel>
        <StyledTabPanel value={3}>
          <FinancingOptionsView />
        </StyledTabPanel>
        {/* <StyledTabPanel value={3}>
          <CommissionMultipliersView />
        </StyledTabPanel> */}
      </Tabs>
    </div>
  );
}
