import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SidebarDrawer from "./SidebarDrawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import { toggleTheme } from "../../../data-management/store/slices/themeSlice";
import { StyledSwitch } from "../StyledComponents";

export default function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.theme);

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
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={setShowSidebar}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            color="inherit"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            {header}
          </Typography>
          <FormControlLabel
            control={
              <StyledSwitch sx={{ m: 1 }} value={darkMode} defaultChecked />
            }
            label="Theme"
            onChange={(e) => dispatch(toggleTheme(e.target.checked))}
          />
        </Toolbar>
      </AppBar>
      <SidebarDrawer showDrawer={sidebar} setShowDrawer={setShowSidebar} />
    </>
  );
}
