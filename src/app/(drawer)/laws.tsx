import { Images } from "@/assets/images/images";
import DrawerAudioPlayer from "@/src/components/DrawerAudioPlayer";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import Lawsdata from "../../../assets/Data/Lawsdata.json";
import { backarrow, search } from "../../../assets/icons/icons";
// import TTSServiceDrawer from "../../services/ttsServiceDrawer";
import { useThemeContext } from "@/src/context/ThemeProvider";
import { Colors } from "../../utils/colors";
import responsive from "../../utils/responsive";

export default function Laws() {
  const { effectiveTheme } = useThemeContext();
  const [audioVisible, setAudioVisible] = useState(false);
  const [title, setTitle] = useState("LAW");
  const [readText, setReadText] = useState<string | null>(null);
  const [verses, setVerses] = useState<{ text: string }[]>([]);

  const closedownSlideAudioBar = () => {
    setAudioVisible(false);
  };

  const handleTextPress = async (text: string, sectionTitle: string) => {
    // First close the audio player if it's open
    if (audioVisible) {
      setAudioVisible(false);
      // Wait a bit for the close animation to complete
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    setReadText(text);
    setTitle(sectionTitle);
    setVerses([{ text }]);

    // Open the audio player with new content
    setAudioVisible(true);
  };

  // Cleanup when component unmounts
  // useEffect(() => {
  //   return () => {
  //     TTSServiceDrawer.cleanup();
  //   };
  // }, []);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-1">
        {/* Header */}
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
              <Text className="font-RobotoMidium text-2xl text-secondary-light dark:text-secondary-dark border-b-2 border-secondary-light dark:border-secondary-dark">
                Laws
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

        {/* Content */}
        <View
          style={{ width: responsive.scale(330) }}
          className="flex-1 mx-auto"
        >
          <ScrollView className="py-4">
            <Pressable onPress={() => handleTextPress(Lawsdata.title, "Title")}>
              <Text
                className={`${readText === Lawsdata.title ? "bg-gray-400" : ""} text-2xl text-primary-dark dark:text-primary-light font-RobotoSemiBold pb-4`}
              >
                {Lawsdata.title}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleTextPress(Lawsdata.subtitle, "Subtitle")}
            >
              <Text
                className={` ${readText === Lawsdata.subtitle ? "bg-gray-400" : ""} text-lg text-primary-dark dark:text-primary-light font-RobotoSemiBold`}
              >
                {Lawsdata.subtitle}
              </Text>
            </Pressable>
            <Pressable onPress={() => handleTextPress(Lawsdata.type, "Type")}>
              <Text
                className={` ${readText === Lawsdata.type ? "bg-gray-400" : ""} text-lg text-secondary-light dark:text-secondary-dark font-RobotoMidium pb-4`}
              >
                {Lawsdata.type}
              </Text>
            </Pressable>

            {/* Render Laws from JSON */}
            <View>
              {Lawsdata.laws.map((itm, indx) => (
                <View
                  key={itm.id || indx}
                  className="flex-row items-start mb-2"
                >
                  <Pressable
                    onPress={() => handleTextPress(itm.text, `Law ${indx + 1}`)}
                  >
                    <Text
                      className={`${readText === itm.text ? "bg-gray-400" : ""} font-Roboto  text-lg text-primary-dark dark:text-primary-light`}
                    >
                      <Text className="font-RobotoExtraBold text-lg">
                        {indx + 1}
                      </Text>{" "}
                      . {itm.text}{" "}
                      <Text className="text-secondary-light dark:text-secondary-dark">
                        {itm.reference}
                      </Text>
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>

            <View className="h-28" />
          </ScrollView>
        </View>

        {/* Footer Logo */}
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

        {audioVisible && (
          <DrawerAudioPlayer
            verses={verses}
            title={title}
            themeMode={effectiveTheme}
            onClose={closedownSlideAudioBar}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
