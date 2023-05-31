import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
} from "@material-ui/core";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { create } from "zustand";

const useConfirmDialogStore = create((set) => ({
  message: "",
  onSubmit: undefined,
  close: () => set({ onSubmit: undefined }),
}));

const ConfirmDialog = () => {
  const { message, onSubmit, close } = useConfirmDialogStore();
  return (
    <Dialog open={Boolean(onSubmit)} onClose={close} maxWidth="sm" fullWidth>
      <DialogTitle>Please confirm</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton>
          <PriorityHighIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" variant="contained" onClick={close}>
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            if (onSubmit) {
              onSubmit();
            }
            close();
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const confirmDialog = (message, onSubmit) => {
  useConfirmDialogStore.setState({
    message,
    onSubmit,
  });
};

export default ConfirmDialog;
