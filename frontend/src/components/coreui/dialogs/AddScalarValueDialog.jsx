import { useState } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { create } from "zustand";
import { StyledBootstrapDialog } from "../StyledComponents";
const useScalarValueStore = create((set) => ({
  header: "",
  onSubmit: undefined,
  validateOnSubmit: undefined,
  value: "",
  updateValue: (value) => set(() => ({ value: value })),
  close: () => set({ onSubmit: undefined }),
}));

const AddScalarValueDialog = () => {
  const { onSubmit, validateOnSubmit, close } = useScalarValueStore();

  const [value, updateValue] = useScalarValueStore((state) => [
    state.value,
    state.updateValue,
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
      <StyledBootstrapDialog
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
                value={value}
                onChange={({ target: { value } }) => {
                  updateValue(value);
                }}
                autoFocus
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
              if (validateOnSubmit(value) === undefined) {
                if (onSubmit) {
                  showSnackbar("Successfully added value!", "success");
                  await onSubmit(value);
                }

                close();
              } else {
                showSnackbar("Value already exists!", "error");
              }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </StyledBootstrapDialog>
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

export const addScalarValueDialog = (
  header,
  value,
  validateOnSubmit,
  onSubmit
) => {
  useScalarValueStore.setState({
    header,
    value,
    validateOnSubmit,
    onSubmit,
  });
};

export default AddScalarValueDialog;
