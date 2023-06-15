import "../styles/page-styles.css";
import { useEffect } from "react";
import { batch } from "react-redux";

import { HashRouter, Route, Routes } from "react-router-dom";

import Navbar from "../components/Sidebar/Navbar.tsx";

import CustomSnackbar from "../components/CustomSnackbar.tsx";

// PAGES
import HomePage from "../pages/HomePage.tsx";
import JobsPage from "../pages/JobsPage.tsx";
import ProposalsPage from "../pages/ProposalsPage.tsx";
import ClientsPage from "../pages/ClientsPage.tsx";
import DatabasePage from "../pages/DatabasePage.tsx";

// Dialogs
import NewClientDialog from "../components/dialogs/frontend/NewClientDialog.tsx";
import LaborDialog from "../components/dialogs/backend/LaborDialog.tsx";
import FeeDialog from "../components/dialogs/backend/FeeDialog.tsx";
import LaborsDialog from "../components/dialogs/frontend/LaborsDialog.tsx";
import FeesDialog from "../components/dialogs/frontend/FeesDialog.tsx";
import ConfirmDialog from "../components/dialogs/ConfirmDialog.tsx";
import ProductDialog from "../components/dialogs/backend/ProductDialog.tsx";
import ProductTypeDialog from "../components/dialogs/backend/ProductTypeDialog.tsx";
import AddProductToProposalDialog from "../components/dialogs/frontend/AddProductToProposalDialog.tsx";
import NewProposalDialog from "../components/dialogs/frontend/NewProposalDialog.tsx";
import AddScalarValueDialog from "../components/dialogs/backend/AddScalarValueDialog.tsx";

// Slices
import { initializeProductTypes } from "../services/slices/productTypesSlice.ts";
import { initializeMultipliers } from "../services/slices/multipliersSlice.ts";
import { initializeCommissions } from "../services/slices/commissionsSlice.ts";
import { initializeProposals } from "../services/slices/proposalsSlice.ts";
import { initializeProducts } from "../services/slices/productsSlice.ts";
import { initializeClients } from "../services/slices/clientsSlice.ts";
import { initializeLabors } from "../services/slices/laborsSlice.ts";
import { initializeFees } from "../services/slices/feesSlice.ts";
import { useAppDispatch } from "../services/store.ts";

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
