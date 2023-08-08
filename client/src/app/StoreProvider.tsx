import { Provider } from "react-redux";

import store from "../services/store.ts";

import { ThemeContextProvider } from "../theme/ThemeContextProvider";
import ProposalPlanner from "./ProposalPlanner.tsx";

const StoreProvider = () => {
  // TODO - Only for debugging
  // store.subscribe(() => {
  //   console.log(store.getState());
  // });

  return (
    <Provider store={store}>
      <ThemeContextProvider>
        <ProposalPlanner />
      </ThemeContextProvider>
    </Provider>
  );
};

export default StoreProvider;
