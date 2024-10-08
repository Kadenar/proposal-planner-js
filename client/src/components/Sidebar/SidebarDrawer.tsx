import { Link, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { BackEndItems, DashBoardItems, FrontEndItems } from "./SidebarItems";
import {
  DrawerHeader,
  StyledDrawer,
  StyledDrawerBox,
  StyledListItem,
  StyledListItemText,
} from "../StyledComponents";
import { useKey } from "../../hooks/useKey";
import { Divider, IconButton, ListItemButton, Tooltip } from "@mui/material";

export default function SidebarDrawer({
  showDrawer,
  setShowDrawer,
}: {
  showDrawer: boolean;
  setShowDrawer: (open: boolean) => void;
}) {
  const location = useLocation();
  const toggleDrawer = (open: boolean) => (event: KeyboardEvent) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setShowDrawer(open);
  };

  useKey("ctrlo", () => {
    setShowDrawer(true);
  });

  return (
    <div>
      <StyledDrawer
        variant="permanent"
        anchor="left"
        open={showDrawer}
        onClose={toggleDrawer(false)}
        sx={{ maxWidth: showDrawer ? 250 : 5 }}
      >
        <DrawerHeader>
          <IconButton onClick={() => setShowDrawer(!showDrawer)}>
            {showDrawer ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <StyledDrawerBox flexGrow={1} paddingLeft={1} paddingRight={1}>
          <List component="nav">
            {DashBoardItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <StyledListItem
                  key={index}
                  active={item.path === location.pathname}
                  disablePadding
                  sx={{
                    display: "block",
                  }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: showDrawer ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <Tooltip title={item.title}>
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: showDrawer ? 1 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                    </Tooltip>
                    <StyledListItemText
                      primary={item.title}
                      sx={{ opacity: showDrawer ? 1 : 0 }}
                    />
                  </ListItemButton>
                </StyledListItem>
              </Link>
            ))}
            <Divider
              light
              sx={{ border: "1px solid #fff", marginTop: 2, marginBottom: 2 }}
            />
            {FrontEndItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <StyledListItem
                  key={index}
                  active={item.path === location.pathname}
                  disablePadding
                  sx={{
                    display: "block",
                  }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: showDrawer ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <Tooltip title={item.title}>
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: showDrawer ? 1 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                    </Tooltip>
                    <StyledListItemText
                      primary={item.title}
                      sx={{ opacity: showDrawer ? 1 : 0 }}
                    />
                  </ListItemButton>
                </StyledListItem>
              </Link>
            ))}
            <Divider
              sx={{ border: "1px solid #fff", marginTop: 2, marginBottom: 2 }}
            />
            {BackEndItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <StyledListItem
                  key={index}
                  active={item.path === location.pathname}
                  disablePadding
                  sx={{
                    display: "block",
                  }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: showDrawer ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <Tooltip title={item.title}>
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: showDrawer ? 1 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                    </Tooltip>
                    <StyledListItemText
                      primary={item.title}
                      sx={{ opacity: showDrawer ? 1 : 0 }}
                    />
                  </ListItemButton>
                </StyledListItem>
              </Link>
            ))}
          </List>
        </StyledDrawerBox>
      </StyledDrawer>
    </div>
  );
}
