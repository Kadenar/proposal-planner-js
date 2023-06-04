import "./components/landingpages/page-styles.css";
import { useEffect, useMemo } from "react";
// import { configureStore } from "@reduxjs/toolkit";
import { applyMiddleware, createStore } from "redux";
import { batch, Provider } from "react-redux";
import {
  fetchProducts,
  fetchMultipliers,
  fetchCommissions,
  fetchProductTypes,
  fetchProposals,
  fetchClients,
} from "./data-management/backend-helpers/InteractWithBackendData.ts";
import PricingReducer, {
  updateFilters,
  updateMultipliers,
  updateCommissions,
  updateProducts,
  updateProposals,
  updateClients,
} from "./data-management/store/Reducers";
import thunk from "redux-thunk";

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

const ProposalPlanner = () => {
  // Create our redux store to manage the state of our application when pricing out a job
  const store = createStore(PricingReducer, applyMiddleware(thunk));
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

  // TODO - Remove this when done - only temporary to log the state when it changes
  store.subscribe(() => console.log(store.getState()));

  // Initialize the available products and filters for the system to use (loaded from back-end server)
  useEffect(() => {
    const asyncFunc = async () => {
      const productData = await fetchProducts();
      const filterData = await fetchProductTypes();
      const multipliers = await fetchMultipliers();
      const commissions = await fetchCommissions();
      const proposals = await fetchProposals();
      const clients = await fetchClients();

      batch(() => {
        store.dispatch(updateFilters(filterData));
        store.dispatch(updateProducts(productData));
        store.dispatch(updateMultipliers(multipliers));
        store.dispatch(updateCommissions(commissions));
        store.dispatch(updateProposals(proposals));
        store.dispatch(updateClients(clients));
      });
    };

    asyncFunc();
  }, [store]);
  const themeColor = "dark";

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeColor,
        },
      }),
    [themeColor]
  );

  return (
    <Provider store={store}>
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
    </Provider>
  );
};

export default ProposalPlanner;
