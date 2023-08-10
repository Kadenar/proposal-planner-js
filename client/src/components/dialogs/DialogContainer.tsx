import CustomSnackbar from "../../components/CustomSnackbar.tsx";

// Dialogs
import NewClientDialog from "./frontend/NewClientDialog.tsx";
import LaborDialog from "./backend/LaborDialog.tsx";
import FeeDialog from "./backend/FeeDialog.tsx";
import LaborsDialog from "./frontend/LaborsDialog.tsx";
import FeesDialog from "./frontend/FeesDialog.tsx";
import ConfirmDialog from "./ConfirmDialog.tsx";
import ProductDialog from "./backend/ProductDialog.tsx";
import ProductTypeDialog from "./backend/ProductTypeDialog.tsx";
import AddProductToProposalDialog from "./frontend/AddProductToProposalDialog.tsx";
import NewProposalDialog from "./frontend/NewProposalDialog.tsx";
import AddScalarValueDialog from "./backend/AddScalarValueDialog.tsx";
import ContactDialog from "./frontend/ContactDialog.tsx";
import FinancingDialog from "./backend/FinancingDialog.tsx";
import NewTemplateDialog from "./frontend/NewTemplateDialog.tsx";
import ImportSpecificationDialog from "./backend/ImportSpecificationsDialog.tsx";
import SoldJobDialog from "./frontend/SoldJobDialog.tsx";

export const DialogContainer = () => {
  return (
    <>
      <CustomSnackbar />
      <NewClientDialog />
      <ContactDialog />
      <NewTemplateDialog />
      <NewProposalDialog />
      <ConfirmDialog />
      <ProductDialog />
      <ProductTypeDialog />
      <AddProductToProposalDialog />
      <AddScalarValueDialog />
      <LaborDialog />
      <LaborsDialog />
      <FeeDialog />
      <FeesDialog />
      <FinancingDialog />
      <ImportSpecificationDialog />
      <SoldJobDialog />
    </>
  );
};
