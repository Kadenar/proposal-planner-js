import "./components/landingpages/page-styles.css";
import { useMemo, useEffect } from "react";
import { useSelector, batch, useDispatch } from "react-redux";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Navbar from "./components/coreui/Sidebar/Navbar";
import ConfirmDialog from "./components/coreui/dialogs/ConfirmDialog";
import ProductDialog from "./components/coreui/dialogs/ProductDialog";
import ProductTypeDialog from "./components/coreui/dialogs/ProductTypeDialog";
import AddProductToProposalDialog from "./components/coreui/dialogs/AddProductToProposalDialog";
import NewProposalDialog from "./components/coreui/dialogs/NewProposalDialog";
import CustomSnackbar from "./components/coreui/CustomSnackbar";

// PAGES
import HomePage from "./components/landingpages/HomePage";
import JobsPage from "./components/landingpages/JobsPage";
import ProposalsPage from "./components/landingpages/ProposalsPage";
import ClientsPage from "./components/landingpages/ClientsPage";
import DatabasePage from "./components/landingpages/DatabasePage";
import NewClientDialog from "./components/coreui/dialogs/NewClientDialog";
import { initializeProductTypes } from "./data-management/store/slices/productTypesSlice";
import { initializeMultipliers } from "./data-management/store/slices/multipliersSlice";
import { initializeCommissions } from "./data-management/store/slices/commissionsSlice";
import { initializeProposals } from "./data-management/store/slices/proposalsSlice";
import { initializeProducts } from "./data-management/store/slices/productsSlice";
import { initializeClients } from "./data-management/store/slices/clientsSlice";

const ProposalPlanner = () => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);

  // Initialize the available products and filters for the system to use (loaded from back-end server)
  useEffect(() => {
    batch(() => {
      dispatch(initializeProductTypes());
      dispatch(initializeMultipliers());
      dispatch(initializeCommissions());
      dispatch(initializeProposals());
      dispatch(initializeProducts());
      dispatch(initializeClients());
    });
  }, [dispatch]);

  const theme = useMemo(() => {
    return () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      });
  }, [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CustomSnackbar />
      <NewClientDialog />
      <NewProposalDialog />
      <ConfirmDialog />
      <ProductDialog />
      <ProductTypeDialog />
      <AddProductToProposalDialog />
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
    </ThemeProvider>
  );
};

export default ProposalPlanner;
