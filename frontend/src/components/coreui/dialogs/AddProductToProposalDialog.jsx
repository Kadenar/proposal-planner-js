import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  Autocomplete,
} from "@mui/material";
import { create } from "zustand";
import { StyledBootstrapDialog } from "../StyledComponents";

const useProductDialogStore = create((set) => ({
  onSubmit: undefined,
  filters: [],
  selectedFilter: "",
  allModels: [],
  selectedProduct: {},
  quantity: 0,
  updateSelectedFilter: (selectedFilter) =>
    set(() => ({ selectedFilter: selectedFilter })),
  updateSelectedProduct: (selectedProduct) =>
    set(() => ({ selectedProduct: selectedProduct })),
  updateQuantity: (quantity) => set(() => ({ quantity: quantity })),
  close: () => set({ onSubmit: undefined }),
}));

const AddProductToProposalDialog = () => {
  const { onSubmit, close, filters, allModels } = useProductDialogStore();

  const [selectedFilter, updateSelectedFilter] = useProductDialogStore(
    (state) => [state.selectedFilter, state.updateSelectedFilter]
  );

  const [selectedProduct, updateSelectedProduct] = useProductDialogStore(
    (state) => [state.selectedProduct, state.updateSelectedProduct]
  );

  const [quantity, updateQuantity] = useProductDialogStore((state) => [
    state.quantity,
    state.updateQuantity,
  ]);

  const models = allModels[selectedFilter.standard_value] || [];

  return (
    <>
      <StyledBootstrapDialog
        PaperProps={{
          style: {
            minHeight: "50vh",
            minWidth: "300px",
            maxWidth: "700px",
            width: "50vw",
          },
        }}
        open={Boolean(onSubmit)}
        onClose={close}
        maxWidth="sm"
        fullWidth
        scroll={"paper"}
      >
        <DialogTitle>Add product to this proposal</DialogTitle>
        <DialogContent>
          <div style={{ paddingTop: "5px" }}>
            <Stack spacing={2}>
              <Autocomplete
                disablePortal
                id="filters"
                getOptionLabel={(option) => option.label}
                getOptionSelected={(option, value) => {
                  return option.guid === value.guid;
                }}
                options={filters}
                value={selectedFilter}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <TextField {...params} label="Product type" />
                  </div>
                )}
                onChange={(event, value) => {
                  updateSelectedFilter(value);
                  updateSelectedProduct(undefined);
                }}
              />
              <Autocomplete
                disablePortal
                id="models"
                options={models}
                getOptionLabel={(option) => option.model}
                getOptionSelected={(option, value) => {
                  return option.guid === value.guid;
                }}
                value={selectedProduct}
                renderInput={(params) => (
                  <TextField {...params} label="Model name" />
                )}
                onChange={(event, value) => {
                  updateSelectedProduct(value);
                }}
              />
              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={({ target: { value } }) => {
                  updateQuantity(value);
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

              const returnValue = await onSubmit(selectedProduct, quantity);
              if (returnValue) {
                close();
              }

              return returnValue;
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </StyledBootstrapDialog>
    </>
  );
};

export const addProductToProposalDialog = ({
  filters = [],
  selectedFilter,
  allModels = [],
  selectedProduct,
  quantity,
  onSubmit,
}) => {
  useProductDialogStore.setState({
    filters,
    selectedFilter,
    allModels,
    selectedProduct,
    quantity,
    onSubmit,
  });
};

export default AddProductToProposalDialog;
