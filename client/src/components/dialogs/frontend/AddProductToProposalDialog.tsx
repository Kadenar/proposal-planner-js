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
import {
  ProductObject,
  ProductTypeObject,
  PsuedoObjectOfProducts,
} from "../../../middleware/Interfaces";

interface ProductDialogActions {
  filters: ProductTypeObject[];
  filter: ProductTypeObject | null;
  allProducts: PsuedoObjectOfProducts;
  selectedProduct: ProductObject | null;
  qty: number;
  quote_option: number;
  onSubmit:
    | ((
        selectedProduct: ProductObject | null,
        qty: number,
        quote_option: number
      ) => Promise<boolean | undefined>)
    | undefined;
}
interface ProductDialogType extends ProductDialogActions {
  updateFilter: (filter: ProductTypeObject | null) => void;
  updateSelectedProduct: (selectedProduct: ProductObject | null) => void;
  updateQty: (qty: number) => void;
  updateQuoteOption: (quote_option: number) => void;
  close: () => void;
}

const useProductDialogStore = create<ProductDialogType>((set) => ({
  filters: [],
  filter: {
    guid: "",
    label: "",
  },
  allProducts: {},
  selectedProduct: {
    guid: "",
    model: "",
    modelNum: "",
    cost: 0,
  },
  qty: 0,
  quote_option: 1,
  onSubmit: undefined,
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
  const productsForSelectedType = useMemo<ProductObject[]>(() => {
    if (!filter) {
      return [];
    }

    return allProducts[filter.guid] || [];
  }, [filter, allProducts]);

  // Calculate how many products are available for each filter type
  const sizesOfEachProductType = useMemo<Record<string, number>>(() => {
    return Object.keys(allProducts).reduce((result, product) => {
      return {
        ...result,
        [product]: allProducts[product].length,
      };
    }, {} as Record<string, number>);
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
                onChange={(_, value) => {
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
                onChange={(_, value) => {
                  updateSelectedProduct(value);
                }}
              />
              <TextField
                label="Quantity"
                type="number"
                value={qty}
                onChange={({ target: { value } }) => {
                  updateQty(Number(value));
                }}
              />
              <TextField
                id="select"
                label="Quote option"
                value={quote_option}
                onChange={(e) => {
                  updateQuoteOption(Number(e.target.value));
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
  allProducts = {},
  selectedProduct = {
    guid: "",
    model: "",
    modelNum: "",
    cost: 0,
  },
  qty = 0,
  quote_option = 1,
  onSubmit,
}: ProductDialogActions) => {
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
