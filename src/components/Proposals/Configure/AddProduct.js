import {
  addProductToTable,
  updateSelectedProduct,
} from "../../../reducers/rootReducers";
import { batch, useDispatch, useSelector } from "react-redux";

import { Button } from "@mui/material";
import React from "react";

const AddProduct = ({
  onSubmitHandler = () => {},
  showSnackBar = () => {},
}) => {
  const dispatch = useDispatch();

  // Grab our current active model from the store
  const activeModel = useSelector((state) => state.selectedProduct);

  const jobTableContents = useSelector((state) => state.jobTableContents);

  /**
   * Handle adding a new item to the table and updating redux store
   */
  function handleOnAdd() {
    // Don't add if no model selected
    if (!activeModel) {
      // Call our callback method to perform any post-processing after adding the product
      showSnackBar("Please select a product to add!", "error");
      return false;
    }

    // If this model has already been added - don't add it again
    if (jobTableContents.find((job) => job.label === activeModel.label)) {
      showSnackBar("Product has already been added.", "error");
      return false;
    }

    batch(() => {
      // Add our data to the product table
      dispatch(
        addProductToTable({
          label: activeModel.label,
          catalogNum: activeModel.catalog,
          unitCost: activeModel.cost,
          quantity: 1, // TODO -> Handle quantity later
          totalCost: activeModel.cost * 1,
        })
      );

      // Reset our selected product to blank after adding it
      dispatch(updateSelectedProduct(null));
    });

    // Call our callback method to perform any post-processing after adding the product
    showSnackBar("Successfully added product", "success");
    return true;
  }

  return (
    <>
      <Button variant="contained" onClick={handleOnAdd}>
        Submit & add another
      </Button>
      <Button
        variant="contained"
        onClick={() => {
          if (handleOnAdd()) {
            onSubmitHandler();
          }
        }}
      >
        Submit
      </Button>
    </>
  );
};

export default AddProduct;
