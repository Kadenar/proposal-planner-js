import { useSelector } from "react-redux";

import AllClientsView from "../views/client/AllClientsView";
import ClientTabsView from "../views/client/ClientTabsView";
import { ReduxStore } from "../data-management/middleware/Interfaces";

export default function ClientsPage() {
  const { selectedClient } = useSelector((state: ReduxStore) => state.clients);
  return <>{!selectedClient ? <AllClientsView /> : <ClientTabsView />};</>;
}
