import React, { useState, useRef, useEffect } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import { updateProducts } from "../../../data-management/Reducers";

import { Stack } from "@mui/material";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { Snackbar } from "@material-ui/core";
import Alert from "@mui/material/Alert";
import {
  flattenProductData,
  PushNewProduct,
  EditExistingProduct,
} from "../../../data-management/InteractWithBackendData";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const EditProductDialog = ({
  header = "",
  initialData = null,
  showModal = false,
  hide = () => {},
}) => {
  const [snackBarInfo, setSnackbarInfo] = useState({
    title: "",
    show: false,
    status: "success",
  });

  const showSnackbar = (title, status) => {
    setSnackbarInfo({
      title: title,
      show: true,
      status,
    });
  };
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);

  const selectedFilterRef = useRef();
  const modelNameRef = useRef();
  const catalogNumRef = useRef();
  const unitCostRef = useRef();

  /**
   * Handle adding a new item to the table and updating redux store
   */
  const handleOnAdd = async () => {
    const modelNameValue = modelNameRef.current.value;
    if (modelNameValue === "") {
      showSnackbar("Model name cannot be blank", "error");
      return false;
    }

    const catalogNumValue = catalogNumRef.current.value;
    if (catalogNumValue === "") {
      showSnackbar("Catalog number cannot be blank", "error");
      return false;
    }

    const unitCostValue = unitCostRef.current.value;
    if (!unitCostValue || unitCostValue === "" || unitCostValue <= 0) {
      showSnackbar("Please specify a valid cost for the product", "error");
      return false;
    }

    const selectedFilterValue = selectedFilterRef.current.value;
    console.log(selectedFilterValue);

    let response = {};
    if (initialData) {
      response = await EditExistingProduct({
        selectedFilter: selectedFilterValue,
        modelName: modelNameValue,
        catalogNum: catalogNumValue,
        unitCost: unitCostValue,
      });
    } else {
      response = await PushNewProduct({
        selectedFilter: selectedFilterValue,
        modelName: modelNameValue,
        catalogNum: catalogNumValue,
        unitCost: unitCostValue,
      });
    }

    if (response.status === 200) {
      const flattenedProductData = flattenProductData(response.data.products);
      dispatch(updateProducts(flattenedProductData));
      showSnackbar("Successfully added product", "success");
      selectedFilterRef.current = "";
      modelNameRef.current = "";
      catalogNumRef.current = "";
      unitCostRef.current = "";
      return true;
    }

    showSnackbar(response.data.message, "error");
    return false;
  };

  // Handle closing the snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarInfo({ title: "", show: false, status: "success" });
  };

  return (
    <>
      <BootstrapDialog
        PaperProps={{
          style: {
            minHeight: "50vh",
            minWidth: "300px",
            maxWidth: "700px",
            width: "50vw",
          },
        }}
        open={showModal}
        onClose={hide}
      >
        <DialogTitle>{header}</DialogTitle>
        <DialogContent>
          <div style={{ paddingTop: "5px" }}>
            <Stack spacing={2}>
              <Autocomplete
                disablePortal
                id="filters"
                disabled={initialData !== null}
                options={filters}
                defaultValue={initialData?.type || filters[0]}
                ref={selectedFilterRef}
                // inputRef={selectedFilterRef}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <TextField
                      {...params}
                      // inputRef={selectedFilterRef}
                      label="Product type"
                    />
                  </div>
                )}
              />
              <TextField
                label="Model name"
                inputRef={modelNameRef}
                defaultValue={initialData?.model || ""}
              />
              <TextField
                label="Catalog #"
                inputRef={catalogNumRef}
                defaultValue={initialData?.catalogNum || ""}
              />
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="unit-cost-amount">Unit cost</InputLabel>
                <Input
                  type="number"
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  inputRef={unitCostRef}
                  defaultValue={initialData?.unitCost || ""}
                />
              </FormControl>
            </Stack>
          </div>
        </DialogContent>
        {/* Dialog actions to add the product */}
        <DialogActions>
          <Button
            variant="contained"
            onClick={async () => {
              if (await handleOnAdd()) {
                hide();
              }
            }}
          >
            Edit
          </Button>
        </DialogActions>
      </BootstrapDialog>
      {/* Show a success message when adding an entry to the table */}
      <Snackbar
        open={snackBarInfo.show}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackBarInfo.status}
          sx={{ width: "100%" }}
        >
          {snackBarInfo.title}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditProductDialog;
