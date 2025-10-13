// export default notes
import { useThemeContext } from "@/src/context/ThemeProvider";
import { router } from "expo-router";
import React from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { backarrow, edit, search, trash } from "../../../assets/icons/icons";
import { useVerseActions } from "../../hook/useVerseActions";
import { Colors } from "../../utils/colors";
import responsive from "../../utils/responsive";

const notes = () => {
  const { effectiveTheme } = useThemeContext();
  const { notes, removeNote } = useVerseActions();

  const handleDeleteNote = (id: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => removeNote(id),
      },
    ]);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      {/* header */}
      <View className="w-full">
        <View
          style={{
            height: responsive.verticalScale(64),
            width: responsive.scale(335),
          }}
          className="mx-auto flex-row justify-between items-center"
        >
          <TouchableOpacity onPress={router.back}>
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
              Notes
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
      </View>

      {/* Notes */}

      <ScrollView className="flex-1 px-4 mt-4">
        {notes.length === 0 ? (
          <View className="flex-1 h-screen items-center  ">
            <Text className="text-secondary-light dark:text-secondary-dark text-2xl mt-[60%]">
              No notes yet
            </Text>
          </View>
        ) : (
          notes.map((note) => (
            <View
              key={note.id}
              className="bg-primary-light dark:bg-primary-dark p-4 rounded-lg mb-4"
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className="font-RobotoMidium text-secondary-light dark:text-secondary-dark text-xl">
                  {note.book} {note.chapter}:{note.verse}
                </Text>
                <Text className="text-secondary-light dark:text-secondary-dark text-sm">
                  {formatDate(note.timestamp)}
                </Text>
              </View>

              <View className=" pt-3">
                <Text className="text-primary-dark dark:text-primary-light font-RobotoMidium">
                  Note:
                </Text>
                <Text className="text-primary-dark dark:text-primary-light font-Roboto mt-1">
                  {note.note}
                </Text>
              </View>

              <View className="flex-row justify-end mt-3">
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/note",
                      params: {
                        book: note.book,
                        chapter: note.chapter,
                        verse: note.verse,
                        text: note.text,
                        note: note.note,
                        edit: "true",
                      },
                    })
                  }
                  className="mr-4 px-3 py-1 bg-primary-dark dark:bg-primary-light rounded flex-row items-center gap-[2%]"
                >
                  <SvgXml
                    xml={edit}
                    width={responsive.scale(14)}
                    height={responsive.verticalScale(14)}
                    color={
                      effectiveTheme === "light" ? Colors.white : Colors.black
                    }
                  />
                  <Text className="text-primary-light dark:text-primary-dark font-RobotoMidium">
                    Edit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDeleteNote(note.id)}
                  className="px-3 py-1 border border-primary-dark dark:border-primary-light rounded flex-row items-center"
                >
                  <SvgXml
                    xml={trash}
                    width={responsive.scale(14)}
                    height={responsive.verticalScale(14)}
                    color={
                      effectiveTheme === "light" ? Colors.black : Colors.white
                    }
                  />
                  <Text className="text-primary-dark dark:text-primary-light ml-1 font-RobotoMidium">
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default notes;
