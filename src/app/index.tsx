import { DrawerActions } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import Genesis from "../../assets/Data/Genesis.json";
import { downarrow, menu, search } from "../../assets/icons/icons";
import { Images } from "../../assets/images/images";
import AudioPlayer from "../components/AudioPlayer";
import Book from "../components/Book";
import { useThemeContext } from "../context/ThemeProvider";
import { Colors } from "../utils/colors";
import responsive from "../utils/responsive";
export default function Index() {
  const navigation = useNavigation();
  const { effectiveTheme } = useThemeContext();
  const [audioVisible, setAudioVisible] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const openAudioBar = (verseIndex) => {
    setCurrentVerseIndex(verseIndex);
    setAudioVisible(true);
  };

  const closeAudioBar = () => {
    setAudioVisible(false);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          effectiveTheme === "dark" ? Colors.black : Colors.white,
      }}
    >
      <View className="flex-1 relative">
        {/* Header */}
        <View
          style={{
            height: responsive.verticalScale(64),
            width: responsive.scale(335),
          }}
          className="mx-auto flex-row justify-between items-center"
        >
          <TouchableOpacity onPress={openDrawer}>
            <SvgXml
              xml={menu}
              width={responsive.scale(24)}
              height={responsive.verticalScale(24)}
              color={
                effectiveTheme === "light"
                  ? Colors.primaryLight
                  : Colors.primaryDark
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/searchchapter")}
            className="flex-row items-center gap-2"
          >
            <Text className="font-RobotoMidium text-2xl text-secondary-light dark:text-secondary-dark">
              Genesis 1
            </Text>
            <SvgXml
              xml={downarrow}
              width={responsive.scale(13.31)}
              height={responsive.verticalScale(7.67)}
              color={
                effectiveTheme === "light"
                  ? Colors.primaryLight
                  : Colors.primaryDark
              }
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/searchbuttonwork")}>
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

        {/* Main content */}
        <View
          style={{ width: responsive.scale(330) }}
          className="flex-1 mx-auto"
        >
          <Book themeMode={effectiveTheme} onPlayAudio={openAudioBar} />
        </View>

        {/* Footer logo */}
        <View
          style={{ height: responsive.verticalScale(48) }}
          className="w-full flex justify-center"
        >
          <Image
            source={
              effectiveTheme === "dark" ? Images.navdark : Images.navlight
            }
            style={{
              width: responsive.scale(52),
              height: responsive.verticalScale(40),
            }}
            className="mx-auto"
          />
        </View>

        {/* Audio Player */}
        {audioVisible && (
          <AudioPlayer
            verses={Genesis.verses}
            themeMode={effectiveTheme}
            initialVerseIndex={currentVerseIndex}
            onClose={closeAudioBar}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
