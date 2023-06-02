import React, { useState } from "react";

import Box from "@mui/material/Box";
import { Button, Stack } from "@mui/material";

import PricingTable from "./Table/PricingTable";
import {
  resetProposal,
  addProductToTable,
  updateProposals,
} from "../../data-management/Reducers";
import { useDispatch, useSelector } from "react-redux";
import { addProductToProposalDialog } from "../coreui/dialogs/AddProductToProposalDialog";
import { saveProposal } from "../../data-management/InteractWithBackendData";
import { showSnackbar } from "../coreui/CustomSnackbar";

/**
 * Component used for displaying the table of selected products as well as inputs for
 * selecting a product to append to the table
 * @returns
 */
export default function ProposalPricingView() {
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.allProducts);
  const selectedProposal = useSelector((state) => state.selectedProposal);
  const filters = useSelector((state) => state.filters);
  const jobTableContents = useSelector((state) => state.jobTableContents);
  const unitCostTax = useSelector((state) => state.unitCostTax);
  const multiplier = useSelector((state) => state.multiplier);
  const commission = useSelector((state) => state.commission);
  const fees = useSelector((state) => state.fees);
  const labor = useSelector((state) => state.labor);

  // TODO - This is a hack to force a re-render of the component so that pricing table will reflect updates
  const [hackState, updateHack] = useState(false);

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

    if (jobTableContents.find((job) => job.guid === selectedProduct.guid)) {
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

    updateHack((prev) => !prev);
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
                allModels: allProducts,
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
              Remove added products
            </Button>
          </Box>
          <Button
            variant="contained"
            onClick={async () => {
              const response = await saveProposal({
                guid: selectedProposal.guid,
                commission,
                fees,
                labor,
                unitCostTax,
                multiplier,
                models: jobTableContents,
              });

              if (response.status === 200) {
                showSnackbar({
                  title: "Your proposal has been successfully saved.",
                  show: true,
                  status: "success",
                });
                dispatch(updateProposals(response.data.proposals));
              } else {
                showSnackbar({
                  title: "Internal server error - failed to save proposal.",
                  show: true,
                  status: "error",
                });
              }
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
