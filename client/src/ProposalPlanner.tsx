import "./landingpages/page-styles.css";
import { useEffect } from "react";
import { batch } from "react-redux";

import { HashRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/coreui/Sidebar/Navbar.tsx";
import ConfirmDialog from "./components/coreui/dialogs/ConfirmDialog.tsx";
import ProductDialog from "./components/coreui/dialogs/backend/ProductDialog.tsx";
import ProductTypeDialog from "./components/coreui/dialogs/backend/ProductTypeDialog.tsx";
import AddProductToProposalDialog from "./components/coreui/dialogs/frontend/AddProductToProposalDialog.tsx";
import NewProposalDialog from "./components/coreui/dialogs/frontend/NewProposalDialog.tsx";
import AddScalarValueDialog from "./components/coreui/dialogs/backend/AddScalarValueDialog.tsx";
import CustomSnackbar from "./components/coreui/CustomSnackbar.tsx";

// PAGES
import HomePage from "./landingpages/HomePage.tsx";
import JobsPage from "./landingpages/JobsPage.tsx";
import ProposalsPage from "./landingpages/ProposalsPage.tsx";
import ClientsPage from "./landingpages/ClientsPage.tsx";
import DatabasePage from "./landingpages/DatabasePage.tsx";

// Dialogs
import NewClientDialog from "./components/coreui/dialogs/frontend/NewClientDialog.tsx";
import LaborDialog from "./components/coreui/dialogs/backend/LaborDialog.tsx";
import FeeDialog from "./components/coreui/dialogs/backend/FeeDialog.tsx";
import LaborsDialog from "./components/coreui/dialogs/frontend/LaborsDialog.tsx";
import FeesDialog from "./components/coreui/dialogs/frontend/FeesDialog.tsx";

// Slices
import { initializeProductTypes } from "./data-management/store/slices/productTypesSlice.ts";
import { initializeMultipliers } from "./data-management/store/slices/multipliersSlice.ts";
import { initializeCommissions } from "./data-management/store/slices/commissionsSlice.ts";
import { initializeProposals } from "./data-management/store/slices/proposalsSlice.ts";
import { initializeProducts } from "./data-management/store/slices/productsSlice.ts";
import { initializeClients } from "./data-management/store/slices/clientsSlice.ts";
import { initializeLabors } from "./data-management/store/slices/laborsSlice.ts";
import { initializeFees } from "./data-management/store/slices/feesSlice.ts";
import { useAppDispatch } from "./data-management/store/store.ts";

const ProposalPlanner = () => {
  const dispatch = useAppDispatch();

  // Initialize the available products and filters for the system to use (loaded from back-end server)
  useEffect(() => {
    console.log("*********** Loading Data from BACKEND SERVER! *********** ");
    batch(() => {
      dispatch(initializeProductTypes());
      dispatch(initializeMultipliers());
      dispatch(initializeCommissions());
      dispatch(initializeProposals());
      dispatch(initializeProducts());
      dispatch(initializeClients());
      dispatch(initializeLabors());
      dispatch(initializeFees());
    });
  }, [dispatch]);

  return (
    <>
      <CustomSnackbar />
      <NewClientDialog />
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
      <HashRouter>
        <Navbar />
        <Routes /*classname="routesContent"*/>
          {/*TODO Remove this className if it is not needed*/}
          <Route path="/" element={<HomePage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/proposals" element={<ProposalsPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/database" element={<DatabasePage />} />
        </Routes>
      </HashRouter>
    </>
  );
};

export default ProposalPlanner;
