import { useEffect, useState } from "react";
import { batch } from "react-redux";

import { useThemeContext } from "../theme/ThemeContextProvider.tsx";
import {
  CircularProgress,
  CssBaseline,
  Stack,
  ThemeProvider,
} from "@mui/material";

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
import { initializeUsers } from "../services/slices/authenticatedSlice.ts";
import { HashRouter } from "react-router-dom";
import { AuthenticationPage } from "../pages/AuthenticationPage.tsx";

const ProposalPlanner = () => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  // Initialize the available products and filters for the system to use (loaded from back-end server)
  useEffect(() => {
    const intitData = async () => {
      setIsLoading(true);
      batch(async () => {
        await dispatch(initializeProductTypes());
        await dispatch(initializeProposals());
        await dispatch(initializeTemplates());
        await dispatch(initializeProducts());
        await dispatch(initializeClients());
        await dispatch(initializeLabors());
        await dispatch(initializeFees());
        await dispatch(initializeContacts());
        await dispatch(intializeAddresses());
        await dispatch(initializeFinancing());
        await dispatch(initializeMultipliers());
        await dispatch(initializePreferences());
        await dispatch(initializeUsers());
        setIsLoading(false);
      });
    };
    intitData();
  }, [dispatch]);

  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DialogContainer />
      {isLoading && (
        <Stack
          flexGrow={1}
          height={"100vh"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <CircularProgress size={100} />
        </Stack>
      )}
      {!isLoading && (
        <HashRouter>
          <AuthenticationPage />
        </HashRouter>
      )}
    </ThemeProvider>
  );
};

export default ProposalPlanner;
