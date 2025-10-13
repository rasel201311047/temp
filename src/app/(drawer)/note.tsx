import { useThemeContext } from "@/src/context/ThemeProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVerseActions } from "../../hook/useVerseActions";
import { Colors } from "../../utils/colors";
import responsive from "../../utils/responsive";

const Note = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { effectiveTheme } = useThemeContext();
  const { addNote, updateNote, notes } = useVerseActions();

  const [noteText, setNoteText] = useState("");
  const [height, setHeight] = useState(100);

  const { book, chapter, verse, text, note: existingNote, edit } = params;
  const isEditMode = edit === "true";

  useEffect(() => {
    // If editing, load existing note
    if (isEditMode && existingNote) {
      setNoteText(existingNote as string);
    }
  }, [isEditMode, existingNote]);

  const handleSaveNote = () => {
    if (noteText.trim()) {
      if (isEditMode) {
        // Find the existing note to update
        const existingNoteObj = notes.find(
          (n) =>
            n.book === book &&
            n.chapter === parseInt(chapter as string) &&
            n.verse === parseInt(verse as string)
        );

        if (existingNoteObj) {
          updateNote(existingNoteObj.id, noteText);
          Alert.alert("Success", "Note updated successfully");
        }
        router.replace("/notes");
      } else {
        // Create new note
        addNote(
          book as string,
          parseInt(chapter as string),
          parseInt(verse as string),
          text as string,
          noteText
        );
        Alert.alert("Success", "Note saved successfully");
        router.back();
      }
    } else {
      Alert.alert("Error", "Please enter note text before saving");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      {/* Header */}
      <View className="w-full">
        <View
          style={{
            height: responsive.verticalScale(64),
            width: responsive.scale(335),
          }}
          className="mx-auto flex-row justify-end items-center gap-[4%]"
        >
          <TouchableOpacity onPress={router.back} className="">
            <Text className="font-RobotoMidium dark:text-tertiary-light text-secondary-light text-xl">
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSaveNote} className="">
            <Text className="font-RobotoMidium dark:text-secondary-dark text-secondary-light text-xl">
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View style={{ width: responsive.scale(335) }} className="mx-auto flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={true}
        >
          <Text className="mb-5 font-RobotoMidium text-secondary-light dark:text-secondary-dark text-xl">
            {book}:{chapter}:{verse}
          </Text>

          {/* Note Input */}
          <TextInput
            value={noteText}
            onChangeText={setNoteText}
            multiline
            onContentSizeChange={(e) =>
              setHeight(e.nativeEvent.contentSize.height)
            }
            style={{ height: Math.max(100, height) }}
            className="p-3 font-Roboto text-base text-primary-dark dark:text-primary-light bg-primary-light dark:bg-primary-dark rounded-lg"
            placeholder="Note text"
            placeholderTextColor={Colors.secondary}
            textAlignVertical="top"
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Note;
