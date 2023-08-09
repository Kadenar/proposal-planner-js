import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import SidebarDrawer from "./SidebarDrawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import { StyledAppBar, StyledSwitch } from "../StyledComponents";
import { useThemeContext } from "../../theme/ThemeContextProvider";
import TypeSearch from "../SearchInput";
import { Stack } from "@mui/material";
import CreateNewItem from "./CreateNewItem";

export default function Navbar({
  expanded,
  setExpanded,
}: {
  expanded: boolean;
  setExpanded: (open: boolean) => void;
}) {
  const location = useLocation();
  const { mode, toggleColorMode } = useThemeContext();

  const header = useMemo(() => {
    const pathStart = location.pathname.substring(1);
    if (pathStart !== "") {
      return (pathStart.charAt(0).toUpperCase() + pathStart.slice(1))
        .replace("_", " & ")
        .replace("/", " ");
    } else {
      return "Home";
    }
  }, [location]);

  return (
    <>
      <StyledAppBar position="sticky">
        <Toolbar variant="dense">
          <Stack direction="row" spacing={2} alignItems="center" flexGrow={1}>
            <Typography
              sx={{ minWidth: "200px" }}
              variant="h6"
              color="inherit"
              component="div"
            >
              {header}
            </Typography>
            <TypeSearch />
            <CreateNewItem />
          </Stack>

          <FormControlLabel
            control={
              <StyledSwitch
                sx={{ m: 1 }}
                value={mode === "dark"}
                checked={mode === "dark"}
              />
            }
            label="Theme"
            onChange={toggleColorMode}
          />
        </Toolbar>
        <SidebarDrawer showDrawer={expanded} setShowDrawer={setExpanded} />
      </StyledAppBar>
    </>
  );
}
