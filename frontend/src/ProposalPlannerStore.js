import "./components/landingpages/page-styles.css";
import { useEffect } from "react";
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
} from "./data-management/backend-helpers/InteractWithBackendData";
import PricingReducer, {
  updateFilters,
  updateMultipliers,
  updateCommissions,
  updateProducts,
  updateProposals,
  updateClients,
} from "./data-management/store/Reducers";
import thunk from "redux-thunk";
import ProposalPlanner from "./ProposalPlanner";

export default function ProposalPlannerStore() {
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

  // Return our tabs
  return (
    <Provider store={store}>
      <ProposalPlanner store={store} />
    </Provider>
  );
}
