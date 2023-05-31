import { Button, Stack } from "@mui/material";
import React, { useState } from "react";

import Alert from "@mui/material/Alert";
import BasicDialogue from "../coreui/dialogs/BasicDialog";
import AddProductContent from "./Configure/AddProductContent";
import AddProductAction from "./Configure/AddProductAction";
import Box from "@mui/material/Box";

import PricingTable from "./Table/PricingTable";
import { Snackbar } from "@material-ui/core";
import { resetProposal } from "../../data-management/Reducers";
import { useDispatch, useSelector } from "react-redux";
import { FetchProposalData } from "../../data-management/InteractWithBackendData";

// TODO
async function saveProposal(value) {
  const existingProposals = await FetchProposalData();
  console.log(value);
  const date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  const proposalJson = {
    name: value.name,
    dateCreated: `${month}/${day}/${year}`,
    description: value.description,
    date: {
      commission: value.commission,
      fees: {
        value,
      },
    },
  };

  const index = existingProposals.findIndex((proposal) => {
    return proposal.name === value.name;
  });

  console.log(`found index ${index}`);
  const newProposalData = [...existingProposals];

  if (index > 0) {
    newProposalData[index] = value;
  } else {
    newProposalData.push(value);
  }

  console.log(newProposalData);
}

/**
 * Component used for displaying the table of selected products as well as inputs for
 * selecting a product to append to the table
 * @returns
 */
export default function ProposalDefinition() {
  const dispatch = useDispatch();

  const [showSnackBar, setShowSnackbar] = useState({
    title: "",
    show: false,
    status: "success",
  });
  const [showProductModal, setShowProductModal] = useState(false);

  // Handle closing the snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setShowSnackbar({ title: "", show: false, status: "success" });
  };

  const selectedProposal = useSelector((state) => state.selectedProposal);
  const models = useSelector((state) => state.jobTableContents);
  const unitCostTax = useSelector((state) => state.unitCostTax);
  const multiplier = useSelector((state) => state.multiplier);
  const commission = useSelector((state) => state.commission);
  const fees = useSelector((state) => state.fees);

  const jsonDataToUpdate = {
    selectedProposal,
    models,
    unitCostTax,
    multiplier,
    commission,
    fees,
  };

  return (
    <>
      <Stack gap="20px" direction="row" width="100%">
        {/* Button for clearing the table contents */}
        <>
          {/* Button for adding a product */}

          <Button
            variant="contained"
            sx={{ paddingRight: "5px" }}
            onClick={() => setShowProductModal(true)}
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
            onClick={() => {
              saveProposal(jsonDataToUpdate);
            }}
            align="right"
          >
            Save proposal
          </Button>
        </>
      </Stack>
      <Stack paddingTop="20px" gap="20px">
        {/* Include our pricing table */}
        <div className="tableStyles">
          <PricingTable />
        </div>
        {/* Buttons for interacting with the table */}
      </Stack>

      {/* Show a success message when adding an entry to the table */}
      <Snackbar
        open={showSnackBar.show}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={showSnackBar.status}
          sx={{ width: "100%" }}
        >
          {showSnackBar.title}
        </Alert>
      </Snackbar>

      {/* Dialogue for configuring products */}

      <BasicDialogue
        open={showProductModal}
        handleClose={() => {
          setShowProductModal(false);
        }}
        content={<AddProductContent />}
        actions={
          <AddProductAction
            onSubmitHandler={() => setShowProductModal(false)}
            showSnackBar={(title, status) => {
              setShowSnackbar({
                title,
                show: true,
                status,
              });
            }}
          />
        }
        header={"Add a product"}
      />
    </>
  );
}
