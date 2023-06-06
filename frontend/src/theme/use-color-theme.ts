import { createTheme, PaletteMode } from "@mui/material";
import { useState, useMemo } from "react";
import theme from "./theme";

export const useColorTheme = () => {
  const [mode, setMode] = useState<PaletteMode>("dark");

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
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
