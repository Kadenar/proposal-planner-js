import {
  Button,
  TextField,
  Stack,
  Input,
  Autocomplete,
  InputLabel,
  FormControl,
  InputAdornment,
} from "@mui/material";
import { create } from "zustand";
import BaseDialog from "../BaseDialog";
// import FileUpload from "../FileUpload";

const useProductDialogStore = create((set) => ({
  header: "",
  guid: "",
  filters: [],
  filter: "",
  modelName: "",
  modelNum: "",
  cost: "",
  image: undefined,
  onSubmit: undefined,
  updateFilter: (filter) => set(() => ({ filter: filter })),
  updateModelName: (modelName) => set(() => ({ modelName: modelName })),
  updateModelNum: (modelNum) => set(() => ({ modelNum: modelNum })),
  updateCost: (cost) => set(() => ({ cost: cost })),
  updateImage: (image) => set(() => ({ image: image })),
  close: () => set({ onSubmit: undefined }),
}));

const ProductDialog = () => {
  const { header, onSubmit, close, guid, filters } = useProductDialogStore();

  const [filter, updateFilter] = useProductDialogStore((state) => [
    state.filter,
    state.updateFilter,
  ]);

  const [modelName, updateModelName] = useProductDialogStore((state) => [
    state.modelName,
    state.updateModelName,
  ]);

  const [modelNum, updateModelNum] = useProductDialogStore((state) => [
    state.modelNum,
    state.updateModelNum,
  ]);

  const [cost, updateCost] = useProductDialogStore((state) => [
    state.cost,
    state.updateCost,
  ]);

  // const [image, updateImage] = useProductDialogStore((state) => [
  //   state.image,
  //   state.updateImage,
  // ]);

  return (
    <BaseDialog
      title={header}
      content={
        <Stack paddingTop={3} spacing={2}>
          <Autocomplete
            disablePortal
            id="filters"
            disabled={guid !== ""}
            options={filters}
            isOptionEqualToValue={(option, value) =>
              !value || value.guid === "" || option.guid === value.guid
            }
            getOptionLabel={(option) => option.label}
            value={filter}
            renderInput={(params) => (
              <TextField {...params} label="Product type" />
            )}
            onChange={(event, value) => {
              updateFilter(value);
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
            label="Model #"
            value={modelNum || ""}
            onChange={({ target: { value } }) => {
              updateModelNum(value);
            }}
          />
          <FormControl fullWidth sx={{ m: 1 }}>
            <InputLabel htmlFor="unit-cost-amount">Unit cost</InputLabel>
            <Input
              type="number"
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
              value={cost || ""}
              onChange={({ target: { value } }) => {
                updateCost(value);
              }}
            />
          </FormControl>
          {/* <FileUpload imageUrl={image} setImageUrl={updateImage} /> */}
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

              const returnValue = await onSubmit({
                filter,
                modelName,
                modelNum,
                cost,
              });

              if (returnValue) {
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

export const productDialog = ({
  header,
  guid,
  filters,
  filter,
  modelName,
  modelNum,
  cost,
  image,
  onSubmit,
}) => {
  useProductDialogStore.setState({
    header,
    guid,
    filters,
    filter,
    modelName,
    modelNum,
    cost,
    image,
    onSubmit,
  });
};

export default ProductDialog;
