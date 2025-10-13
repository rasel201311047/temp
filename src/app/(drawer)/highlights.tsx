import { useHighlightContext } from "@/src/context/HighlightContext";
import { useThemeContext } from "@/src/context/ThemeProvider";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { backarrow, search } from "../../../assets/icons/icons";
import { Colors } from "../../utils/colors";
import responsive from "../../utils/responsive";

const highlights = () => {
  const { effectiveTheme } = useThemeContext();
  const { highlights, removeHighlight } = useHighlightContext();
  const [allHighlights, setAllHighlights] = useState<any[]>([]);
  const [highlightToDelete, setHighlightToDelete] = useState<string | null>(
    null
  );
  const [pressTimers, setPressTimers] = useState<
    Record<string, NodeJS.Timeout>
  >({});

  // Load highlights from the hook
  useEffect(() => {
    if (highlights && highlights.length > 0) {
      // Sort by timestamp descending (newest first)
      const sortedHighlights = [...highlights].sort(
        (a, b) => b.timestamp - a.timestamp
      );
      setAllHighlights(sortedHighlights);
    } else {
      setAllHighlights([]);
    }
  }, [highlights]);

  const handleLongPress = (highlightId: string) => {
    setHighlightToDelete(highlightId);
  };

  const handlePressIn = (highlightId: string) => {
    // Start a timer when pressed
    const timer = setTimeout(() => handleLongPress(highlightId), 1000);

    // Store timer reference for cleanup
    setPressTimers((prev) => ({
      ...prev,
      [highlightId]: timer,
    }));
  };

  const handlePressOut = (highlightId: string) => {
    // Clear the timer if the user releases before 1 second
    if (pressTimers[highlightId]) {
      clearTimeout(pressTimers[highlightId]);

      // Remove timer from state
      setPressTimers((prev) => {
        const newTimers = { ...prev };
        delete newTimers[highlightId];
        return newTimers;
      });
    }
  };

  const handleDelete = async () => {
    if (highlightToDelete) {
      try {
        await removeHighlight(highlightToDelete);
        setHighlightToDelete(null);
        router.replace("/highlights");
        Alert.alert("Success", "Highlight deleted");
      } catch (error) {
        console.error("Error deleting highlight:", error);
        Alert.alert("Error", "Failed to delete highlight");
      }
    }
  };

  const handleCancel = () => {
    setHighlightToDelete(null);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")} ${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="w-full flex-1">
        <View
          style={{
            height: responsive.verticalScale(64),
            width: responsive.scale(335),
          }}
          className="mx-auto flex-row justify-between items-center"
        >
          <TouchableOpacity onPress={() => router.replace("/")}>
            <SvgXml
              xml={backarrow}
              width={responsive.scale(16)}
              height={responsive.verticalScale(16)}
              color={
                effectiveTheme === "light"
                  ? Colors.primaryLight
                  : Colors.primaryDark
              }
            />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center gap-2">
            <Text className="font-RobotoMidium text-2xl text-secondary-light dark:text-secondary-dark">
              Highlights
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <SvgXml
              xml={search}
              width={responsive.scale(17.78)}
              height={responsive.verticalScale(17.78)}
              color={
                effectiveTheme === "light"
                  ? Colors.primaryLight
                  : Colors.primaryDark
              }
            />
          </TouchableOpacity>
        </View>

        {/* Highlights list */}
        <ScrollView
          style={{ width: responsive.scale(335) }}
          className="mx-auto flex-1 mt-4"
        >
          {allHighlights.length === 0 ? (
            <Text className="text-center text-gray-500 dark:text-gray-400 mt-8">
              No highlights yet. Highlight verses by selecting a color in the
              verse actions menu.
            </Text>
          ) : (
            allHighlights.map((highlight) => (
              <Pressable
                key={highlight.id}
                className="mb-4 relative p-3 rounded-lg "
                onPressIn={() => handlePressIn(highlight.id)}
                onPressOut={() => handlePressOut(highlight.id)}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="font-RobotoMidium text-tertiary-light dark:text-tertiary-dark text-xl">
                    {highlight.book} {highlight.chapter}:{highlight.verse}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-300">
                    {formatDate(highlight.timestamp)}
                  </Text>
                </View>
                <Text className="font-Roboto text-sm text-wrap text-primary-dark dark:text-primary-light">
                  {highlight.text}
                </Text>

                {highlightToDelete === highlight.id && (
                  <View className="absolute inset-0 bg-secondary-dark dark:bg-secondary-light flex-row justify-between px-3 items-center rounded-lg">
                    <Text className="dark:text-primary-light text-primary-dark font-Roboto text-sm text-wrap w-3/5">
                      Do you really want to delete this highlight?
                    </Text>
                    <View className="flex-row items-center gap-2">
                      <TouchableOpacity
                        className="px-3 py-1 border border-primary-dark dark:border-primary-light rounded flex-row items-center"
                        onPress={handleDelete}
                      >
                        <Text className="text-primary-dark dark:text-primary-light ml-1 font-RobotoMidium">
                          Delete
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        className="px-3 py-1 bg-primary-dark dark:bg-primary-light rounded flex-row items-center gap-1"
                        onPress={handleCancel}
                      >
                        <Text className="text-primary-light dark:text-primary-dark font-RobotoMidium">
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </Pressable>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default highlights;
