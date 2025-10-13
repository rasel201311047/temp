import { useThemeContext } from "@/src/context/ThemeProvider";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { backarrow, search } from "../../../assets/icons/icons";
import { Colors } from "../../utils/colors";
import responsive from "../../utils/responsive";
const searchchapter = () => {
  const { effectiveTheme } = useThemeContext();

  const chapter = [
    { book: "Genesis", chapters: 50 },
    { book: "Exodus", chapters: 40 },
    { book: "Leviticus", chapters: 27 },
    { book: "Numbers", chapters: 36 },
    { book: "Deuteronomy", chapters: 34 },
    { book: "Joshua", chapters: 24 },
    { book: "Judges", chapters: 21 },
    { book: "Ruth", chapters: 4 },
    { book: "1 Samuel", chapters: 31 },
    { book: "2 Samuel", chapters: 24 },
    { book: "1 Kings", chapters: 22 },
    { book: "2 Kings", chapters: 25 },
    { book: "1 Chronicles", chapters: 29 },
    { book: "2 Chronicles", chapters: 36 },
    { book: "Ezra", chapters: 10 },
    { book: "Nehemiah", chapters: 13 },
    { book: "Esther", chapters: 10 },
    { book: "Job", chapters: 42 },
    { book: "Psalms", chapters: 150 },
    { book: "Proverbs", chapters: 31 },
    { book: "Ecclesiastes", chapters: 12 },
    { book: "Song of Solomon", chapters: 8 },
    { book: "Isaiah", chapters: 66 },
    { book: "Jeremiah", chapters: 52 },
    { book: "Lamentations", chapters: 5 },
    { book: "Ezekiel", chapters: 48 },
    { book: "Daniel", chapters: 12 },
    { book: "Hosea", chapters: 14 },
    { book: "Joel", chapters: 3 },
    { book: "Amos", chapters: 9 },
    { book: "Obadiah", chapters: 1 },
    { book: "Jonah", chapters: 4 },
    { book: "Micah", chapters: 7 },
    { book: "Nahum", chapters: 3 },
    { book: "Habakkuk", chapters: 3 },
    { book: "Zephaniah", chapters: 3 },
    { book: "Haggai", chapters: 2 },
    { book: "Zechariah", chapters: 14 },
    { book: "Malachi", chapters: 4 },
  ];
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      {/* header */}
      <View className="w-ful pt-2 pb-6">
        <View style={{ width: responsive.scale(335) }} className="mx-auto ">
          <View className="flex-row items-center justify-between  ">
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

            <View
              style={{ width: responsive.scale(285) }}
              className="flex-row items-center gap-[2%] border-b border-secondary-light dark:border-primary-light"
            >
              <SvgXml
                xml={search}
                width={responsive.scale(17.78)}
                height={responsive.verticalScale(17.88)}
                color={
                  effectiveTheme === "light"
                    ? Colors.primaryLight
                    : Colors.primaryDark
                }
              />
              <TextInput
                placeholder="Search"
                placeholderTextColor={
                  effectiveTheme === "light"
                    ? Colors.primaryLight
                    : Colors.primaryDark
                }
                className="font-RobotoMidium text-lg"
              />
            </View>
          </View>
        </View>
      </View>

      <View style={{ width: responsive.scale(335) }} className="mx-auto ">
        <ScrollView>
          {/* Recent search  */}
          <View className="flex-row justify-between border-b border-secondary-light dark:border-tertiary-light py-3">
            <TouchableOpacity
              style={{
                width: responsive.scale(156),
                height: responsive.verticalScale(60),
              }}
              className="flex-row justify-center items-center rounded-full bg-secondary-dark dark:bg-secondary-light"
            >
              <Text className="font-RobotoMidium text-xl dark:text-tertiary-light">
                Ezekiel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: responsive.scale(156),
                height: responsive.verticalScale(60),
              }}
              className="flex-row justify-center items-center rounded-full bg-secondary-dark dark:bg-secondary-light"
            >
              <Text className="font-RobotoMidium text-xl dark:text-tertiary-light">
                Malachi
              </Text>
            </TouchableOpacity>
          </View>
          {
            <View className="flex-row flex-wrap justify-between">
              {chapter.map((item, indx) => (
                <TouchableOpacity
                  onPress={() => router.replace("/searchcapter")}
                  key={indx}
                  style={{
                    width: responsive.scale(156),
                    height: responsive.verticalScale(60),
                  }}
                  className="flex-row justify-center items-center rounded-full bg-secondary-dark dark:bg-secondary-light my-2"
                >
                  <Text className="font-RobotoMidium text-xl dark:text-secondary-dark">
                    {item.book}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          }

          <View className="h-28"></View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default searchchapter;
