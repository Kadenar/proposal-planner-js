import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { create } from "zustand";

const useSnackbarStore = create((set) => ({
  title: "",
  show: false,
  status: undefined,
  close: () => set({ show: false }),
}));

const CustomSnackbar = () => {
  const { title, show, status, close } = useSnackbarStore();

  // Handle closing the snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    close();
  };

  return (
    <Snackbar open={show} autoHideDuration={2000} onClose={handleCloseSnackbar}>
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

export const showSnackbar = ({ title, show, status }) => {
  useSnackbarStore.setState({
    title,
    show,
    status,
  });
};

export default CustomSnackbar;
