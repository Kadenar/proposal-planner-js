import { DialogTitle, DialogContent, DialogActions } from "@mui/material";

import { StyledBootstrapDialog } from "../StyledComponents";
import { ReactNode } from "react";

const BaseDialog = ({
  title,
  content,
  actions,
  show,
  close = () => {},
}: {
  title: string;
  content: ReactNode;
  actions: ReactNode;
  show: boolean;
  close: () => void;
}) => {
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
