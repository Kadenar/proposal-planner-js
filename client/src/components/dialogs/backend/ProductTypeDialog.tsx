import { Button, Stack, TextField, Typography } from "@mui/material";
import { create } from "zustand";
import BaseDialog from "../BaseDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { StyledTextarea } from "../../StyledComponents";

interface ProductStoreActions {
  header: string;
  productType: string;
  specifications?: string[];
  onSubmit:
    | ((
        productType: string,
        specifications?: string[]
      ) => Promise<boolean | undefined>)
    | undefined;
}
interface ProductTypeStoreType extends ProductStoreActions {
  updateProductType: (productType: string) => void;
  updateSpecifications: (specifications: string[]) => void;
  close: () => void;
}

const useProductTypeStore = create<ProductTypeStoreType>((set) => ({
  header: "",
  productType: "",
  specifications: [],
  onSubmit: undefined,
  updateProductType: (productType) => set(() => ({ productType: productType })),
  updateSpecifications: (specifications) =>
    set(() => ({ specifications: specifications })),
  close: () => set({ onSubmit: undefined }),
}));

const ProductTypeDialog = () => {
  const { onSubmit, close, header } = useProductTypeStore();

  const [productType, updateProductType] = useProductTypeStore((state) => [
    state.productType,
    state.updateProductType,
  ]);

  const [specifications, updateSpecifications] = useProductTypeStore(
    (state) => [state.specifications, state.updateSpecifications]
  );

  return (
    <BaseDialog
      title={header}
      content={
        <Stack
          spacing={2}
          paddingTop={"5px"}
          sx={{ maxHeight: "50vh", overflowY: "auto" }}
        >
          <TextField
            label="Product type"
            value={productType}
            onChange={({ target: { value } }) => {
              updateProductType(value);
            }}
            autoFocus
          />
          <Typography variant="h6">Specifications</Typography>
          {!specifications || specifications.length === 0 ? (
            <Stack alignItems={"center"}>No specifications added yet.</Stack>
          ) : (
            specifications.map((spec, index) => {
              return (
                <Stack direction="row">
                  <StyledTextarea
                    minRows={3}
                    maxRows={3}
                    value={spec}
                    onChange={({ target: { value } }) => {
                      const newSpecs = [...specifications];
                      newSpecs[index] = value;
                      updateSpecifications(newSpecs);
                    }}
                    sx={{ flexGrow: 1 }}
                  />
                  <Tooltip title="Remove specification">
                    <IconButton
                      onClick={() => {
                        const newSpecs = [...specifications];
                        newSpecs.splice(index, 1);
                        updateSpecifications(newSpecs);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              );
            })
          )}
          <Button
            onClick={() => {
              const newSpecs = specifications ? [...specifications] : [];
              updateSpecifications(newSpecs.concat(""));
            }}
          >
            Add specification
          </Button>
        </Stack>
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

              const isValid = await onSubmit(productType, specifications);

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

export const productTypeDialog = ({
  header,
  productType,
  specifications,
  onSubmit,
}: ProductStoreActions) => {
  useProductTypeStore.setState({
    header,
    productType,
    specifications,
    onSubmit,
  });
};

export default ProductTypeDialog;
