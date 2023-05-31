import React, { useState, useMemo } from "react";
import { Autocomplete, Stack, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateSelectedProduct } from "../../../data-management/Reducers";

const AddProductContent = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  const [selectedFilter, setSelectedFilter] = useState(filters[0]);
  const allProducts = useSelector((state) => state.allProducts);

  // Grab our available products based on the currently active filter
  const productsBasedOnFilter = useMemo(() => {
    return allProducts.filter((model) => {
      return (
        model?.category.toLowerCase() ===
        selectedFilter?.standard_value.toLowerCase()
      );
    });
  }, [selectedFilter, allProducts]);

  const selectedProduct = useSelector((state) => state.selectedProduct);

  return (
    <Stack spacing={2}>
      <Autocomplete
        disablePortal
        id="filters"
        options={filters}
        value={selectedFilter}
        renderInput={(params) => <TextField {...params} label="Product type" />}
        onChange={(event, value) => {
          setSelectedFilter(value);
          dispatch(updateSelectedProduct(null));
        }}
      />

      <Autocomplete
        disablePortal
        id="models"
        options={productsBasedOnFilter}
        value={selectedProduct}
        renderInput={(params) => <TextField {...params} label="Model name" />}
        onChange={(event, value) => {
          dispatch(updateSelectedProduct(value));
        }}
      />
    </Stack>
  );
};

export default AddProductContent;
