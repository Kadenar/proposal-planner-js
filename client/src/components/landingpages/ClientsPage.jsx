import React from "react";
import { useSelector } from "react-redux";

import AllClientsView from "../client-ui/AllClientsView";
import ClientTabsView from "../client-ui/ClientTabsView";

export default function ClientsPage() {
  const { selectedClient } = useSelector((state) => state.clients);
  return <>{!selectedClient ? <AllClientsView /> : <ClientTabsView />};</>;
}
