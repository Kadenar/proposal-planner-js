import Stack from "@mui/material/Stack";

import ContactsView from "../views/ContactsView.tsx";
import MarkupsPage from "../pages/MarkupsPage.tsx";
import TemplatesPage from "../pages/TemplatesPage.tsx";
import { Main } from "../components/StyledComponents.jsx";
import FinancingOptionsView from "../views/database/FinancingOptionsView.tsx";
import LaborAndFeesView from "../views/database/LaborAndFeesView.tsx";
import AllProductTypesView from "../views/database/AllProductTypesView.tsx";
import AllProductsView from "../views/database/AllProductsView.tsx";
import { useAppDispatch, useAppSelector } from "../services/store.ts";

import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "../components/Sidebar/Navbar.tsx";

// PAGES
import ProposalsPage from "../pages/ProposalsPage.tsx";
import ClientsPage from "../pages/ClientsPage.tsx";

import { toggleSidebar } from "../services/slices/userPreferenceSlice.ts";

export const AppContainer = () => {
  const dispatch = useAppDispatch();
  const { preferences } = useAppSelector((state) => state.preferences);
  const expanded = preferences.expandedSideBar;

  return (
    <>
      <HashRouter>
        <Navbar
          expanded={expanded}
          setExpanded={() => {
            toggleSidebar(dispatch, !expanded);
          }}
        />
        <Main open={expanded}>
          <Routes>
            <Route path="/" element={<Navigate to="/proposals" />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/contacts" element={<ContactsView />} />
            <Route path="/financing" element={<FinancingOptionsView />} />
            <Route path="/labor_fees" element={<LaborAndFeesView />} />
            <Route path="/markups" element={<MarkupsPage />} />
            <Route path="/products" element={<AllProductsView />} />
            <Route path="/products/types" element={<AllProductTypesView />} />
            <Route path="/proposals" element={<ProposalsPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route
              path="*"
              element={
                <Stack alignItems={"center"}>
                  <h2>404 Page not found</h2>
                </Stack>
              }
            />
          </Routes>
        </Main>
      </HashRouter>
    </>
  );
};
