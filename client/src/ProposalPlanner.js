import "./landingpages/page-styles.css";
import { useEffect } from "react";
import { batch, useDispatch } from "react-redux";

import { HashRouter, Route, Routes } from "react-router-dom";

import Navbar from "./components/coreui/Sidebar/Navbar.js";
import ConfirmDialog from "./components/coreui/dialogs/ConfirmDialog.jsx";
import ProductDialog from "./components/coreui/dialogs/backend/ProductDialog.jsx";
import ProductTypeDialog from "./components/coreui/dialogs/backend/ProductTypeDialog.jsx";
import AddProductToProposalDialog from "./components/coreui/dialogs/frontend/AddProductToProposalDialog.jsx";
import NewProposalDialog from "./components/coreui/dialogs/frontend/NewProposalDialog.jsx";
import AddScalarValueDialog from "./components/coreui/dialogs/backend/AddScalarValueDialog.jsx";
import CustomSnackbar from "./components/coreui/CustomSnackbar.jsx";

// PAGES
import HomePage from "./landingpages/HomePage.jsx";
import JobsPage from "./landingpages/JobsPage.jsx";
import ProposalsPage from "./landingpages/ProposalsPage.jsx";
import ClientsPage from "./landingpages/ClientsPage.jsx";
import DatabasePage from "./landingpages/DatabasePage.jsx";
import NewClientDialog from "./components/coreui/dialogs/frontend/NewClientDialog.jsx";
import { initializeProductTypes } from "./data-management/store/slices/productTypesSlice.js";
import { initializeMultipliers } from "./data-management/store/slices/multipliersSlice.js";
import { initializeCommissions } from "./data-management/store/slices/commissionsSlice.js";
import { initializeProposals } from "./data-management/store/slices/proposalsSlice.js";
import { initializeProducts } from "./data-management/store/slices/productsSlice.js";
import { initializeClients } from "./data-management/store/slices/clientsSlice.js";
import { initializeLabors } from "./data-management/store/slices/laborsSlice.js";
import { initializeFees } from "./data-management/store/slices/feesSlice.js";
import LaborDialog from "./components/coreui/dialogs/backend/LaborDialog.jsx";
import FeeDialog from "./components/coreui/dialogs/backend/FeeDialog.jsx";
import LaborsDialog from "./components/coreui/dialogs/frontend/LaborsDialog.jsx";
import FeesDialog from "./components/coreui/dialogs/frontend/FeesDialog.jsx";
import SchedulePage from "./landingpages/SchedulePage.jsx";

const ProposalPlanner = () => {
  const dispatch = useDispatch();

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
        <Routes classname="routesContent">
          <Route path="/" exact element={<HomePage />} />
          <Route path="/clients" exact element={<ClientsPage />} />
          <Route path="/proposals" exact element={<ProposalsPage />} />
          <Route path="/jobs" exact element={<JobsPage />} />
          <Route path="/database" exact element={<DatabasePage />} />
          <Route path="/schedule" exact element={<SchedulePage />} />
        </Routes>
      </HashRouter>
    </>
  );
};

export default ProposalPlanner;
