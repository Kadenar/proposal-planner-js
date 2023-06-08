import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import { Button, Stack } from "@mui/material";

import { StyledIconButton } from "../../coreui/StyledComponents";
import { addProductToProposalDialog } from "../../coreui/dialogs/frontend/AddProductToProposalDialog";
import { removeAllProductsFromProposal } from "../../../data-management/store/slices/selectedProposalSlice";
import { saveProposal } from "../../../data-management/store/slices/proposalsSlice";
import { handleAddProductToProposal } from "./pricing-utils";
import ProductsForProposal from "./Table/ProductsForProposal";
import FeesAndLaborForProposal from "./Table/FeesAndLaborForProposal";
import CostBreakdown from "./Table/CostBreakdown";

/**
 * Component used for displaying the table of selected products as well as inputs for
 * selecting a product to append to the table
 * @returns
 */
export default function ProposalPricingView() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { selectedProposal } = useSelector((state) => state.selectedProposal);
  const { filters } = useSelector((state) => state.filters);
  const [open, setOpen] = useState(true);

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
              quantity: 1,
              quote_option: 1,
              onSubmit: (selectedProduct, quantity, quote_option) =>
                handleAddProductToProposal(
                  dispatch,
                  selectedProposal,
                  selectedProduct,
                  quantity,
                  quote_option
                ),
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
          align="right"
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
