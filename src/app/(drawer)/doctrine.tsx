import { Images } from "@/assets/images/images";
import DrawerAudioPlayer from "@/src/components/DrawerAudioPlayer";
import { useThemeContext } from "@/src/context/ThemeProvider";
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
import DoctrineData from "../../../assets/Data/DoctrineData.json";
import { backarrow, search } from "../../../assets/icons/icons";
import { Colors } from "../../utils/colors";
import responsive from "../../utils/responsive";

export default function doctrine() {
  const { effectiveTheme } = useThemeContext();
  const [audioVisible, setAudioVisible] = useState(false);
  const [title, setTitle] = useState("doctrine");
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

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-1">
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
              <Text className="font-RobotoMidium text-2xl text-secondary-light dark:text-secondary-dark border-b-2 border-secondary-light dark:border-secondary-dark">
                Doctrine
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

        {/* main content */}
        <View
          style={{ width: responsive.scale(330) }}
          className="flex-1 mx-auto"
        >
          <ScrollView className="py-4">
            {/* top intro */}
            <Pressable
              onPress={() => handleTextPress(DoctrineData.title, "Title")}
            >
              <Text className="text-xl text-primary-dark dark:text-primary-light font-RobotoSemiBold pb-4">
                {DoctrineData.title}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleTextPress(DoctrineData.subtitle, "Subtitle")}
            >
              <Text className="text-lg text-primary-dark dark:text-primary-light font-RobotoSemiBold">
                {DoctrineData.subtitle}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleTextPress(DoctrineData.purpose, "Purpose")}
            >
              <Text className="text-lg text-primary-dark dark:text-primary-light font-RobotoSemiBold">
                {" "}
                {DoctrineData.purpose}
              </Text>
            </Pressable>

            {/* sections */}
            <View>
              {DoctrineData.sections.map((section, i) => (
                <View key={i} style={{ marginBottom: 20 }}>
                  <Pressable
                    onPress={() => handleTextPress(section.name, "Purpose")}
                  >
                    <Text className="font-RobotoMidium text-lg text-primary-dark dark:text-primary-light">
                      {section.name}
                    </Text>
                  </Pressable>

                  {section.items.map((item, j) => (
                    <View key={j} className="ml-[4.2%]">
                      {/* main bullet */}
                      <Pressable
                        onPress={() => handleTextPress(item.text, "Rasel")}
                        className="flex-row items-start "
                      >
                        <Text className="text-primary-dark dark:text-primary-light text-2xl">
                          {"\u2022"}{" "}
                        </Text>
                        <Text className="font-RobotoMidium text-base text-primary-dark dark:text-primary-light">
                          {item.text}
                        </Text>
                      </Pressable>

                      {/* sub bullets if details exist */}
                      {item.details &&
                        item.details.map((sub, k) => (
                          <Pressable
                            onPress={() => handleTextPress(sub, "Rasel")}
                            key={k}
                            className="flex-row items-start ml-[4.2%]"
                          >
                            <Text className="text-primary-dark dark:text-primary-light text-2xl">
                              {"\u25E6"}{" "}
                            </Text>
                            <Text className="font-Roboto text-base text-primary-dark dark:text-primary-light">
                              {sub}
                            </Text>
                          </Pressable>
                        ))}
                    </View>
                  ))}
                </View>
              ))}
            </View>

            <View className="h-28"></View>
          </ScrollView>
        </View>

        {/* footer logo */}
        <View
          style={{ height: responsive.verticalScale(48) }}
          className="w-full flex justify-center "
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
