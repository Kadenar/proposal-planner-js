import { Provider } from "react-redux";

import store from "../services/store.ts";

import ProposalPlanner from "./ProposalPlanner.tsx";
import { useThemeContext } from "../theme/ThemeContextProvider.tsx";
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
