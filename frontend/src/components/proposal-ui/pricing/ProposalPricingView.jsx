import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import { Button, Stack } from "@mui/material";
import { showSnackbar } from "../../coreui/CustomSnackbar";
import { addProductToProposalDialog } from "../../coreui/dialogs/AddProductToProposalDialog";
import PricingTable from "../pricing/Table/PricingTable";
import {
  addProductToProposal,
  removeAllProductsFromProposal,
} from "../../../data-management/store/slices/selectedProposalSlice";
import { saveProposal } from "../../../data-management/store/slices/proposalsSlice";

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

  const handleOnAdd = (selectedProduct, quantity) => {
    if (!selectedProduct) {
      showSnackbar({
        title: "Please select a product to add!",
        show: true,
        status: "error",
      });
      return false;
    }

    if (quantity <= 0) {
      showSnackbar({
        title: "Please specify a quantity greater than 0.",
        show: true,
        status: "error",
      });
      return false;
    }

    if (
      selectedProposal.data.models.find(
        (job) => job.guid === selectedProduct.guid
      )
    ) {
      showSnackbar({
        title: "Product has already been added to this proposal.",
        show: true,
        status: "error",
      });
      return false;
    }

    addProductToProposal(dispatch, {
      guid: selectedProduct.guid,
      name: selectedProduct.model,
      catalogNum: selectedProduct.catalog,
      unitCost: selectedProduct.cost,
      quantity,
      totalCost: selectedProduct.cost * quantity,
    });

    showSnackbar({
      title: "Successfully added product",
      show: true,
      status: "success",
    });

    return true;
  };

  return (
    <>
      <Stack gap="20px" direction="row" width="100%">
        <>
          <Button
            variant="contained"
            sx={{ paddingRight: "5px" }}
            onClick={() => {
              addProductToProposalDialog({
                filters,
                selectedFilter: filters[0],
                allModels: products,
                selectedProduct: undefined,
                quantity: "",
                onSubmit: (selectedProduct, quantity) =>
                  handleOnAdd(selectedProduct, quantity),
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
                models: selectedProposal.data.models,
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
        </>
      </Stack>
      <Stack paddingTop="20px" gap="20px">
        <PricingTable />
      </Stack>
    </>
  );
}
