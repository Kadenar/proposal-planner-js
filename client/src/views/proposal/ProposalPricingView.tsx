import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import { Button, Stack } from "@mui/material";

import { StyledIconButton } from "../../components/coreui/StyledComponents";
import { addProductToProposalDialog } from "../../components/coreui/dialogs/frontend/AddProductToProposalDialog";
import { removeAllProductsFromProposal } from "../../data-management/store/slices/selectedProposalSlice";
import { saveProposal } from "../../data-management/store/slices/proposalsSlice";
import { handleAddProductToProposal } from "../../components/proposal-ui/pricing/pricing-utils";
import ProductsForProposal from "../../components/proposal-ui/pricing/Table/ProductsForProposal";
import FeesAndLaborForProposal from "../../components/proposal-ui/pricing/Table/FeesAndLaborForProposal";
import CostBreakdown from "../../components/proposal-ui/pricing/Table/CostBreakdown";
import { ReduxStore } from "../../data-management/middleware/Interfaces";

/**
 * Component used for displaying the table of selected products as well as inputs for
 * selecting a product to append to the table
 * @returns
 */
export default function ProposalPricingView() {
  const dispatch = useDispatch();
  const { products } = useSelector((state: ReduxStore) => state.products);
  const { selectedProposal } = useSelector(
    (state: ReduxStore) => state.selectedProposal
  );
  const { filters } = useSelector((state: ReduxStore) => state.filters);
  const [open, setOpen] = useState(true);

  if (!selectedProposal) {
    return <>You don't have a proposal selected. No pricing can be shown!</>;
  }

  return (
    <>
      <Stack gap="20px" direction="row" width="100%">
        <Button
          variant="contained"
          sx={{ paddingRight: "5px" }}
          onClick={() => {
            addProductToProposalDialog({
              filters,
              filter: filters[0],
              allProducts: products,
              selectedProduct: undefined,
              qty: 1,
              quote_option: 1,
              onSubmit: async (selectedProduct, qty, quote_option) => {
                return handleAddProductToProposal(
                  dispatch,
                  selectedProposal,
                  selectedProduct,
                  qty,
                  quote_option
                );
              },
            });
          }}
        >
          Add a product
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Button
            variant="contained"
            onClick={() => removeAllProductsFromProposal(dispatch)}
          >
            Remove all products
          </Button>
        </Box>
        <Button
          variant="contained"
          onClick={async () =>
            saveProposal(dispatch, {
              guid: selectedProposal.guid,
              commission: selectedProposal.data.commission,
              fees: selectedProposal.data.fees,
              labor: selectedProposal.data.labor,
              products: selectedProposal.data.products,
              unitCostTax: selectedProposal.data.unitCostTax,
              multiplier: selectedProposal.data.multiplier,
              title: selectedProposal.data.title,
              summary: selectedProposal.data.summary,
              specifications: selectedProposal.data.specifications,
            })
          }
        >
          Save proposal
        </Button>
      </Stack>

      <Stack paddingTop="20px" gap="20px">
        <ProductsForProposal />
        <Stack direction="row" justifyContent="space-between">
          <StyledIconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            style={{ fontWeight: "bold" }}
          >
            {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
            Pricing data
          </StyledIconButton>
        </Stack>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <FeesAndLaborForProposal />
          <CostBreakdown />
        </Collapse>
      </Stack>
    </>
  );
}
