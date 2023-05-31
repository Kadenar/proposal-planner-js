import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useState } from "react";
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
} from "../../../data-management/InteractWithBackendData";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const CreateNewProductDialog = ({ showModal = false, hide = () => {} }) => {
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
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);

  const [modelName, setModelName] = useState("");
  const [catalogNum, setCatalogNum] = useState("");
  const [unitCost, setUnitCost] = useState(undefined);

  /**
   * Handle adding a new item to the table and updating redux store
   */
  const handleOnAdd = async () => {
    if (modelName === "") {
      showSnackbar("Please specify a model name", "error");
      return false;
    }

    if (catalogNum === "") {
      showSnackbar("Please specify a catalog number", "error");
      return false;
    }

    if (!unitCost || unitCost === "" || unitCost <= 0) {
      showSnackbar("Please specify a valid cost for the product", "error");
      return false;
    }

    const response = await PushNewProduct({
      selectedFilter,
      modelName,
      catalogNum,
      unitCost,
    });

    if (response.status === 200) {
      const flattenedProductData = flattenProductData(response.data.products);
      dispatch(updateProducts(flattenedProductData));
      showSnackbar("Successfully added product", "success");
      setModelName("");
      setCatalogNum("");
      setUnitCost(undefined);
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
        <DialogTitle>{"Create a new product"}</DialogTitle>
        <DialogContent>
          <div style={{ paddingTop: "5px" }}>
            <Stack spacing={2}>
              <Autocomplete
                disablePortal
                id="filters"
                options={filters}
                value={selectedFilter}
                renderInput={(params) => (
                  <TextField {...params} label="Product type" />
                )}
                onChange={(event, value) => {
                  setSelectedFilter(value);
                }}
              />
              <TextField
                label="Model name"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
              />
              <TextField
                label="Catalog #"
                value={catalogNum}
                onChange={(e) => setCatalogNum(e.target.value)}
              />
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="filled-adornment-amount">
                  Unit cost
                </InputLabel>
                <Input
                  id="filled-adornment-amount"
                  type="number"
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  value={unitCost}
                  onChange={(e) => setUnitCost(e.target.value)}
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
              handleOnAdd();
            }}
          >
            Submit & add another
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (await handleOnAdd()) {
                hide();
              }
            }}
          >
            Add
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

export default CreateNewProductDialog;
