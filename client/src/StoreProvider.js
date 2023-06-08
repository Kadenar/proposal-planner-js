import { Provider } from "react-redux";

import store from "./data-management/store/store.js";

import ProposalPlanner from "./ProposalPlanner.js";
import { useThemeContext } from "./theme/ThemeContextProvider.tsx";
import { CssBaseline, ThemeProvider } from "@mui/material";

const StoreProvider = () => {
  // TODO - Only for debugging
  store.subscribe(() => {
    console.log(store.getState());
  });

  const { theme } = useThemeContext();
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ProposalPlanner />
      </ThemeProvider>
    </Provider>
  );
};

export default StoreProvider;
