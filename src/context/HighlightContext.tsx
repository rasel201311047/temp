import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

// Define your highlight structure
export type Highlight = {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  color: string;
  timestamp: number;
};

type HighlightContextType = {
  highlights: Highlight[];
  addHighlight: (
    book: string,
    chapter: number,
    verse: number,
    text: string,
    color: string
  ) => Promise<void>;
  removeHighlight: (id: string) => Promise<boolean>;
  clearAllHighlights: () => Promise<void>;
};

// Create context
const HighlightContext = createContext<HighlightContextType | undefined>(
  undefined
);

// Helper functions for AsyncStorage
const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error storing data:", error);
  }
};

const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error getting data:", error);
    return null;
  }
};

export const HighlightProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  // ✅ Load highlights from storage on startup
  useEffect(() => {
    (async () => {
      const stored = await getData("highlights");
      if (stored) setHighlights(stored);
    })();
  }, []);

  // ✅ Add or update a highlight
  const addHighlight = async (
    book: string,
    chapter: number,
    verse: number,
    text: string,
    color: string
  ) => {
    const newHighlight: Highlight = {
      id: `${book}-${chapter}-${verse}`,
      book,
      chapter,
      verse,
      text,
      color,
      timestamp: Date.now(),
    };

    const updatedHighlights = [
      ...highlights.filter((h) => h.id !== newHighlight.id),
      newHighlight,
    ];

    setHighlights(updatedHighlights);
    await storeData("highlights", updatedHighlights);
  };

  // ✅ Remove highlight
  const removeHighlight = async (id: string) => {
    try {
      const updatedHighlights = highlights.filter((h) => h.id !== id);
      setHighlights(updatedHighlights);
      await storeData("highlights", updatedHighlights);
      return true;
    } catch (error) {
      console.error("Error removing highlight:", error);
      Alert.alert("Error", "Failed to remove highlight");
      return false;
    }
  };

  // ✅ Clear all highlights (optional utility)
  const clearAllHighlights = async () => {
    try {
      setHighlights([]);
      await AsyncStorage.removeItem("highlights");
    } catch (error) {
      console.error("Error clearing highlights:", error);
    }
  };

  return (
    <HighlightContext.Provider
      value={{ highlights, addHighlight, removeHighlight, clearAllHighlights }}
    >
      {children}
    </HighlightContext.Provider>
  );
};

// ✅ Custom hook for easy use
export const useHighlightContext = () => {
  const context = useContext(HighlightContext);
  if (!context) {
    throw new Error(
      "useHighlightContext must be used inside HighlightProvider"
    );
  }
  return context;
};
