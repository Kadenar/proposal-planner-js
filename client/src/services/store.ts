import { configureStore } from "@reduxjs/toolkit";
import productTypesSlice from "./slices/productTypesSlice";
import productsSlice from "./slices/productsSlice";
import proposalsSlice from "./slices/proposalsSlice";
import templatesSlice from "./slices/templatesSlice";
import clientsSlice from "./slices/clientsSlice";
import multipliersSlice from "./slices/multipliersSlice";
import activeProposalSlice from "./slices/activeProposalSlice";
import laborsSlice from "./slices/laborsSlice";
import feesSlice from "./slices/feesSlice";
import addressesSlice from "./slices/serviceAddressInfoSlice";
import contactsSlice from "./slices/contactsSlice";
import financingSlice from "./slices/financingSlice";

import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";
import userPreferenceSlice from "./slices/userPreferenceSlice";
import tabSlice from "./slices/tabSlice";

export const useMultiplierDispatch: () => AppDispatch = useDispatch;
export const useMultiplierSelector: TypedUseSelectorHook<RootState> =
  useSelector;

const store = configureStore({
  reducer: {
    filters: productTypesSlice,
    products: productsSlice,
    templates: templatesSlice,
    proposals: proposalsSlice,
    clients: clientsSlice,
    multipliers: multipliersSlice,
    activeProposal: activeProposalSlice,
    labors: laborsSlice,
    fees: feesSlice,
    contacts: contactsSlice,
    addresses: addressesSlice,
    financing: financingSlice,
    preferences: userPreferenceSlice,
    tabs: tabSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
