import {
  Tab,
  TabsList,
  TabPanel,
  tabClasses,
  TextareaAutosize,
} from "@mui/base";

import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import ListItem from "@mui/material/ListItem";
import TableCell from "@mui/material/TableCell";
import Switch from "@mui/material/Switch";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  ListItemText,
  TextField,
} from "@mui/material";

const blue = {
  50: "#F0F7FF",
  100: "#C2E0FF",
  200: "#80BFFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
  800: "#004C99",
  900: "#003A75",
};

const grey = {
  50: "#f6f8fa",
  100: "#eaeef2",
  200: "#d0d7de",
  300: "#afb8c1",
  400: "#8c959f",
  500: "#6e7781",
  600: "#57606a",
  700: "#424a53",
  750: "#404040",
  800: "#32383f",
  900: "#24292f",
};

export const StyledAppBar = styled(AppBar)(({ theme }) => {
  return {
    backgroundColor: theme.palette.mode === "dark" ? blue[900] : blue[700],
    zIndex: 1000,
  };
});

export const StyledSearch = styled(TextField)(({ theme }) => {
  return {
    backgroundColor: theme.palette.mode === "dark" ? grey[900] : grey[100],
    borderRadius: ".5em",
  };
});

export const StyledSearchHeader = styled(ListItem)(({ theme }) => {
  return {
    gap: 25,
    color: theme.palette.mode === "light" ? grey[900] : "#fff",
    border: "1px solid black",
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.grey[400]
        : theme.palette.grey[900],
  };
});

export const StyledSearchItem = styled(ListItem)(({ theme }) => {
  return {
    "&:hover": {
      color: "#fff",
      cursor: "pointer",
      backgroundColor: "#1976d2",
    },
    gap: 15,
    color: theme.palette.mode === "light" ? grey[900] : "#fff",
    border: "1px solid black",
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.grey[100]
        : theme.palette.grey[800],
  };
});

export const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

const navbarHeight = 64;
const drawerWidth = 200;

// Handle styling the main content beside the drawer
export const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "authenticated",
})(({ theme, open, authenticated }) => ({
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[800],
  flexGrow: 1,
  minHeight: `calc(100vh - ${navbarHeight - 14}px)`,
  padding: theme.spacing(3),
  transition: theme.transitions.create("padding", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  paddingLeft: authenticated ? 73 : 0,
  paddingRight: authenticated ? 10 : 0,
  ...(open && {
    transition: theme.transitions.create("padding", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    paddingLeft: `calc(${drawerWidth + 8}px)`,
  }),
}));

// Handle styling of the drawer
const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  height: `calc(100% - ${navbarHeight}px)`,
  top: `${navbarHeight - 13}px`,
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const openedMixin = (theme) => ({
  width: drawerWidth,
  alignItems: "left",
  top: `${navbarHeight - 13}px`,
  height: `calc(100% - ${50}px)`,
  /*marginRight: `${drawerWidth}px`,*/
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
  backgroundColor: theme.palette.mode === "light" ? grey[400] : grey[900],
}));

export const StyledDrawerBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? grey[400] : grey[900],
}));

// Style the standard muidrawer to include sizing and transitions
export const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "active",
})(({ theme, active }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? active
        ? blue[400]
        : theme.palette.grey[100]
      : active
      ? blue[800]
      : theme.palette.grey[800];

  return {
    "&:hover": {
      backgroundColor: active
        ? backgroundColor
        : theme.palette.mode === "dark"
        ? blue[600]
        : blue[200],
    },
    color: theme.palette.mode === "light" ? grey[900] : "#fff",
    border: "1px solid black",
    borderRadius: ".5em",
    margin: "0 0 10px 0",
    backgroundColor: backgroundColor,
  };
});

export const StyledListItemText = styled(ListItemText, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create("opacity", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create("opacity", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// Style used for dialog
export const StyledBootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

// Style used for breadcrumbs on proposals / clients
export const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(4),
    marginBottom: "15px",
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

// Style used for all buttons with an icon
export const StyledIconButton = styled(IconButton)(
  ({ theme }) => `
  color: ${theme.palette.mode === "light" ? "#000" : "#fff"}
`
);

// Tab Styles for within landing pages
export const StyledTab = styled(Tab)(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  color: ${theme.palette.mode === "dark" ? "#fff" : "#000"};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: ${theme.palette.mode === "dark" ? grey[900] : grey[300]};
  width: 100%;
  padding: 10px 12px;
  margin: 6px 6px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${blue[400]};
  }

  &:focus {
    outline: 3px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  }

  &.${tabClasses.selected} {
    background-color: ${theme.palette.mode === "dark" ? "#1976d2" : "#fff"};
  }
`
);

export const StyledTabPanel = styled(TabPanel)(
  ({ theme }) => `
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    padding: 20px 12px;
    background: ${theme.palette.mode === "dark" ? grey[900] : grey[200]};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    border-radius: 12px;
    `
);

export const StyledTabsList = styled(TabsList)(
  ({ theme }) => `
    min-width: 400px;
    background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[200]};
    border-radius: 12px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    align-content: space-between;
    box-shadow: 0px 0px 5px ${
      theme.palette.mode === "dark" ? grey[900] : grey[200]
    };
    `
);

// Styled text area for specifications / summary
export const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
      font-family: IBM Plex Sans, sans-serif;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.5;
      padding: 12px;
      border-radius: 12px 12px 0 12px;
      color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
      background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
      border: 1px solid ${
        theme.palette.mode === "dark" ? grey[700] : grey[200]
      };
      box-shadow: 0px 2px 2px ${
        theme.palette.mode === "dark" ? grey[900] : grey[50]
      };
    
      &:hover {
        border-color: ${blue[400]};
      }
    
      &:focus {
        border-color: ${blue[400]};
        box-shadow: 0 0 0 3px ${
          theme.palette.mode === "dark" ? blue[500] : blue[200]
        };
      }
    
      // firefox
      &:focus-visible {
        outline: 0;
      }
    `
);

// Table cell with just bolding
export const BoldedTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
}));

export const BoldedItalicsTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  fontStyle: "italic",
}));

export const ActionsTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  fontStyle: "italic",
  width: "20px",
}));
