import { DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { StyledBootstrapDialog } from "../StyledComponents";

const BaseDialog = ({ title, content, actions, show, close = () => {} }) => {
  return (
    <StyledBootstrapDialog
      PaperProps={{
        style: {
          minWidth: "300px",
          maxWidth: "700px",
          width: "50vw",
        },
      }}
      open={show}
      onClose={close}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>{actions}</DialogActions>
    </StyledBootstrapDialog>
  );
};

export default BaseDialog;
