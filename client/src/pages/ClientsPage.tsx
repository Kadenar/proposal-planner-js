import AllClientsView from "../views/client/AllClientsView";
import ClientTabsView from "../views/client/ClientTabsView";
import { useAppSelector } from "../services/store";

export default function ClientsPage() {
  const { selectedClient } = useAppSelector((state) => state.clients);
  return (
    <>
      {!selectedClient ? (
        <AllClientsView />
      ) : (
        <ClientTabsView selectedClient={selectedClient} />
      )}
      ;
    </>
  );
}
