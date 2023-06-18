import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SidebarDrawer from "./SidebarDrawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import { StyledSwitch } from "../StyledComponents";
import { useThemeContext } from "../../theme/ThemeContextProvider";
import TypeSearch from "../SearchInput";
import { Stack } from "@mui/material";

export default function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const location = useLocation();
  const { mode, toggleColorMode } = useThemeContext();

  const header = useMemo(() => {
    const pathStart = location.pathname.substring(1);
    if (pathStart !== "") {
      return pathStart.charAt(0).toUpperCase() + pathStart.slice(1);
    } else {
      return "Home";
    }
  }, [location]);

  const setShowSidebar = () => setSidebar(!sidebar);
  return (
    <>
      <AppBar position="static">
        <Toolbar variant="dense">
          <Stack direction="row" spacing={2} alignItems="center" flexGrow={1}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={setShowSidebar}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div">
              {header}
            </Typography>
            <TypeSearch />
          </Stack>
          <FormControlLabel
            control={
              <StyledSwitch
                sx={{ m: 1 }}
                value={mode === "dark"}
                defaultChecked
              />
            }
            label="Theme"
            onChange={toggleColorMode}
          />
        </Toolbar>
      </AppBar>
      <SidebarDrawer showDrawer={sidebar} setShowDrawer={setShowSidebar} />
    </>
  );
}
