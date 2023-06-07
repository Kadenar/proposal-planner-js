import { configureStore } from "@reduxjs/toolkit";
import productTypesSlice from "./slices/productTypesSlice";
import productsSlice from "./slices/productsSlice";
import proposalsSlice from "./slices/proposalsSlice";
import clientsSlice from "./slices/clientsSlice";
import commissionsSlice from "./slices/commissionsSlice";
import multipliersSlice from "./slices/multipliersSlice";
import selectedProposalSlice from "./slices/selectedProposalSlice";
import laborsSlice from "./slices/laborsSlice";
import feesSlice from "./slices/feesSlice";

const store = configureStore({
  reducer: {
    filters: productTypesSlice,
    products: productsSlice,
    proposals: proposalsSlice,
    clients: clientsSlice,
    commissions: commissionsSlice,
    multipliers: multipliersSlice,
    selectedProposal: selectedProposalSlice,
    labors: laborsSlice,
    fees: feesSlice,
  },
});

export default store;
