import { useMemo } from "react";

import { createTheme, PaletteMode } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../services/store";
import { toggleDarkMode } from "../services/slices/userPreferenceSlice";

const theme = {
  palette: {
    mode: "dark",
  },
};

export const useColorTheme = () => {
  const dispatch = useAppDispatch();
  const { preferences } = useAppSelector((state) => state.preferences);

  const mode: PaletteMode = preferences.darkMode ? "dark" : "light";

  const toggleColorMode = () => {
    toggleDarkMode(dispatch, !preferences.darkMode);
  };

  const modifiedTheme = useMemo(() => {
    return createTheme({
      ...theme,
      palette: {
        ...theme.palette,
        mode,
      },
    });
  }, [mode]);

  return {
    mode,
    theme: modifiedTheme,
    toggleColorMode,
  };
};
