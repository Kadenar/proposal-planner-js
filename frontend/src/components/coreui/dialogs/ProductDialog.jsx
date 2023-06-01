import {
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
import { StyledBootstrapDialog } from "../StyledComponents";

const useProductDialogStore = create((set) => ({
  header: "",
  guid: "",
  onSubmit: undefined,
  selectedFilter: "",
  modelName: "",
  catalogNum: "",
  unitCost: "",
  updateSelectedFilter: (selectedFilter) =>
    set(() => ({ selectedFilter: selectedFilter })),
  updateModelName: (modelName) => set(() => ({ modelName: modelName })),
  updateCatalogNum: (catalogNum) => set(() => ({ catalogNum: catalogNum })),
  updateUnitCost: (unitCost) => set(() => ({ unitCost: unitCost })),
  close: () => set({ onSubmit: undefined }),
}));

const ProductDialog = () => {
  const { header, onSubmit, close, guid, filters } = useProductDialogStore();

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
        <DialogTitle>{header}</DialogTitle>
        <DialogContent>
          <div style={{ paddingTop: "5px" }}>
            <Stack spacing={2}>
              <Autocomplete
                disablePortal
                id="filters"
                disabled={guid !== ""}
                options={filters}
                getOptionLabel={(option) => option.label}
                getOptionSelected={(option, value) => {
                  return option.standard_value === value.standard_value;
                }}
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
            onClick={async () => {
              if (!onSubmit) {
                close();
                return;
              }

              const returnValue = await onSubmit(
                selectedFilter,
                modelName,
                catalogNum,
                unitCost
              );

              if (returnValue) {
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

export const productDialog = ({
  header,
  guid,
  filters,
  selectedFilter,
  modelName,
  catalogNum,
  unitCost,
  onSubmit,
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
  });
};

export default ProductDialog;
