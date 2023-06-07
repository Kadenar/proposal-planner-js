import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import { StyledBootstrapDialog } from "../StyledComponents";

const BasicDialog = ({
  header = "Basic dialog",
  content = {},
  actions,
  open = false,
  handleClose = () => {},
}) => {
  return (
    <StyledBootstrapDialog
      PaperProps={{
        style: {
          minHeight: "50vh",
          minWidth: "300px",
          maxWidth: "700px",
          width: "50vw",
        },
      }}
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">{header}</DialogTitle>
      <DialogContent>
        <div style={{ paddingTop: "5px" }}>{content} </div>
      </DialogContent>
      <DialogActions>
        {actions ? (
          actions
        ) : (
          <Button onClick={handleClose} variant="contained" autoFocus>
            Close
          </Button>
        )}
      </DialogActions>
    </StyledBootstrapDialog>
  );
};

export default BasicDialog;
