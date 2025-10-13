import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";

export type ThemeMode = "light" | "dark";

const STORAGE_KEY = "APP_THEME";

export function usePersistentTheme() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  // Load saved theme on start
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);

        if (saved === "light" || saved === "dark") {
          setThemeMode(saved);
          setColorScheme(saved);
        } else {
          // First open ----- default to light
          setThemeMode("light");
          setColorScheme("light");
          await AsyncStorage.setItem(STORAGE_KEY, "light");
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
        setThemeMode("light");
        setColorScheme("light");
      } finally {
      }
    })();
  }, []);

  // toggle theme & save
  const toggleTheme = async () => {
    const newMode: ThemeMode = themeMode === "light" ? "dark" : "light";
    setThemeMode(newMode);
    setColorScheme(newMode);
    await AsyncStorage.setItem(STORAGE_KEY, newMode);
  };

  // set theme manually
  const setTheme = async (mode: ThemeMode) => {
    setThemeMode(mode);
    setColorScheme(mode);
    await AsyncStorage.setItem(STORAGE_KEY, mode);
  };

  return {
    themeMode, // "light" or "dark"
    effectiveTheme: themeMode,
    toggleTheme,
    setTheme,
  };
}
