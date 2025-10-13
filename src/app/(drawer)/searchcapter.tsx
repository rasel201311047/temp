import { useThemeContext } from "@/src/context/ThemeProvider";
import { router } from "expo-router";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { backarrow, search } from "../../../assets/icons/icons";
import { Colors } from "../../utils/colors";
import responsive from "../../utils/responsive";

const searchcapter = () => {
  const { effectiveTheme } = useThemeContext();

  return (
    <SafeAreaView className="flex-1  bg-white dark:bg-black">
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
        <Text className="font-RobotoMidium text-secondary-light dark:text-secondary-dark text-xl mb-2">
          Numbers
        </Text>
        <View className="flex-row gap-[2%] flex-wrap ">
          {Array.from({ length: 30 }, (_, i) => (
            <TouchableOpacity
              key={i}
              style={{
                width: responsive.scale(40),
                height: responsive.verticalScale(40),
              }}
              className="flex-row justify-center items-center bg-secondary-dark dark:bg-secondary-light rounded-lg"
            >
              <Text className="text-primary-dark dark:text-primary-light font-RobotoSemiBold text-lg">
                {i + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default searchcapter;
