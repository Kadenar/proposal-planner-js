import React from "react";
import { useSelector } from "react-redux";

import AllClientsView from "../views/client/AllClientsView";
import ClientTabsView from "../views/client/ClientTabsView";

export default function ClientsPage() {
  const { selectedClient } = useSelector((state) => state.clients);
  return <>{!selectedClient ? <AllClientsView /> : <ClientTabsView />};</>;
}
