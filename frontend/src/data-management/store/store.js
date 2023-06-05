import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./slices/themeSlice";
import productTypesSlice from "./slices/productTypesSlice";
import productsSlice from "./slices/productsSlice";
import proposalsSlice from "./slices/proposalsSlice";
import clientsSlice from "./slices/clientsSlice";
import commissionsSlice from "./slices/commissionsSlice";
import multipliersSlice from "./slices/multipliersSlice";
import selectedProposalSlice from "./slices/selectedProposalSlice";

const store = configureStore({
  reducer: {
    theme: themeSlice,
    filters: productTypesSlice,
    products: productsSlice,
    proposals: proposalsSlice,
    clients: clientsSlice,
    commissions: commissionsSlice,
    multipliers: multipliersSlice,
    selectedProposal: selectedProposalSlice,
  },
});

export default store;
