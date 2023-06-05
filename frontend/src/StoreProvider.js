import { Provider } from "react-redux";

import store from "./data-management/store/store";

import ProposalPlanner from "./ProposalPlanner";

const StoreProvider = () => {
  store.subscribe(() => {
    console.log(store.getState());
  });

  return (
    <Provider store={store}>
      <ProposalPlanner />
    </Provider>
  );
};

export default StoreProvider;
