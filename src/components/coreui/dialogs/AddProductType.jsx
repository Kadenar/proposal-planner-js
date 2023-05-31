import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";
import { Stack } from "@mui/material";
import { TextField } from "@material-ui/core";
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

const useProductTypeStore = create((set) => ({
  header: "",
  onSubmit: undefined,
  validateOnSubmit: undefined,
  productType: "",
  updateProductType: (productType) => set(() => ({ productType: productType })),
  close: () => set({ onSubmit: undefined }),
}));

const ProductTypeDialog = () => {
  const { onSubmit, validateOnSubmit, close } = useProductTypeStore();

  const [productType, updateProductType] = useProductTypeStore((state) => [
    state.productType,
    state.updateProductType,
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
        <DialogTitle>Add product type</DialogTitle>
        <DialogContent>
          <div style={{ paddingTop: "5px" }}>
            <Stack spacing={2}>
              <TextField
                label="Product type"
                value={productType}
                onChange={({ target: { value } }) => {
                  updateProductType(value);
                }}
              />
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
            onClick={async () => {
              if (validateOnSubmit(productType) === undefined) {
                if (onSubmit) {
                  showSnackbar("Successfully added type!", "success");
                  await onSubmit(productType);
                }

                close();
              } else {
                showSnackbar("Product type already exists!", "error");
              }
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

export const productTypeDialog = (
  header,
  productType,
  validateOnSubmit,
  onSubmit
) => {
  useProductTypeStore.setState({
    header,
    productType,
    validateOnSubmit,
    onSubmit,
  });
};

export default ProductTypeDialog;
