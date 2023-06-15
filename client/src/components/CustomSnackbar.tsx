import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";
import { create } from "zustand";

interface SnackbarActions {
  title: string;
  show: boolean;
  status: AlertColor | undefined;
}

interface SnackbarType extends SnackbarActions {
  close: () => void;
}
const useSnackbarStore = create<SnackbarType>((set) => ({
  title: "",
  show: false,
  status: undefined,
  close: () => set({ show: false }),
}));

const CustomSnackbar = () => {
  const { title, show, status, close } = useSnackbarStore();

  // Handle closing the snackbar
  const handleCloseSnackbar = (
    _: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    close();
  };

  return (
    <Snackbar open={show} autoHideDuration={3500} onClose={handleCloseSnackbar}>
      <Alert
        onClose={handleCloseSnackbar}
        severity={status}
        sx={{ width: "100%" }}
      >
        {title}
      </Alert>
    </Snackbar>
  );
};

export const showSnackbar = ({ title, show, status }: SnackbarActions) => {
  useSnackbarStore.setState({
    title,
    show,
    status,
  });
};

export default CustomSnackbar;
