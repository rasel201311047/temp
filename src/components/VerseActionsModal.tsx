import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { bookmark, copy, notes as notesIcon } from "../../assets/icons/icons";
import { useHighlightContext } from "../context/HighlightContext";
import { useVerseActions } from "../hook/useVerseActions";
import { Colors } from "../utils/colors";
import responsive from "../utils/responsive";

interface VerseActionsModalProps {
  visible: boolean;
  onClose: () => void;
  themeMode: string;
  verse: any;
  book: string;
  chapter: number;
}

export default function VerseActionsModal({
  visible,
  onClose,
  themeMode,
  verse,
  book,
  chapter,
}: VerseActionsModalProps) {
  const [noteText, setNoteText] = useState("");
  const { addBookmark, addNote, copyToClipboard, isBookmarked } =
    useVerseActions();
  const { addHighlight, highlights } = useHighlightContext();

  const handleBookmark = () => {
    addBookmark(book, chapter, verse.verse, verse.text);
    onClose();
  };

  const handleNote = () => {
    if (noteText.trim()) {
      addNote(book, chapter, verse.verse, verse.text, noteText);
      setNoteText("");
      onClose();
    } else {
      Alert.alert("Empty Note", "Please enter a note before saving.");
    }
  };

  const handleCopy = () => {
    copyToClipboard(verse.text);
    onClose();
  };

  const handleHighlight = (color: string) => {
    addHighlight(book, chapter, verse.verse, verse.text, color);
    router.replace("/");
    onClose();
  };

  const handleNavigateToNotes = () => {
    router.push({
      pathname: "/note",
      params: {
        book,
        chapter,
        verse: verse.verse,
        text: verse.text,
      },
    });
    onClose();
  };

  const highlightId = `${book}-${chapter}-${verse.verse}`;
  const isAlreadyHighlighted = highlights.some((h) => h.id === highlightId);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/30 justify-center items-center relative">
        <Pressable onPress={onClose} className="absolute inset-0"></Pressable>

        <View
          style={{
            height: responsive.verticalScale(168),
            width: responsive.scale(335),
          }}
          className="bg-primary-light dark:bg-primary-dark px-6 py-4 flex-col justify-center gap-4 rounded-lg"
        >
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handleBookmark}
              style={{
                height: responsive.verticalScale(32),
                width: responsive.scale(112),
              }}
              className="flex-row items-center justify-center gap-2 border border-primary-dark dark:border-primary-light rounded"
            >
              <SvgXml
                xml={bookmark}
                width={responsive.scale(9.33)}
                height={responsive.verticalScale(12)}
                color={
                  isBookmarked(highlightId)
                    ? Colors.accent
                    : themeMode === "light"
                      ? Colors.primaryLight
                      : Colors.primaryDark
                }
              />
              <Text className="font-RobotoMidium text-base text-primary-dark dark:text-primary-light">
                {isBookmarked(highlightId) ? "Bookmarked" : "Bookmark"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNavigateToNotes}
              style={{
                height: responsive.verticalScale(32),
                width: responsive.scale(76),
              }}
              className="flex-row items-center justify-center gap-2 border border-primary-dark dark:border-primary-light rounded"
            >
              <SvgXml
                xml={notesIcon}
                width={responsive.scale(10.67)}
                height={responsive.verticalScale(13.33)}
                color={
                  themeMode === "light"
                    ? Colors.primaryLight
                    : Colors.primaryDark
                }
              />
              <Text className="font-RobotoMidium text-base text-primary-dark dark:text-primary-light">
                Notes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCopy}
              style={{
                height: responsive.verticalScale(32),
                width: responsive.scale(68),
              }}
              className="flex-row items-center justify-center gap-2 border border-primary-dark dark:border-primary-light rounded"
            >
              <SvgXml
                xml={copy}
                width={responsive.scale(13)}
                height={responsive.verticalScale(14.33)}
                color={
                  themeMode === "light"
                    ? Colors.primaryLight
                    : Colors.primaryDark
                }
              />
              <Text className="font-RobotoMidium text-base text-primary-dark dark:text-primary-light">
                Copy
              </Text>
            </TouchableOpacity>
          </View>

          {/* Highlight color options */}
          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              onPress={() => handleHighlight("#FFFF00")}
              style={{
                width: responsive.scale(56),
                height: responsive.verticalScale(32),
              }}
              className={`bg-[#FFFF00] rounded ${isAlreadyHighlighted ? "opacity-50" : ""}`}
              disabled={isAlreadyHighlighted}
            />
            <TouchableOpacity
              onPress={() => handleHighlight("#FFFF00")}
              style={{
                width: responsive.scale(56),
                height: responsive.verticalScale(32),
              }}
              className={`bg-[#00FF00] rounded ${isAlreadyHighlighted ? "opacity-50" : ""}`}
              disabled={isAlreadyHighlighted}
            />
            <TouchableOpacity
              onPress={() => handleHighlight("#FF69B4")}
              style={{
                width: responsive.scale(56),
                height: responsive.verticalScale(32),
              }}
              className={`bg-[#FF69B4] rounded ${isAlreadyHighlighted ? "opacity-50" : ""}`}
              disabled={isAlreadyHighlighted}
            />
            <TouchableOpacity
              onPress={() => handleHighlight("#00BFFF")}
              style={{
                width: responsive.scale(56),
                height: responsive.verticalScale(32),
              }}
              className={`bg-[#00BFFF] rounded ${isAlreadyHighlighted ? "opacity-50" : ""}`}
              disabled={isAlreadyHighlighted}
            />
          </View>

          {isAlreadyHighlighted && (
            <Text className="text-center text-xs text-gray-500 dark:text-gray-400">
              This verse is already highlighted
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
