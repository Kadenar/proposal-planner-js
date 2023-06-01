import { showSnackbar } from "../components/coreui/CustomSnackbar";

export async function updateStore({
  dispatch,
  dbOperation = async () => {},
  methodToDispatch = () => {},
  dataKey = "",
  successMessage = "Success!",
}) {
  const response = await dbOperation();

  if (!response) {
    showSnackbar({
      title: "Some random db/io operation is failing?!?!!?",
      show: true,
      status: "error",
    });
    return;
  }

  if (response.status === 200) {
    dispatch(methodToDispatch(response.data[dataKey]));
    showSnackbar({ title: successMessage, show: true, status: "success" });
    return true;
  }

  showSnackbar({ title: response.data.message, show: true, status: "error" });
  return false;
}
