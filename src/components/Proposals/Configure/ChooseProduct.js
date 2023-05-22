import { Autocomplete, Stack, TextField } from "@mui/material";
import { batch, useDispatch, useSelector } from "react-redux";
import {
  updateActiveFilter,
  updateActiveProducts,
  updateSelectedProduct,
} from "../../../reducers/rootReducers";

import React from "react";

const ChooseProduct = () => {
  const dispatch = useDispatch();

  // Grab our filters from store
  const filters = useSelector((state) => state.filters);

  // Manage what our active filter is so we can sort the active models
  const selectedFilter = useSelector((state) => state.selectedFilter);

  // Grab our available products based on the currently active filter
  const allModels = useSelector((state) => state.allProducts);
  const models = useSelector((state) => state.productsForFilter);

  // Grab our current active model from the store
  const activeModel = useSelector((state) => state.selectedProduct);

  // Handle when the filter changes to update the model selection and active models as well
  function handleFilterChange(event, value) {
    // When changing filter selection update our state with the new active filter..
    // Then, reset the model name, selected model and active models available
    dispatch(updateActiveFilter(value));

    const activeModels = allModels.filter((model) => {
      return model?.name.toLowerCase() === value?.standard_value.toLowerCase();
    });

    batch(() => {
      // Update our available products
      dispatch(updateActiveProducts(activeModels));

      // Set our selected product to blank
      dispatch(updateSelectedProduct(null));
    });
  }

  // Handle when the user changes the model selection, to update the state
  function handleModelChange(event, value) {
    dispatch(updateSelectedProduct(value));
  }

  return (
    <Stack spacing={2}>
      <Autocomplete
        disablePortal
        id="filters"
        options={filters}
        value={selectedFilter}
        renderInput={(params) => (
          <TextField {...params} label="Select filter" />
        )}
        onChange={handleFilterChange}
      />

      <Autocomplete
        disablePortal
        id="models"
        options={models}
        sx={{ width: 500 }}
        value={activeModel}
        renderInput={(params) => <TextField {...params} label="Model name" />}
        onChange={handleModelChange}
      />
    </Stack>
  );
};

export default ChooseProduct;
