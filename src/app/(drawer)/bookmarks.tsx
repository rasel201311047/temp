import { useThemeContext } from "@/src/context/ThemeProvider";
import Constants from "expo-constants";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import {
  backarrow,
  bookmark,
  search,
  trash,
} from "../../../assets/icons/icons";
import { Images } from "../../../assets/images/images";
import { useVerseActions } from "../../hook/useVerseActions";
import { Colors } from "../../utils/colors";
import responsive from "../../utils/responsive";

const Bookmarks = () => {
  const { effectiveTheme } = useThemeContext();
  const { bookmarks, removeBookmark } = useVerseActions();
  const [localBookmarks, setLocalBookmarks] = useState<any[]>([]);

  useEffect(() => {
    setLocalBookmarks(bookmarks);
  }, [bookmarks]);

  const handleRemoveBookmark = (id: string) => {
    Alert.alert(
      "Remove Bookmark",
      "Are you sure you want to remove this bookmark?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          onPress: () => removeBookmark(id),
          style: "destructive",
        },
      ]
    );
  };

  const navigateToVerse = (bookmark: any) => {
    router.replace({
      pathname: "/",
      params: {
        scrollToVerse: bookmark.verse,
        book: bookmark.book,
        chapter: bookmark.chapter,
      },
    });
  };

  return (
    <View
      className="flex-1 bg-white dark:bg-black"
      style={{
        paddingTop: Platform.OS === "android" ? Constants.statusBarHeight : 0,
      }}
    >
      {/* Header */}
      <View className="w-full ">
        <View
          style={{
            height: responsive.verticalScale(64),
            width: responsive.scale(335),
          }}
          className="mx-auto flex-row justify-between items-center "
        >
          <TouchableOpacity onPress={() => router.back()}>
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

          <Text className="font-RobotoMidium text-2xl text-secondary-light dark:text-secondary-dark">
            Bookmarks
          </Text>

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

      {/* Bookmarks List */}
      <View style={{ width: responsive.scale(335) }} className="mx-auto flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={true}
        >
          {localBookmarks.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <SvgXml
                xml={bookmark}
                width={40}
                height={40}
                color={
                  effectiveTheme === "light"
                    ? Colors.primaryLight
                    : Colors.primaryDark
                }
              />
              <Text className="text-lg text-gray-500 mt-4">
                No bookmarks yet
              </Text>
              <Text className="text-sm text-gray-400 mt-2 text-center">
                Tap the + icon on any verse to add it to bookmarks
              </Text>
            </View>
          ) : (
            localBookmarks.map((bookmark) => (
              <View
                key={bookmark.id}
                className="bg-primary-light dark:bg-primary-dark p-4 rounded-lg mb-4"
              >
                <View className="flex-row justify-between items-center mb-2">
                  <TouchableOpacity
                    onPress={() => navigateToVerse(bookmark)}
                    className="flex-1"
                  >
                    <Text className="font-RobotoMidium text-secondary-light dark:text-secondary-dark text-xl">
                      {bookmark.book} {bookmark.chapter}:{bookmark.verse}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleRemoveBookmark(bookmark.id)}
                    className="p-2"
                  >
                    <SvgXml
                      xml={trash}
                      width={responsive.scale(16)}
                      height={responsive.verticalScale(16)}
                      color={
                        effectiveTheme === "light"
                          ? Colors.primaryLight
                          : Colors.primaryDark
                      }
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigateToVerse(bookmark)}>
                  <Text className="font-Roboto text-primary-dark dark:text-primary-light text-base">
                    {bookmark.text}
                  </Text>
                </TouchableOpacity>
                <Text className="text-xs text-gray-500 dark:text-gray-300 mt-2">
                  {new Date(bookmark.timestamp).toLocaleDateString()}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
      {/* footer */}
      <View
        style={{ height: responsive.verticalScale(48) }}
        className="w-full flex justify-center "
      >
        <Image
          source={effectiveTheme === "dark" ? Images.navdark : Images.navlight}
          style={{
            width: responsive.scale(52),
            height: responsive.verticalScale(40),
          }}
          className="mx-auto"
        />
      </View>
    </View>
  );
};

export default Bookmarks;
