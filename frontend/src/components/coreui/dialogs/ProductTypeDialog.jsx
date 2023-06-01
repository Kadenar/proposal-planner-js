import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@material-ui/core";
import { Stack } from "@mui/material";
import { TextField } from "@material-ui/core";
import { create } from "zustand";
import { StyledBootstrapDialog } from "../StyledComponents";

const useProductTypeStore = create((set) => ({
  header: "",
  onSubmit: undefined,
  productType: "",
  updateProductType: (productType) => set(() => ({ productType: productType })),
  close: () => set({ onSubmit: undefined }),
}));

const ProductTypeDialog = () => {
  const { onSubmit, close } = useProductTypeStore();

  const [productType, updateProductType] = useProductTypeStore((state) => [
    state.productType,
    state.updateProductType,
  ]);

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
              if (!onSubmit) {
                close();
                return;
              }

              const isValid = await onSubmit(productType);

              if (isValid) {
                close();
              }
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </StyledBootstrapDialog>
    </>
  );
};

export const productTypeDialog = ({ header, productType, onSubmit }) => {
  useProductTypeStore.setState({
    header,
    productType,
    onSubmit,
  });
};

export default ProductTypeDialog;
