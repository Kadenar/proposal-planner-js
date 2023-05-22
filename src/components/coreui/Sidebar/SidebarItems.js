import React from "react";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Clients",
    path: "/clients",
    icon: <FaIcons.FaHouseUser />,
    cName: "nav-text",
  },
  {
    title: "Proposals",
    path: "/proposals",
    icon: <FaIcons.FaMoneyBill />,
    cName: "nav-text",
  },
  {
    title: "Jobs",
    path: "/jobs",
    icon: <IoIcons.IoMdPeople />,
    cName: "nav-text",
  },
  {
    title: "Equipment pricing",
    path: "/products",
    icon: <IoIcons.IoMdDocument />,
    cName: "nav-text",
  },
];
