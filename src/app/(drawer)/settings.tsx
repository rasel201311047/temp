import { useThemeContext } from "@/src/context/ThemeProvider";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import {
  backarrow,
  dropdownicon,
  minus,
  plus,
  world,
} from "../../../assets/icons/icons";
import { Colors } from "../../utils/colors";
import responsive from "../../utils/responsive";
const SPEED_VALUES = [0.25, 1.0, 1.25, 1.5, 2.0];

const Settings = () => {
  const { effectiveTheme } = useThemeContext();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Language");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("sans");
  const [speed, setSpeed] = useState(1.0);

  const customLanguages = [
    "Dutch",
    "German",
    "Bengali",
    "Swahili",
    "Mandarin Chinese",
    "English",
    "Spanish",
    "Hindi",
    "Arabic",
    "French",
    "Portuguese",
    "Japanese",
    "Russian",
  ];

  // Load saved settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedFontSize = await AsyncStorage.getItem("fontSize");
      const savedFontFamily = await AsyncStorage.getItem("fontFamily");

      if (savedFontSize) {
        setFontSize(parseInt(savedFontSize, 10));
      }

      if (savedFontFamily) {
        setFontFamily(savedFontFamily);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveFontSize = async (size) => {
    try {
      await AsyncStorage.setItem("fontSize", size.toString());
    } catch (error) {
      console.error("Error saving font size:", error);
    }
  };

  const saveFontFamily = async (family) => {
    try {
      await AsyncStorage.setItem("fontFamily", family);
    } catch (error) {
      console.error("Error saving font family:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    setIsDropdownOpen(false);
  };

  const handleFontChange = (values) => {
    const newSize = values[0];
    setFontSize(newSize);
    saveFontSize(newSize);
  };

  const handleFontFamilyChange = () => {
    // Cycle through available font families
    const fontFamilies = ["sans", "serif", "monospace"];
    const currentIndex = fontFamilies.indexOf(fontFamily);
    const nextIndex = (currentIndex + 1) % fontFamilies.length;
    const newFontFamily = fontFamilies[nextIndex];

    setFontFamily(newFontFamily);
    saveFontFamily(newFontFamily);
  };

  const CustomMarker = () => (
    <View className="w-4 h-4 bg-[#606060] dark:bg-[#F5F5F5] rounded-full shadow-md" />
  );

  // spreed

  const decrease = () => {
    const newSpeed = Math.max(0.25, parseFloat((speed - 0.25).toFixed(2)));
    setSpeed(newSpeed);
  };

  const increase = () => {
    const newSpeed = Math.min(2.0, parseFloat((speed + 0.25).toFixed(2)));
    setSpeed(newSpeed);
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="w-full">
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
              Setting
            </Text>
          </TouchableOpacity>

          <TouchableOpacity></TouchableOpacity>
        </View>

        {/* Settings content */}
        <View style={{ width: responsive.scale(335) }} className="mx-auto">
          {/* Language Selector Button */}
          <Pressable
            style={{
              width: responsive.scale(220),
              height: responsive.verticalScale(48),
            }}
            className="flex-row items-center justify-center gap-2 border border-primary-dark dark:border-primary-light rounded-lg relative"
            onPress={toggleDropdown}
          >
            <SvgXml
              xml={world}
              width={responsive.scale(20)}
              height={responsive.verticalScale(20)}
              color={
                effectiveTheme === "light"
                  ? Colors.primaryLight
                  : Colors.primaryDark
              }
            />
            <Text className="text-lg font-Roboto text-primary-dark dark:text-primary-light">
              {selectedLanguage}
            </Text>
            <SvgXml
              xml={dropdownicon}
              width={responsive.scale(13.31)}
              height={responsive.verticalScale(7.67)}
              color={
                effectiveTheme === "light"
                  ? Colors.primaryLight
                  : Colors.primaryDark
              }
              style={{
                transform: [{ rotate: isDropdownOpen ? "180deg" : "0deg" }],
              }}
            />
          </Pressable>

          {/* Font Family Selector */}
          <View className="flex-row justify-between items-center py-8">
            <Text className="font-Roboto text-lg text-primary-dark dark:text-primary-light">
              Font
            </Text>
            <TouchableOpacity onPress={handleFontFamilyChange}>
              <Text className="font-Roboto text-lg text-primary-dark dark:text-primary-light">
                {fontFamily}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Font Size Display and Slider */}
          <View className="flex-row justify-between items-center pb-4">
            <Text className="font-Roboto text-lg text-primary-dark dark:text-primary-light">
              Font Size
            </Text>
            <Text className="font-Roboto text-lg text-primary-dark dark:text-primary-light">
              {fontSize}
            </Text>
          </View>

          {/* Font Size Slider */}
          <View className="flex-row items-center mx-auto">
            <MultiSlider
              values={[fontSize]}
              sliderLength={responsive.scale(268)}
              onValuesChange={handleFontChange}
              min={8}
              max={54}
              step={1}
              allowOverlap={false}
              snapped
              customMarker={CustomMarker}
              selectedStyle={{
                backgroundColor:
                  effectiveTheme === "light" ? "#ACACAC" : "#D9D9D9",
              }}
              unselectedStyle={{
                backgroundColor:
                  effectiveTheme === "light" ? "#D9D9D9" : "#ACACAC",
              }}
              trackStyle={{ height: 3, width: "100%" }}
            />
          </View>
          {/* spreed */}
          <View className=" pt-[4%]">
            {/* Slider with buttons */}
            <View className="flex-row items-center w-full">
              <TouchableOpacity
                style={{
                  width: responsive.scale(24),
                  height: responsive.verticalScale(24),
                }}
                onPress={decrease}
                className="flex-row justify-center items-center rounded-full bg-[#EDEDED]"
              >
                <SvgXml
                  xml={minus}
                  width={responsive.scale(13)}
                  height={responsive.verticalScale(13)}
                  color={Colors.black}
                />
              </TouchableOpacity>

              <Slider
                style={{ flex: 1, marginHorizontal: 10 }}
                minimumValue={0.25}
                maximumValue={2.0}
                step={0.25}
                value={speed}
                onValueChange={setSpeed}
                minimumTrackTintColor="#ACACAC"
                maximumTrackTintColor="#D9D9D9"
                thumbTintColor={
                  effectiveTheme === "light" ? "#606060" : "#F5F5F5"
                }
              />

              <TouchableOpacity
                style={{
                  width: responsive.scale(24),
                  height: responsive.verticalScale(24),
                }}
                onPress={increase}
                className=" flex-row justify-center items-center rounded-full bg-[#EDEDED] "
              >
                <SvgXml
                  xml={plus}
                  width={responsive.scale(13)}
                  height={responsive.verticalScale(13)}
                  color={Colors.black}
                />
              </TouchableOpacity>
            </View>

            {/* Preset speed buttons */}
            <View className="flex-row justify-center flex-wrap mt-4">
              {SPEED_VALUES.map((val) => (
                <TouchableOpacity
                  key={val}
                  onPress={() => setSpeed(val)}
                  className={`px-4 py-2 m-1 rounded-full border ${speed === val ? "bg-white border-[#EDEDED] dark:bg-black " : "bg-[#EDEDED] border-[#ffff]"}`}
                >
                  <Text
                    className={`font-semibold text-black ${speed === val ? "text-black dark:text-white" : ""}`}
                  >
                    {val}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Label */}
            {speed === 1.0 && (
              <Text className="text-black dark:text-white mt-2 text-sm ml-[30%]">
                Normal
              </Text>
            )}
          </View>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <View
              style={{
                width: responsive.scale(220),
                maxHeight: responsive.verticalScale(200),
                marginTop: responsive.verticalScale(5),
              }}
              className="absolute top-[30%] z-50 bg-primary-light"
            >
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={true}
              >
                {customLanguages.map((language, index) => (
                  <Pressable
                    key={index}
                    onPress={() => selectLanguage(language)}
                    style={{
                      width: responsive.scale(220),
                      height: responsive.verticalScale(48),
                    }}
                    className="flex-row items-center justify-center gap-2 border border-primary-dark dark:border-primary-light bg-primary-light dark:bg-primary-dark rounded-lg mb-2"
                  >
                    <SvgXml
                      xml={world}
                      width={responsive.scale(20)}
                      height={responsive.verticalScale(20)}
                      color={
                        effectiveTheme === "light"
                          ? Colors.primaryLight
                          : Colors.primaryDark
                      }
                    />
                    <Text
                      className={`text-lg font-Roboto text-primary-dark dark:text-primary-light`}
                    >
                      {language}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
