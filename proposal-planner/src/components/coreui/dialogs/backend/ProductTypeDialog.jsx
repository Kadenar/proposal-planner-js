import { Button, Stack, TextField } from "@mui/material";
import { create } from "zustand";
import BaseDialog from "../BaseDialog";

const useProductTypeStore = create((set) => ({
  header: "",
  productType: "",
  onSubmit: undefined,
  updateProductType: (productType) => set(() => ({ productType: productType })),
  close: () => set({ onSubmit: undefined }),
}));

const ProductTypeDialog = () => {
  const { onSubmit, close, header } = useProductTypeStore();

  const [productType, updateProductType] = useProductTypeStore((state) => [
    state.productType,
    state.updateProductType,
  ]);

  return (
    <BaseDialog
      title={header}
      content={
        <div style={{ paddingTop: "5px" }}>
          <Stack spacing={2}>
            <TextField
              label="Product type"
              value={productType}
              onChange={({ target: { value } }) => {
                updateProductType(value);
              }}
              autoFocus
            />
          </Stack>
        </div>
      }
      actions={
        <>
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
        </>
      }
      show={Boolean(onSubmit)}
      close={close}
    />
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
