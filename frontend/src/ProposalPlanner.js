import "./components/Pages/page-styles.css";
import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import { batch } from "react-redux";
import {
  getFlattenedProductData,
  FetchProductTypes,
  FetchMultipliers,
  FetchCommissions,
} from "./data-management/InteractWithBackendData";

import { Provider } from "react-redux";
import PricingReducer, {
  updateFilters,
  updateMultipliers,
  updateCommissions,
  updateProducts,
} from "./data-management/Reducers";
import thunk from "redux-thunk";

// PAGES
import HomePage from "./components/Pages/HomePage";
import JobsPage from "./components/Pages/JobsPage";
import Navbar from "./components/coreui/Sidebar/Navbar";
import ProposalsPage from "./components/Pages/ProposalsPage";
import ClientsPage from "./components/Pages/ClientsPage";
import DatabasePage from "./components/Pages/DatabasePage";
import ConfirmDialog from "./components/coreui/dialogs/ConfirmDialog";
import ProductDialog from "./components/coreui/dialogs/ProductDialog";
import ProductTypeDialog from "./components/coreui/dialogs/AddProductType";

export default function ProposalPlanner() {
  // Create our redux store to manage the state of our application when pricing out a job
  const store = createStore(PricingReducer, applyMiddleware(thunk));
  // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

  // TODO - Remove this when done - only temporary to log the state when it changes
  store.subscribe(() => console.log(store.getState()));

  // Initialize the available products and filters for the system to use (loaded from back-end server)
  useEffect(() => {
    const asyncFunc = async () => {
      const filterData = await FetchProductTypes();
      const multipliers = await FetchMultipliers();
      const commissions = await FetchCommissions();
      const productData = await getFlattenedProductData();

      batch(() => {
        store.dispatch(updateFilters(filterData));
        store.dispatch(updateProducts(productData));
        store.dispatch(updateMultipliers(multipliers));
        store.dispatch(updateCommissions(commissions));
      });
    };

    asyncFunc();
  }, [store]);

  // Return our tabs
  return (
    <>
      <ConfirmDialog />
      <ProductDialog />
      <ProductTypeDialog />
      <Provider store={store}>
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
      </Provider>
    </>
  );
}
