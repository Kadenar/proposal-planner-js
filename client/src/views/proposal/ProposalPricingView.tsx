import { useAppDispatch, useAppSelector } from "../../services/store";
import { useKey } from "../../hooks/useKey";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

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
      start_date: activeProposal.data.start_date || "",
    });
  });

  return (
    <>
      <Stack gap={2} direction="row" justifyContent="space-between">
        <Button
          variant="contained"
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
        <Button
          variant="contained"
          onClick={() => removeAllProductsFromProposal(dispatch)}
        >
          Remove all products
        </Button>
      </Stack>
      <Stack paddingTop={2} gap={1}>
        <ProductsForProposal />
        <FeesAndLaborForProposal activeProposal={activeProposal} />
        <CostBreakdown activeProposal={activeProposal} />
      </Stack>
    </>
  );
}
