import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../services/store";
import { useKey } from "../../hooks/useKey";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import { Button, Stack } from "@mui/material";

import { StyledIconButton } from "../../components/StyledComponents";
import { addProductToProposalDialog } from "../../components/dialogs/frontend/AddProductToProposalDialog";
import { removeAllProductsFromProposal } from "../../services/slices/activeProposalSlice";
import { saveProposal } from "../../services/slices/proposalsSlice";
import { handleAddProductToProposal } from "../../lib/pricing-utils";
import ProductsForProposal from "../../components/proposal-ui/pricing/Table/ProductsForProposal";
import FeesAndLaborForProposal from "../../components/proposal-ui/pricing/Table/FeesAndLaborForProposal";
import CostBreakdown from "../../components/proposal-ui/pricing/Table/CostBreakdown";

import { ProposalObject } from "../../middleware/Interfaces";

/**
 * Component used for displaying the table of selected products as well as inputs for
 * selecting a product to append to the table
 * @returns
 */
export default function ProposalPricingView({
  activeProposal,
}: {
  activeProposal: ProposalObject;
}) {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);
  const { filters } = useAppSelector((state) => state.filters);
  const [open, setOpen] = useState(true);

  useKey("ctrls", () => {
    saveProposal(dispatch, {
      guid: activeProposal.guid,
      commission: activeProposal.data.commission,
      fees: activeProposal.data.fees,
      labor: activeProposal.data.labor,
      products: activeProposal.data.products,
      unitCostTax: activeProposal.data.unitCostTax,
      multiplier: activeProposal.data.multiplier,
      quoteOptions: activeProposal.data.quote_options,
    });
  });

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
              selectedProduct: null,
              qty: 1,
              quote_option: 1,
              onSubmit: async (selectedProduct, qty, quote_option) => {
                return handleAddProductToProposal(
                  dispatch,
                  activeProposal,
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
              guid: activeProposal.guid,
              commission: activeProposal.data.commission,
              fees: activeProposal.data.fees,
              labor: activeProposal.data.labor,
              products: activeProposal.data.products,
              unitCostTax: activeProposal.data.unitCostTax,
              multiplier: activeProposal.data.multiplier,
              quoteOptions: activeProposal.data.quote_options,
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
          <CostBreakdown activeProposal={activeProposal} />
        </Collapse>
      </Stack>
    </>
  );
}
