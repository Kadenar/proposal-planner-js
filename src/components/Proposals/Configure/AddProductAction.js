import { addProductToTable } from "../../../data-management/Reducers";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@mui/material";
import React from "react";

const AddProductAction = ({
  onSubmitHandler = () => {},
  showSnackBar = () => {},
}) => {
  const dispatch = useDispatch();
  const activeModel = useSelector((state) => state.selectedProduct);
  const jobTableContents = useSelector((state) => state.jobTableContents);

  /**
   * Handle adding a new item to the table and updating redux store
   */
  function handleOnAdd() {
    if (!activeModel) {
      showSnackBar("Please select a product to add!", "error");
      return false;
    }

    if (jobTableContents.find((job) => job.label === activeModel.label)) {
      showSnackBar("Product has already been added.", "error");
      return false;
    }

    // Add data to the product table
    dispatch(
      addProductToTable({
        label: activeModel.label,
        catalogNum: activeModel.catalog,
        unitCost: activeModel.cost,
        quantity: 1, // TODO -> Handle quantity later
        totalCost: activeModel.cost * 1,
      })
    );

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

export default AddProductAction;
