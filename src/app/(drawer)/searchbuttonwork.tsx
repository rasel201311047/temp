import { useThemeContext } from "@/src/context/ThemeProvider";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import {
  backarrow,
  cheakicon,
  close,
  search,
} from "../../../assets/icons/icons";
import { Colors } from "../../utils/colors";
import responsive from "../../utils/responsive";
const searchbuttonwork = () => {
  const { effectiveTheme } = useThemeContext();
  const [cheak, setchek] = useState({ phase: false, partial: false });
  const [acvalue, setactive] = useState(null);
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
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
              className="flex-row items-center justify-between border-b border-secondary-light dark:border-primary-light"
            >
              <View className="flex-row items-center gap-[2%]">
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
              <TouchableOpacity onPress={router.back}>
                <SvgXml
                  xml={close}
                  width={responsive.scale(17.78)}
                  height={responsive.verticalScale(17.88)}
                  color={
                    effectiveTheme === "light"
                      ? Colors.primaryLight
                      : Colors.primaryDark
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {/* Search contain  */}

      <View style={{ width: responsive.scale(335) }} className="mx-auto">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-[8%]">
            <Pressable
              onPress={() =>
                setchek((prev) => ({ ...prev, phase: !prev.phase }))
              }
              style={{
                width: responsive.scale(24),
                height: responsive.verticalScale(24),
              }}
              className="rounded-xl flex-row justify-center items-center border border-tertiary-light"
            >
              {cheak.phase && (
                <SvgXml
                  xml={cheakicon}
                  width={responsive.scale(18)}
                  height={responsive.verticalScale(16)}
                  color={
                    effectiveTheme === "light"
                      ? Colors.primaryLight
                      : Colors.primaryDark
                  }
                />
              )}
            </Pressable>

            <Text className="text-secondary-light dark:text-secondary-dark font-RobotoMidium text-lg">
              exact phrase
            </Text>
          </View>

          <View className="flex-row items-center gap-[8%]">
            <Pressable
              onPress={() =>
                setchek((prev) => ({ ...prev, partial: !prev.partial }))
              }
              style={{
                width: responsive.scale(24),
                height: responsive.verticalScale(24),
              }}
              className=" rounded-xl flex-row justify-center  items-center border border-tertiary-light"
            >
              {cheak.partial && (
                <SvgXml
                  xml={cheakicon}
                  width={responsive.scale(18)}
                  height={responsive.verticalScale(16)}
                  color={
                    effectiveTheme === "light"
                      ? Colors.primaryLight
                      : Colors.primaryDark
                  }
                />
              )}
            </Pressable>
            <Text className="text-secondary-light dark:text-secondary-dark font-RobotoMidium text-lg">
              partial
            </Text>
          </View>
        </View>

        <View className="py-4 flex-row justify-between items-center ">
          <Pressable
            className={`border-b  ${acvalue === "all" ? "border-primary-dark dark:border-primary-light" : "border-primary-light dark:border-primary-dark"}`}
            onPress={() => setactive("all")}
          >
            <Text
              className={`text-secondary-light dark:text-secondary-dark font-RobotoMidium text-lg`}
            >
              All
            </Text>
          </Pressable>
          <Pressable
            className={`border-b  ${acvalue === "ot" ? "border-primary-dark dark:border-primary-light" : "border-primary-light dark:border-primary-dark"}`}
            onPress={() => setactive("ot")}
          >
            <Text
              className={`text-secondary-light dark:text-secondary-dark font-RobotoMidium text-lg`}
            >
              OT
            </Text>
          </Pressable>
          <Pressable
            className={`border-b  ${acvalue === "nt" ? "border-primary-dark dark:border-primary-light" : "border-primary-light dark:border-primary-dark"}`}
            onPress={() => setactive("nt")}
          >
            <Text
              className={`text-secondary-light dark:text-secondary-dark font-RobotoMidium text-lg`}
            >
              NT
            </Text>
          </Pressable>
          <Pressable
            className={`border-b  ${acvalue === "ap" ? "border-primary-dark dark:border-primary-light" : "border-primary-light dark:border-primary-dark"}`}
            onPress={() => setactive("ap")}
          >
            <Text
              className={`text-secondary-light dark:text-secondary-dark font-RobotoMidium text-lg`}
            >
              AP
            </Text>
          </Pressable>
          {/* <Pressable className={`border-b  ${acvalue==='hi'?'border-primary-dark dark:border-primary-light': 'border-primary-light dark:border-primary-dark'}`} onPress={()=>setactive('hi')}><Text className={`text-secondary-light dark:text-secondary-dark font-RobotoMidium text-lg`} >HI</Text></Pressable> */}
          <Pressable
            className={`border-b  ${acvalue === "genesis" ? "border-primary-dark dark:border-primary-light" : "border-primary-light dark:border-primary-dark"}`}
            onPress={() => setactive("genesis")}
          >
            <Text
              className={`text-secondary-light dark:text-secondary-dark font-RobotoMidium text-lg`}
            >
              Genesis
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default searchbuttonwork;
