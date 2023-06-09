import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { create } from "zustand";

interface ConfirmDialogType {
  message: string;
  onSubmit: (() => boolean) | undefined;
  close: () => void;
}

const useConfirmDialogStore = create<ConfirmDialogType>((set) => ({
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
        <Typography fontWeight={"bold"}>{message}</Typography>
      </DialogContent>
      <DialogActions>
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

            const returnValue = await onSubmit();

            if (returnValue) {
              close();
            }
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const confirmDialog = ({
  message,
  onSubmit,
}: {
  message: string;
  onSubmit: () => boolean;
}) => {
  useConfirmDialogStore.setState({
    message,
    onSubmit,
  });
};

export default ConfirmDialog;
