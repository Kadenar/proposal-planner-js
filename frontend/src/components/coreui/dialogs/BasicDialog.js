import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
// import Slide from "@mui/material/Slide";
import { styled } from "@mui/material/styles";

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="down" ref={ref} {...props} />;
// });

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BasicDialog = ({
  header = "Basic dialog",
  content = {},
  actions,
  open = false,
  handleClose = () => {},
}) => {
  return (
    <BootstrapDialog
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
    </BootstrapDialog>
  );
};

export default BasicDialog;
