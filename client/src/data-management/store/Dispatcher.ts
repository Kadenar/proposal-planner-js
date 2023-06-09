import { Dispatch } from "@reduxjs/toolkit";
import { showSnackbar } from "../../components/coreui/CustomSnackbar";
import { AxiosResponse } from "axios";

export async function updateStore({
  dispatch,
  dbOperation,
  methodToDispatch = () => {},
  dataKey,
  successMessage,
}: {
  dispatch: Dispatch;
  dbOperation: (...args: any[]) => Promise<any> | AxiosResponse<any, any>;
  methodToDispatch: (...args: any[]) => any;
  dataKey: string;
  successMessage: string;
}) {
  const response = await dbOperation();

  if (!response) {
    showSnackbar({
      title: "Database operation returned no response.",
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
