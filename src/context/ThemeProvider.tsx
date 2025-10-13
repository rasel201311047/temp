// src/context/ThemeProvider.tsx
import React, { createContext, useContext } from "react";
import { usePersistentTheme } from "../hook/usePersistentTheme";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const theme = usePersistentTheme();
  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used inside ThemeProvider");
  }
  return context;
};
