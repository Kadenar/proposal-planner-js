import { useMemo } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import { create } from "zustand";
import { StyledBootstrapDialog } from "../../StyledComponents";

const useProductDialogStore = create((set) => ({
  onSubmit: undefined,
  filters: [],
  filter: {
    guid: "",
    label: "",
  },
  allProducts: [],
  selectedProduct: {
    guid: "",
    label: "",
  },
  qty: 0,
  quote_option: 1,
  updateFilter: (filter) => set(() => ({ filter: filter })),
  updateSelectedProduct: (selectedProduct) =>
    set(() => ({ selectedProduct: selectedProduct })),
  updateQty: (qty) => set(() => ({ qty: qty })),
  updateQuoteOption: (quote_option) =>
    set(() => ({ quote_option: quote_option })),
  close: () => set({ onSubmit: undefined }),
}));

const AddProductToProposalDialog = () => {
  const { onSubmit, close, filters, allProducts } = useProductDialogStore();

  const [filter, updateFilter] = useProductDialogStore((state) => [
    state.filter,
    state.updateFilter,
  ]);

  const [selectedProduct, updateSelectedProduct] = useProductDialogStore(
    (state) => [state.selectedProduct, state.updateSelectedProduct]
  );

  const [qty, updateQty] = useProductDialogStore((state) => [
    state.qty,
    state.updateQty,
  ]);

  const [quote_option, updateQuoteOption] = useProductDialogStore((state) => [
    state.quote_option,
    state.updateQuoteOption,
  ]);

  // Get the available products for the selected filter
  const productsForSelectedType = useMemo(() => {
    return allProducts[filter.guid] || [];
  }, [filter, allProducts]);

  // Calculate how many products are available for each filter type
  const sizesOfEachProductType = useMemo(() => {
    return Object.keys(allProducts).reduce((result, product) => {
      return {
        ...result,
        [product]: allProducts[product].length,
      };
    }, 0);
  }, [allProducts]);

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
                    sizesOfEachProductType[option.guid] || 0
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
                id="products"
                options={productsForSelectedType}
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
                value={qty}
                onChange={({ target: { value } }) => {
                  updateQty(value);
                }}
              />
              <TextField
                id="select"
                label="Quote option"
                value={quote_option}
                onChange={(e) => {
                  updateQuoteOption(e.target.value);
                }}
                select
              >
                <MenuItem value={1}>Quote 1</MenuItem>
                <MenuItem value={2}>Quote 2</MenuItem>
                <MenuItem value={3}>Quote 3</MenuItem>
                <MenuItem value={4}>Quote 4</MenuItem>
                <MenuItem value={5}>Quote 5</MenuItem>
                <MenuItem value={0}>All</MenuItem>
              </TextField>
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

              const returnValue = await onSubmit(
                selectedProduct,
                qty,
                quote_option
              );
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
  allProducts = [],
  selectedProduct = {
    guid: "",
    label: "",
  },
  qty,
  quote_option = 1,
  onSubmit,
}) => {
  useProductDialogStore.setState({
    filters,
    filter,
    allProducts,
    selectedProduct,
    qty,
    quote_option,
    onSubmit,
  });
};

export default AddProductToProposalDialog;
