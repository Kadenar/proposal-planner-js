import "./components/landingpages/page-styles.css";
import { useEffect } from "react";
import { batch, useDispatch } from "react-redux";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Navbar from "./components/coreui/Sidebar/Navbar";
import ConfirmDialog from "./components/coreui/dialogs/ConfirmDialog";
import ProductDialog from "./components/coreui/dialogs/backend/ProductDialog";
import ProductTypeDialog from "./components/coreui/dialogs/backend/ProductTypeDialog";
import AddProductToProposalDialog from "./components/coreui/dialogs/frontend/AddProductToProposalDialog";
import NewProposalDialog from "./components/coreui/dialogs/frontend/NewProposalDialog";
import AddScalarValueDialog from "./components/coreui/dialogs/backend/AddScalarValueDialog";
import CustomSnackbar from "./components/coreui/CustomSnackbar";

// PAGES
import HomePage from "./components/landingpages/HomePage";
import JobsPage from "./components/landingpages/JobsPage";
import ProposalsPage from "./components/landingpages/ProposalsPage";
import ClientsPage from "./components/landingpages/ClientsPage";
import DatabasePage from "./components/landingpages/DatabasePage";
import NewClientDialog from "./components/coreui/dialogs/frontend/NewClientDialog";
import { initializeProductTypes } from "./data-management/store/slices/productTypesSlice";
import { initializeMultipliers } from "./data-management/store/slices/multipliersSlice";
import { initializeCommissions } from "./data-management/store/slices/commissionsSlice";
import { initializeProposals } from "./data-management/store/slices/proposalsSlice";
import { initializeProducts } from "./data-management/store/slices/productsSlice";
import { initializeClients } from "./data-management/store/slices/clientsSlice";
import { initializeLabors } from "./data-management/store/slices/laborsSlice";
import { initializeFees } from "./data-management/store/slices/feesSlice";
import LaborDialog from "./components/coreui/dialogs/backend/LaborDialog.jsx";
import FeeDialog from "./components/coreui/dialogs/backend/FeeDialog.jsx";
import LaborsDialog from "./components/coreui/dialogs/frontend/LaborsDialog.jsx";
import FeesDialog from "./components/coreui/dialogs/frontend/FeesDialog.jsx";

const ProposalPlanner = () => {
  const dispatch = useDispatch();

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
      <Router>
        <Navbar />
        <Routes classname="routesContent">
          <Route path="/" exact element={<HomePage />} />
          <Route path="/clients" exact element={<ClientsPage />} />
          <Route path="/proposals" exact element={<ProposalsPage />} />
          <Route path="/jobs" exact element={<JobsPage />} />
          <Route path="/database" exact element={<DatabasePage />} />
        </Routes>
      </Router>
    </>
  );
};

export default ProposalPlanner;
