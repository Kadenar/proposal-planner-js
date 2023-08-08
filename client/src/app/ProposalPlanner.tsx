import { useEffect } from "react";
import { batch } from "react-redux";

import { useThemeContext } from "../theme/ThemeContextProvider.tsx";
import { CssBaseline, ThemeProvider } from "@mui/material";

// Slices
import { intializeAddresses } from "../services/slices/serviceAddressInfoSlice.ts";
import { initializePreferences } from "../services/slices/userPreferenceSlice.ts";
import { initializeProductTypes } from "../services/slices/productTypesSlice.ts";
import { initializeMultipliers } from "../services/slices/multipliersSlice.ts";
import { initializeTemplates } from "../services/slices/templatesSlice.ts";
import { initializeProposals } from "../services/slices/proposalsSlice.ts";
import { initializeFinancing } from "../services/slices/financingSlice.ts";
import { initializeProducts } from "../services/slices/productsSlice.ts";
import { initializeContacts } from "../services/slices/contactsSlice.ts";
import { initializeClients } from "../services/slices/clientsSlice.ts";
import { initializeLabors } from "../services/slices/laborsSlice.ts";
import { initializeFees } from "../services/slices/feesSlice.ts";
import { useAppDispatch } from "../services/store.ts";

// Content
import { DialogContainer } from "../components/dialogs/DialogContainer.tsx";
import { AppContainer } from "./AppContainer.tsx";

const ProposalPlanner = () => {
  const dispatch = useAppDispatch();

  // Initialize the available products and filters for the system to use (loaded from back-end server)
  useEffect(() => {
    batch(() => {
      dispatch(initializeProductTypes());
      dispatch(initializeProposals());
      dispatch(initializeTemplates());
      dispatch(initializeProducts());
      dispatch(initializeClients());
      dispatch(initializeLabors());
      dispatch(initializeFees());
      dispatch(initializeContacts());
      dispatch(intializeAddresses());
      dispatch(initializeFinancing());
      dispatch(initializeMultipliers());
      dispatch(initializePreferences());
    });
  }, [dispatch]);

  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DialogContainer />
      <AppContainer />
    </ThemeProvider>
  );
};

export default ProposalPlanner;
