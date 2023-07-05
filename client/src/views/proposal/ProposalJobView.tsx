import { useAppDispatch, useAppSelector } from "../../services/store";
import { useKey } from "../../hooks/useKey";
import { Dispatch } from "@reduxjs/toolkit";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { showSnackbar } from "../../components/CustomSnackbar";
import CostBreakdown from "../../components/proposal-ui/Table/CostBreakdown";
import { addProductToProposalDialog } from "../../components/dialogs/frontend/AddProductToProposalDialog";

import ProductsForProposal from "../../components/proposal-ui/Table/ProductsForProposal";

import { ProductObject, ProposalObject } from "../../middleware/Interfaces";
import {
  addProductToProposal,
  removeAllProductsFromProposal,
} from "../../services/slices/activeProposalSlice";
import { saveProposal } from "../../services/slices/proposalsSlice";

export const handleAddProductToProposal = (
  dispatch: Dispatch,
  category: string | undefined,
  activeProposal: ProposalObject | undefined,
  selectedProduct: ProductObject | null,
  qty: number,
  quote_option: number
) => {
  if (!activeProposal) {
    showSnackbar({
      title: "You can't add a product to a non-active proposal!",
      show: true,
      status: "error",
    });
    return false;
  }

  if (!selectedProduct || !category) {
    showSnackbar({
      title: "Please select a product to add!",
      show: true,
      status: "error",
    });
    return false;
  }

  if (qty <= 0) {
    showSnackbar({
      title: "Please specify a quantity greater than 0.",
      show: true,
      status: "error",
    });
    return false;
  }

  const existingProduct = activeProposal.data.products.find(
    (product) => product.guid === selectedProduct.guid
  );

  // Check if product is added to proposal in 1 of existing options
  if (existingProduct) {
    if (quote_option === 0) {
      showSnackbar({
        title:
          "Product is already applied to a specific quote and cannot be applied to All.",
        show: true,
        status: "error",
      });
      return false;
    }

    if (existingProduct.quote_option === 0) {
      showSnackbar({
        title: "Product is already being applied to All quote options.",
        show: true,
        status: "error",
      });
      return false;
    }

    if (existingProduct.quote_option === quote_option) {
      showSnackbar({
        title: "Product has already been added to the selected quote option.",
        show: true,
        status: "error",
      });
      return false;
    }
  }

  addProductToProposal(dispatch, {
    category,
    guid: selectedProduct.guid,
    qty,
    quote_option,
  });

  showSnackbar({
    title: "Successfully added product",
    show: true,
    status: "success",
  });

  return true;
};

/**
 * Component used for displaying the table of selected products as well as inputs for
 * selecting a product to append to the table
 * @returns
 */
export default function ProposalJobView({
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
      fees: activeProposal.data.fees,
      labor: activeProposal.data.labor,
      products: activeProposal.data.products,
      unitCostTax: activeProposal.data.unitCostTax,
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
              onSubmit: async (
                category,
                selectedProduct,
                qty,
                quote_option
              ) => {
                return handleAddProductToProposal(
                  dispatch,
                  category,
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
        <CostBreakdown activeProposal={activeProposal} />
      </Stack>
    </>
  );
}
