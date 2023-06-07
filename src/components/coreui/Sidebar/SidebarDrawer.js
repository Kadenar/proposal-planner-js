import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { SidebarData } from "./SidebarItems";
import { StyledListItem } from "../StyledComponents";

export default function SidebarDrawer({
  showDrawer = false,
  setShowDrawer = () => {},
}) {
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setShowDrawer(open);
  };

  return (
    <div>
      <Drawer anchor="left" open={showDrawer} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            bgcolor: "background.paper",
            boxShadow: 1,
            borderRadius: 2,
            p: 2,
            minWidth: 300,
            flexGrow: 1,
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            {SidebarData.map((item, index) => (
              <Link key={index} to={item.path}>
                <StyledListItem button key={index}>
                  <ListItemIcon sx={{ paddingLeft: "5px", marginLeft: "5px" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </StyledListItem>
              </Link>
            ))}
          </List>
        </Box>
      </Drawer>
    </div>
  );
}
