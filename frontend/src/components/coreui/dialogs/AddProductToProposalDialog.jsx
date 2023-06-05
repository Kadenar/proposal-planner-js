import { useMemo } from "react";
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
  filter: {
    guid: "",
    label: "",
  },
  allModels: [],
  selectedProduct: {
    guid: "",
    label: "",
  },
  quantity: 0,
  updateFilter: (filter) => set(() => ({ filter: filter })),
  updateSelectedProduct: (selectedProduct) =>
    set(() => ({ selectedProduct: selectedProduct })),
  updateQuantity: (quantity) => set(() => ({ quantity: quantity })),
  close: () => set({ onSubmit: undefined }),
}));

const AddProductToProposalDialog = () => {
  const { onSubmit, close, filters, allModels } = useProductDialogStore();

  const [filter, updateFilter] = useProductDialogStore((state) => [
    state.filter,
    state.updateFilter,
  ]);

  const [selectedProduct, updateSelectedProduct] = useProductDialogStore(
    (state) => [state.selectedProduct, state.updateSelectedProduct]
  );

  const [quantity, updateQuantity] = useProductDialogStore((state) => [
    state.quantity,
    state.updateQuantity,
  ]);

  // Get the available models for the selected filter
  const models = useMemo(() => {
    return allModels[filter.guid] || [];
  }, [filter, allModels]);

  // Calculate how many products are available for each filter type
  const sizesOfModels = useMemo(() => {
    const keyedSizes = {};
    Object.keys(allModels).forEach((model) => {
      keyedSizes[model] = allModels[model].length;
    });
    return keyedSizes;
  }, [allModels]);

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
                getOptionLabel={(option) =>
                  `${option.label} - (${
                    sizesOfModels[option.guid] || 0
                  } products)` || ""
                }
                isOptionEqualToValue={(option, value) =>
                  !value || value.guid === "" || option.guid === value.guid
                }
                options={filters}
                value={filter}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <TextField {...params} label="Product type" />
                  </div>
                )}
                onChange={(event, value) => {
                  updateFilter(value);
                  updateSelectedProduct(null);
                }}
              />
              <Autocomplete
                disablePortal
                id="models"
                options={models}
                getOptionLabel={(option) => option.model || ""}
                isOptionEqualToValue={(option, value) =>
                  !value || value.guid === "" || option.guid === value.guid
                }
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
  filter,
  allModels = [],
  selectedProduct = {
    guid: "",
    label: "",
  },
  quantity,
  onSubmit,
}) => {
  useProductDialogStore.setState({
    filters,
    filter,
    allModels,
    selectedProduct,
    quantity,
    onSubmit,
  });
};

export default AddProductToProposalDialog;
