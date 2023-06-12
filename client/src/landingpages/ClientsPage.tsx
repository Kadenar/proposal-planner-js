import AllClientsView from "../views/client/AllClientsView";
import ClientTabsView from "../views/client/ClientTabsView";
import { useAppSelector } from "../data-management/store/store";

export default function ClientsPage() {
  const { selectedClient } = useAppSelector((state) => state.clients);
  return <>{!selectedClient ? <AllClientsView /> : <ClientTabsView />};</>;
}
