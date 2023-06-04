import { combineReducers, configureStore } from "@reduxjs/toolkit";
import themeSlice from "./reducers/themeSlice";
import filtersSlice from "./reducers/filtersSlice";
import productsSlice from "./reducers/productsSlice";
import proposalsSlice from "./reducers/proposalsSlice";
import clientsSlice from "./reducers/clientsSlice";
import commissionsSlice from "./reducers/commissionsSlice";
import multipliersSlice from "./reducers/multipliersSlice";
import selectedClientSlice from "./reducers/selectedClientSlice";
import selectedProposalSlice from "./reducers/selectedProposalSlice";

const reducer = combineReducers({
  theme: themeSlice,
  filters: filtersSlice,
  products: productsSlice,
  proposals: proposalsSlice,
  clients: clientsSlice,
  commissions: commissionsSlice,
  multipliers: multipliersSlice,
  selectedClient: selectedClientSlice,
  seletedProposal: selectedProposalSlice,
});

export const store = configureStore({
  reducer,
});
