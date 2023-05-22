import React, { useState } from "react";

import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SidebarDrawer from "./SidebarDrawer";
import { Toolbar } from "@material-ui/core";
import Typography from "@mui/material/Typography";
import { useLocation } from "react-router-dom";

// DATA FILE

export default function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const location = useLocation();

  // Hacky solution for setting the header in the appbar for now
  let header = location.pathname.substring(1);

  if (header !== "") {
    header = header.charAt(0).toUpperCase() + header.slice(1);
  } else {
    header = "Home";
  }

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
          <Typography variant="h6" color="inherit" component="div">
            {header}
          </Typography>
        </Toolbar>
      </AppBar>
      <SidebarDrawer showDrawer={sidebar} setShowDrawer={setShowSidebar} />
    </>
  );
}
