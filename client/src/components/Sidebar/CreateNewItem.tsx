import { useAppDispatch, useAppSelector } from "../../services/store";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import DescriptionIcon from "@mui/icons-material/Description";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DraftsIcon from "@mui/icons-material/Drafts";
import AddIcon from "@mui/icons-material/Add";

import { Button, Divider, ListItemText, Menu, MenuItem } from "@mui/material";
import { useMemo, useState } from "react";
import { clientDialog } from "../dialogs/frontend/NewClientDialog";
import { addClient } from "../../services/slices/clientsSlice";
import { contactDialog } from "../dialogs/frontend/ContactDialog";
import { newProposalDialog } from "../dialogs/frontend/NewProposalDialog";
import { addProposal } from "../../services/slices/proposalsSlice";
import { addContact } from "../../services/slices/contactsSlice";
import { newTemplateDialog } from "../dialogs/frontend/NewTemplateDialog";
import { addTemplate } from "../../services/slices/templatesSlice";
import { productDialog } from "../dialogs/backend/ProductDialog";
import { addProduct } from "../../services/slices/productsSlice";

export default function CreateNewItem() {
  const dispatch = useAppDispatch();
  const { clients } = useAppSelector((state) => state.clients);
  const { templates } = useAppSelector((state) => state.templates);
  const { addresses } = useAppSelector((state) => state.addresses);
  const { filters } = useAppSelector((state) => state.filters);

  const [menuItemInfo, setMenuItemInfo] = useState<HTMLAnchorElement | null>(
    null
  );
  const open = Boolean(menuItemInfo);

  // Front end objects that can be created
  const frontEndMenuItems = useMemo(() => {
    return [
      {
        label: "Client",
        icon: <PeopleAltIcon />,
        action: () =>
          clientDialog({
            name: "",
            address: "",
            apt: "",
            city: "",
            state: "NY",
            zip: "",
            addresses,
            onSubmit: async (name, address, apt, state, city, zip) =>
              addClient(dispatch, {
                name,
                address,
                apt,
                state,
                city,
                zip,
              }),
          }),
      },
      {
        label: "Contact",
        icon: <ContactPhoneIcon />,
        action: () =>
          contactDialog({
            header: "Add new contact",
            name: "",
            email: "",
            phone: "",
            onSubmit: async (name, email, phone) =>
              addContact(dispatch, { name, email, phone }),
          }),
      },
      {
        label: "Proposal",
        icon: <DescriptionIcon />,
        action: () =>
          newProposalDialog({
            name: "",
            description: "",
            clients,
            templates,
            onSubmit: async (name, description, client_guid, template) =>
              addProposal(dispatch, {
                name,
                description,
                client_guid,
                template,
              }),
          }),
      },
      {
        label: "Template",
        icon: <DraftsIcon />,
        action: () =>
          newTemplateDialog({
            name: "",
            description: "",
            isExistingTemplate: false,
            onSubmit: async (name, description) =>
              addTemplate(dispatch, {
                name,
                description,
              }),
          }),
      },
    ];
  }, [addresses, clients, templates, dispatch]);

  // Back end objects that can be created
  const backEndMenuItems = useMemo(() => {
    return [
      {
        label: "Product",
        icon: <ShoppingCartIcon />,
        action: () =>
          productDialog({
            header: "Add product",
            filters,
            filter: filters[0],
            modelName: "",
            modelNum: "",
            description: "",
            cost: 0,
            onSubmit: async (filter, modelName, modelNum, description, cost) =>
              addProduct(dispatch, {
                filter,
                modelName,
                modelNum,
                description,
                cost,
              }),
          }),
      },
    ];
  }, [filters, dispatch]);

  return (
    <>
      <Button
        variant="contained"
        component="label"
        sx={{ spacing: "25px" }}
        onClick={
          (event: React.MouseEvent<HTMLElement>) =>
            setMenuItemInfo(event.currentTarget) // TODO Figure out why typescript isn't happy
        }
      >
        <AddIcon />
        Create
      </Button>
      <Menu
        anchorEl={menuItemInfo}
        open={open}
        onClose={() => setMenuItemInfo(null)}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {frontEndMenuItems.map((menuItem) => {
          return (
            <MenuItem
              key={menuItem.label}
              sx={{ gap: 1 }}
              onClick={() => {
                setMenuItemInfo(null);
                menuItem.action();
              }}
            >
              {menuItem.icon}
              <ListItemText>{menuItem.label}</ListItemText>
            </MenuItem>
          );
        })}
        <Divider />
        {backEndMenuItems.map((menuItem) => {
          return (
            <MenuItem
              key={menuItem.label}
              sx={{ gap: 1 }}
              onClick={() => {
                setMenuItemInfo(null);
                menuItem.action();
              }}
            >
              {menuItem.icon}
              <ListItemText>{menuItem.label}</ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
}
