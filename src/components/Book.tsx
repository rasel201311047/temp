// components/Book.tsx
import HighlightText from "@sanar/react-native-highlight-text";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SvgXml } from "react-native-svg";
import Genesis from "../../assets/Data/Genesis.json";
import { plusicon, soundicon } from "../../assets/icons/icons";
import { useHighlightContext } from "../context/HighlightContext";
import { useThemeContext } from "../context/ThemeProvider";
import { useFontSettings } from "../hook/useFontSettings";
import { Colors } from "../utils/colors";
import responsive from "../utils/responsive";
import VerseActionsModal from "./VerseActionsModal";
import VoiceSelector from "./VoiceSelector";
type BookProps = {
  themeMode: string;
  onPlayAudio: (verseIndex: number) => void;
};

export default function Book({ themeMode, onPlayAudio }: BookProps) {
  const [selectedVerse, setSelectedVerse] = useState<any>(null);
  const [showActionsModal, setShowActionsModal] = useState(false);
  const { highlights } = useHighlightContext();
  const [localHighlights, setLocalHighlights] = useState<
    Record<string, string>
  >({});
  const [activeVerse, setActiveVerse] = useState<number | null>(null);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  const { fontSize, fontFamily } = useFontSettings();
  const { effectiveTheme } = useThemeContext();

  const verses = Genesis.verses;
  const book = "Genesis";
  const chapter = 1;
  // console.log(bibleData);

  // Sync local highlights with global highlights
  useEffect(() => {
    const map: Record<string, string> = {};
    highlights.forEach((h) => {
      map[h.id] = h.color;
    });
    setLocalHighlights(map);
  }, [highlights]);

  const soundplusfn = (verseId: number) => {
    setActiveVerse(verseId);
  };

  const togglePopup = (verse: any) => {
    setSelectedVerse(verse);
    setShowActionsModal(true);
  };

  const handlePlayAudio = (verseIndex: number) => {
    onPlayAudio(verseIndex);
    setSelectedVerse(null);
  };

  const handleCloseModal = () => {
    setShowActionsModal(false);
    setSelectedVerse(null);
  };

  return (
    <View className="flex-1">
      <ScrollView
        style={{
          backgroundColor:
            effectiveTheme === "dark" ? Colors.black : Colors.white,
        }}
        className="flex-1 p-4"
      >
        {verses.map((item, index) => {
          const highlightId = `${book}-${chapter}-${item.verse}`;
          const highlightColor = localHighlights[highlightId] || "transparent";

          return (
            <View key={item.verse} className="flex-row mb-4">
              {index === 0 ? (
                <>
                  <HighlightText
                    highlightStyle={{ backgroundColor: highlightColor }}
                    searchWords={
                      highlightColor !== "transparent" ? [item.text] : []
                    }
                    textToHighlight={`${item.verse} ${item.text}`}
                    style={{
                      flex: 1,
                      fontSize,
                      fontFamily,
                      textAlign: "justify",
                      color:
                        effectiveTheme === "dark" ? Colors.white : Colors.black,
                      lineHeight: fontSize * 1.5,
                      padding: 4,
                      borderRadius: 4,
                    }}
                  />
                  <View
                    className={`absolute top-1/2 left-0 right-0 -translate-y-1/2 flex-row justify-between ${
                      activeVerse === item.verse ? "" : "hidden"
                    }`}
                  >
                    <Pressable
                      onPress={() => togglePopup(item)}
                      style={{
                        width: responsive.scale(16),
                        height: responsive.verticalScale(16),
                      }}
                      className="flex-row items-center justify-center dark:bg-primary-light bg-primary-dark rounded-full"
                    >
                      <SvgXml
                        xml={plusicon}
                        width={responsive.scale(9.33)}
                        height={responsive.verticalScale(9.33)}
                        color={
                          themeMode === "light" ? Colors.white : Colors.black
                        }
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => handlePlayAudio(index)}
                      style={{
                        width: responsive.scale(16),
                        height: responsive.verticalScale(16),
                      }}
                      className="flex-row items-center justify-center dark:bg-primary-light bg-primary-dark rounded-full"
                    >
                      <SvgXml
                        xml={soundicon}
                        width={responsive.scale(11.84)}
                        height={responsive.verticalScale(9.33)}
                        color={
                          themeMode === "light" ? Colors.white : Colors.black
                        }
                      />
                    </Pressable>
                  </View>
                </>
              ) : (
                <Pressable
                  onPress={() => soundplusfn(item.verse)}
                  className="relative flex-1"
                >
                  <HighlightText
                    highlightStyle={{ backgroundColor: highlightColor }}
                    searchWords={
                      highlightColor !== "transparent" ? [item.text] : []
                    }
                    textToHighlight={`${item.verse} ${item.text}`}
                    style={{
                      fontSize,
                      fontFamily,
                      color:
                        effectiveTheme === "dark" ? Colors.white : Colors.black,
                      textAlign: "justify",
                      lineHeight: fontSize * 1.5,
                      padding: 4,
                      borderRadius: 4,
                    }}
                  />
                  <View
                    className={`absolute top-1/2 left-0 right-0 -translate-y-1/2 flex-row justify-between ${
                      activeVerse === item.verse ? "" : "hidden"
                    }`}
                  >
                    <Pressable
                      onPress={() => togglePopup(item)}
                      style={{
                        width: responsive.scale(16),
                        height: responsive.verticalScale(16),
                      }}
                      className="flex-row items-center justify-center dark:bg-primary-light bg-primary-dark rounded-full"
                    >
                      <SvgXml
                        xml={plusicon}
                        width={responsive.scale(9.33)}
                        height={responsive.verticalScale(9.33)}
                        color={
                          themeMode === "light" ? Colors.white : Colors.black
                        }
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => handlePlayAudio(index)}
                      style={{
                        width: responsive.scale(16),
                        height: responsive.verticalScale(16),
                      }}
                      className="flex-row items-center justify-center dark:bg-primary-light bg-primary-dark rounded-full"
                    >
                      <SvgXml
                        xml={soundicon}
                        width={responsive.scale(11.84)}
                        height={responsive.verticalScale(9.33)}
                        color={
                          themeMode === "light" ? Colors.white : Colors.black
                        }
                      />
                    </Pressable>
                  </View>
                </Pressable>
              )}
            </View>
          );
        })}
        <View className="h-32" />
      </ScrollView>

      {/* Verse actions modal */}
      {selectedVerse && (
        <VerseActionsModal
          visible={showActionsModal}
          onClose={handleCloseModal}
          themeMode={themeMode}
          verse={selectedVerse}
          book={book}
          chapter={chapter}
        />
      )}

      {/* Voice selector modal */}
      <VoiceSelector
        visible={showVoiceSelector}
        onClose={() => setShowVoiceSelector(false)}
      />
    </View>
  );
}
