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
import { initializeFinancing } from "../services/slices/financingSlice.ts";
import { initializeProducts } from "../services/slices/productsSlice.ts";
import { initializeContacts } from "../services/slices/contactsSlice.ts";
import { initializeClients } from "../services/slices/clientsSlice.ts";
import { initializeLabors } from "../services/slices/laborsSlice.ts";
import { initializeFees } from "../services/slices/feesSlice.ts";
import { useAppDispatch } from "../services/store.ts";
import ContactsView from "../views/ContactsView.tsx";
import ContactDialog from "../components/dialogs/frontend/ContactDialog.tsx";
import { intializeAddresses } from "../services/slices/serviceAddressInfoSlice.ts";
import FinancingDialog from "../components/dialogs/backend/FinancingDialog.tsx";

const ProposalPlanner = () => {
  const dispatch = useAppDispatch();

  // Initialize the available products and filters for the system to use (loaded from back-end server)
  useEffect(() => {
    batch(() => {
      dispatch(initializeProductTypes());
      dispatch(initializeMultipliers());
      dispatch(initializeCommissions());
      dispatch(initializeProposals());
      dispatch(initializeProducts());
      dispatch(initializeClients());
      dispatch(initializeLabors());
      dispatch(initializeFees());
      dispatch(initializeContacts());
      dispatch(intializeAddresses());
      dispatch(initializeFinancing());
    });
  }, [dispatch]);

  return (
    <>
      <CustomSnackbar />
      <NewClientDialog />
      <ContactDialog />
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
      <HashRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/proposals" element={<ProposalsPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/database" element={<DatabasePage />} />
          <Route path="/contacts" element={<ContactsView />} />
        </Routes>
      </HashRouter>
    </>
  );
};

export default ProposalPlanner;
