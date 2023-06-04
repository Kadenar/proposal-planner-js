import React from "react";

import {
  resetProposal,
  addProductToTable,
  updateProposals,
} from "../../../data-management/store/Reducers";
import { useDispatch, useSelector } from "react-redux";
import { saveProposal } from "../../../data-management/backend-helpers/InteractWithBackendData.ts";

import Box from "@mui/material/Box";
import { Button, Stack } from "@mui/material";
import { showSnackbar } from "../../coreui/CustomSnackbar";
import { addProductToProposalDialog } from "../../coreui/dialogs/AddProductToProposalDialog";
import PricingTable from "../pricing/Table/PricingTable";
import { updateStore } from "../../../data-management/store/Dispatcher";

/**
 * Component used for displaying the table of selected products as well as inputs for
 * selecting a product to append to the table
 * @returns
 */
export default function ProposalPricingView() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  const selectedProposal = useSelector((state) => state.selectedProposal);
  const filters = useSelector((state) => state.filters);

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

    dispatch(
      addProductToTable({
        guid: selectedProduct.guid,
        name: selectedProduct.model,
        catalogNum: selectedProduct.catalog,
        unitCost: selectedProduct.cost,
        quantity,
        totalCost: selectedProduct.cost * quantity,
      })
    );

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
                onSubmit: (selectedProduct, quantity) => {
                  return handleOnAdd(selectedProduct, quantity);
                },
              });
            }}
          >
            Add a product
          </Button>
          <Box sx={{ flexGrow: 1 }}>
            <Button
              variant="contained"
              onClick={() => {
                dispatch(resetProposal());
              }}
            >
              Remove all products
            </Button>
          </Box>
          <Button
            variant="contained"
            onClick={async () => {
              updateStore({
                dispatch,
                dbOperation: async () =>
                  saveProposal(
                    selectedProposal.guid,
                    selectedProposal.data.commission,
                    selectedProposal.data.fees,
                    selectedProposal.data.labor,
                    selectedProposal.data.models,
                    selectedProposal.data.unitCostTax,
                    selectedProposal.data.multiplier,
                    selectedProposal.data.title,
                    selectedProposal.data.summary,
                    selectedProposal.data.specifications
                  ),
                methodToDispatch: updateProposals,
                dataKey: "proposals",
                successMessage: "Your proposal has been successfully saved.",
              });
            }}
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
