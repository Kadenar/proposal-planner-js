import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { BackEndItems, FrontEndItems } from "./SidebarItems";
import {
  DrawerHeader,
  StyledDrawer,
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
        <Box padding={1}>
          <List component="nav">
            {FrontEndItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <StyledListItem
                  key={index}
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
            <Divider sx={{ marginTop: 5, marginBottom: 5 }} />
            {BackEndItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <StyledListItem
                  key={index}
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
        </Box>
      </StyledDrawer>
    </div>
  );
}
