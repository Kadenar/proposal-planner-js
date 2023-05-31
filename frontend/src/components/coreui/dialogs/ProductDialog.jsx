import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import { Stack } from "@mui/material";
import { TextField } from "@material-ui/core";
import { Autocomplete } from "@mui/material";
import { create } from "zustand";
import { styled } from "@mui/material/styles";
import { Snackbar } from "@material-ui/core";
import Alert from "@mui/material/Alert";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const useProductDialogStore = create((set) => ({
  header: "",
  guid: "",
  onSubmit: undefined,
  validate: undefined,
  selectedFilter: "",
  modelName: "",
  catalogNum: "",
  unitCost: "",
  updateSelectedFilter: (filter) => set(() => ({ filter: filter })),
  updateModelName: (modelName) => set(() => ({ modelName: modelName })),
  updateCatalogNum: (catalogNum) => set(() => ({ catalogNum: catalogNum })),
  updateUnitCost: (unitCost) => set(() => ({ unitCost: unitCost })),
  close: () => set({ onSubmit: undefined }),
}));

const ProductDialog = () => {
  const { header, onSubmit, validate, close, guid, filters } =
    useProductDialogStore();

  const [selectedFilter, updateSelectedFilter] = useProductDialogStore(
    (state) => [state.selectedFilter, state.updateSelectedFilter]
  );

  const [modelName, updateModelName] = useProductDialogStore((state) => [
    state.modelName,
    state.updateModelName,
  ]);

  const [catalogNum, updateCatalogNum] = useProductDialogStore((state) => [
    state.catalogNum,
    state.updateCatalogNum,
  ]);

  const [unitCost, updateUnitCost] = useProductDialogStore((state) => [
    state.unitCost,
    state.updateUnitCost,
  ]);

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
            minWidth: "300px",
            maxWidth: "700px",
            width: "50vw",
          },
        }}
        open={Boolean(onSubmit)}
        onClose={close}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{header}</DialogTitle>
        <DialogContent>
          <div style={{ paddingTop: "5px" }}>
            <Stack spacing={2}>
              <Autocomplete
                disablePortal
                id="filters"
                disabled={guid !== ""}
                options={filters}
                value={selectedFilter}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <TextField {...params} label="Product type" />
                  </div>
                )}
                onChange={(event, value) => {
                  updateSelectedFilter(value);
                }}
              />
              <TextField
                label="Model name"
                value={modelName}
                onChange={({ target: { value } }) => {
                  updateModelName(value);
                }}
              />
              <TextField
                label="Catalog #"
                value={catalogNum || ""}
                onChange={({ target: { value } }) => {
                  updateCatalogNum(value);
                }}
              />
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="unit-cost-amount">Unit cost</InputLabel>
                <Input
                  type="number"
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                  value={unitCost || ""}
                  onChange={({ target: { value } }) => {
                    updateUnitCost(value);
                  }}
                />
              </FormControl>
            </Stack>
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" variant="contained" onClick={close}>
            Cancel
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              if (!validate(modelName, catalogNum, unitCost)) {
                showSnackbar(
                  "Please specify all fields with valid values!",
                  "error"
                );
                return;
              }

              if (onSubmit) {
                showSnackbar(
                  `Successfully ${guid !== "" ? "edited" : "added"} product!`,
                  "success"
                );
                onSubmit(guid, selectedFilter, modelName, catalogNum, unitCost);
              }
              close();
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </BootstrapDialog>
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

export const productDialog = ({
  header,
  guid,
  filters,
  selectedFilter,
  modelName,
  catalogNum,
  unitCost,
  onSubmit,
  validate,
}) => {
  useProductDialogStore.setState({
    header,
    guid,
    filters,
    selectedFilter,
    modelName,
    catalogNum,
    unitCost,
    onSubmit,
    validate,
  });
};

export default ProductDialog;
