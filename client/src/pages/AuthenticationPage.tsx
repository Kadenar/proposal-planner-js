import { useAppDispatch, useAppSelector } from "../services/store.ts";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import Stack from "@mui/material/Stack";
import Navbar from "../components/Sidebar/Navbar.tsx";
import { Main } from "../components/StyledComponents.jsx";

import ContactsView from "../views/ContactsView.tsx";
import MarkupsPage from "../pages/MarkupsPage.tsx";
import SoldJobsPage from "./SoldJobsPage.tsx";
import TemplatesPage from "../pages/TemplatesPage.tsx";
import FinancingOptionsView from "../views/database/FinancingOptionsView.tsx";
import LaborAndFeesView from "../views/database/LaborAndFeesView.tsx";
import AllProductTypesView from "../views/database/AllProductTypesView.tsx";
import AllProductsView from "../views/database/AllProductsView.tsx";
import CredentialsView from "../views/CredentialsView.tsx";

// PAGES
import HomePage from "./HomePage.tsx";
import ProposalsPage from "../pages/ProposalsPage.tsx";
import ClientsPage from "../pages/ClientsPage.tsx";

import { toggleSidebar } from "../services/slices/userPreferenceSlice.ts";
import { useEffect } from "react";

export const AuthenticationPage = () => {
  const dispatch = useAppDispatch();
  const { preferences } = useAppSelector((state) => state.preferences);
  const { isAuthenticated } = useAppSelector((state) => state.authentication);
  const expanded = preferences.expandedSideBar;
  const navigate = useNavigate();

  // Redirect the user to authentication page if they are not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [navigate, isAuthenticated]);

  return (
    <>
      {isAuthenticated && (
        <Navbar
          expanded={expanded}
          setExpanded={() => {
            toggleSidebar(dispatch, !expanded);
          }}
        />
      )}
      <Main open={expanded && isAuthenticated} authenticated={isAuthenticated}>
        {/* <TabContainer /> */}
        <Routes>
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/auth" element={<CredentialsView />} />
          <Route path="/clients" element={<ClientsPage />} />
          <Route path="/contacts" element={<ContactsView />} />
          <Route path="/financing" element={<FinancingOptionsView />} />
          <Route path="/labor_fees" element={<LaborAndFeesView />} />
          <Route path="/jobs" element={<SoldJobsPage />} />
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
    </>
  );
};
