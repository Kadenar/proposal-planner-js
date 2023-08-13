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
  updateProposalDescription,
  updateProposalName,
} from "../../services/slices/activeProposalSlice";
import { saveProposal } from "../../services/slices/proposalsSlice";
import { confirmDialog } from "../../components/dialogs/ConfirmDialog";
import PricingWorkup from "../../components/proposal-ui/Table/PricingWorkup";
import { TextField } from "@mui/material";

export const handleAddProductToProposal = (
  dispatch: Dispatch,
  category: string | undefined,
  activeProposal: ProposalObject | undefined,
  selectedProduct: Array<ProductObject> | undefined,
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

  const existingProduct = activeProposal.data.products.find((product) =>
    selectedProduct.find((selected) => {
      return selected.guid === product.guid;
    })
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

  selectedProduct.forEach((prod) => {
    addProductToProposal(dispatch, {
      category,
      guid: prod.guid,
      qty,
      quote_option,
    });
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
    saveProposal(dispatch, activeProposal);
  });

  return (
    <>
      <Stack gap={2} marginBottom={2}>
        <TextField
          required
          label="Proposal name"
          value={activeProposal.name}
          onChange={({ target: { value } }) => {
            updateProposalName(dispatch, value);
          }}
        />
        <TextField
          label="Proposal description"
          value={activeProposal.description || ""}
          onChange={({ target: { value } }) => {
            updateProposalDescription(dispatch, value);
          }}
        />
      </Stack>
      <Stack gap={2} direction="row" justifyContent="space-between">
        <Button
          variant="contained"
          onClick={() => {
            addProductToProposalDialog({
              filters,
              filter: filters[0],
              allProducts: products,
              selectedProduct: [],
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
          onClick={() => {
            confirmDialog({
              message:
                "Are you sure you want to remove all products from this proposal?",
              onSubmit: async () => {
                removeAllProductsFromProposal(dispatch);
                return true;
              },
            });
          }}
        >
          Remove all products
        </Button>
      </Stack>
      <Stack paddingTop={2} gap={1}>
        <ProductsForProposal />
        <CostBreakdown activeProposal={activeProposal} />
      </Stack>

      <PricingWorkup activeProposal={activeProposal} />
    </>
  );
}
