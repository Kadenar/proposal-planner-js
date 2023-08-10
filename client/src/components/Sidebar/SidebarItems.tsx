import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DescriptionIcon from "@mui/icons-material/Description";
import WorkIcon from "@mui/icons-material/Work";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaidIcon from "@mui/icons-material/Paid";
import DraftsIcon from "@mui/icons-material/Drafts";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FolderIcon from "@mui/icons-material/Folder";

export const DashBoardItems = [
  {
    title: "Home",
    path: "/home",
    icon: <HomeIcon />,
  },
];

export const FrontEndItems = [
  {
    title: "Clients",
    path: "/clients",
    icon: <PeopleAltIcon />,
  },
  {
    title: "Contacts",
    path: "/contacts",
    icon: <ContactPhoneIcon />,
  },
  {
    title: "Proposals",
    path: "/proposals",
    icon: <DescriptionIcon />,
  },
  {
    title: "Sold jobs",
    path: "/jobs",
    icon: <WorkIcon />,
  },

  {
    title: "Templates",
    path: "/templates",
    icon: <DraftsIcon />,
  },
];

export const BackEndItems = [
  {
    title: "Financing",
    path: "/financing",
    icon: <AccountBalanceIcon />,
  },
  {
    title: "Labor & Fees",
    path: "/labor_fees",
    icon: <PaidIcon />,
  },
  {
    title: "Mark-ups",
    path: "/markups",
    icon: <PriceChangeIcon />,
  },
  {
    title: "Products",
    path: "/products",
    icon: <ShoppingCartIcon />,
  },
  {
    title: "Product types",
    path: "/products/types",
    icon: <FolderIcon />,
  },
];
