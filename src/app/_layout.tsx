import { useFonts } from "expo-font";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Fonts } from "../../assets/fonts/font";
import "../../global.css";
import CustomDrawerContent from "../components/CustomDrawerContent";
import "../utils/localization";

import { HighlightProvider } from "../context/HighlightContext";
import { ThemeProvider, useThemeContext } from "../context/ThemeProvider";
export default function RootLayout() {
  const [fontsLoader] = useFonts(Fonts);

  if (!fontsLoader) return null;

  return (
    <ThemeProvider>
      <HighlightProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppDrawer />
        </GestureHandlerRootView>
      </HighlightProvider>
    </ThemeProvider>
  );
}

function AppDrawer() {
  const { effectiveTheme } = useThemeContext();

  return (
    <>
      <StatusBar style={effectiveTheme === "dark" ? "light" : "dark"} />
      <Drawer
        screenOptions={{
          drawerPosition: "left",
          headerShown: false,
          drawerStyle: {
            backgroundColor: effectiveTheme === "dark" ? "#000" : "#fff",
            width: 290,
          },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="index" />
        <Drawer.Screen name="(drawer)" />
      </Drawer>
    </>
  );
}
