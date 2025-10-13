import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import {
  book,
  bookmark,
  daynight,
  doctrine,
  highlight,
  law,
  notes,
  setting,
} from "../../assets/icons/icons";
import { Images } from "../../assets/images/images";
import { useThemeContext } from "../context/ThemeProvider";
import { Colors } from "../utils/colors";
import responsive from "../utils/responsive";
export default function CustomDrawerContent() {
  const { themeMode, effectiveTheme, toggleTheme, setTheme } =
    useThemeContext();

  const handleThemeChange = () => {
    const newMode = themeMode === "light" ? "dark" : "light";
    setTheme(newMode);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor:
          effectiveTheme === "dark" ? Colors.black : Colors.white,
      }}
    >
      {/* Header Logo */}
      <View
        style={{
          height: responsive.verticalScale(151),
        }}
      >
        <Image
          source={themeMode === "light" ? Images.lightlogo : Images.darklogo}
          className="h-full w-full mx-auto"
          resizeMode="contain"
        />
      </View>

      {/* Menu Items */}
      <TouchableOpacity
        style={{
          borderBottomColor:
            effectiveTheme === "dark"
              ? Colors.primaryDark
              : Colors.primaryLight,
        }}
        className="flex-row items-center gap-[4.26%] border-b px-[4%] py-4"
        onPress={() => router.push("/")}
      >
        <SvgXml
          xml={book}
          width={responsive.scale(16)}
          height={responsive.verticalScale(16)}
          color={
            themeMode === "light" ? Colors.primaryLight : Colors.primaryDark
          }
        />
        <Text
          style={{
            color:
              effectiveTheme === "dark"
                ? Colors.primaryDark
                : Colors.primaryLight,
          }}
          className="font-RobotoMidium text-lg"
        >
          Bible
        </Text>
      </TouchableOpacity>
      {/* ----------doctrine */}

      <TouchableOpacity
        onPress={() => router.push("/doctrine")}
        style={{
          borderBottomColor:
            effectiveTheme === "dark"
              ? Colors.primaryDark
              : Colors.primaryLight,
        }}
        className="flex-row items-center gap-[4.26%] border-b px-[4%] py-4"
      >
        <SvgXml
          xml={doctrine}
          width={responsive.scale(16)}
          height={responsive.verticalScale(16)}
          color={
            themeMode === "light" ? Colors.primaryLight : Colors.primaryDark
          }
        />
        <Text
          style={{
            color:
              effectiveTheme === "dark"
                ? Colors.primaryDark
                : Colors.primaryLight,
          }}
          className="font-RobotoMidium text-lg"
        >
          Doctrine
        </Text>
      </TouchableOpacity>

      {/* law */}
      <TouchableOpacity
        onPress={() => router.push("/laws")}
        style={{
          borderBottomColor:
            effectiveTheme === "dark"
              ? Colors.primaryDark
              : Colors.primaryLight,
        }}
        className="flex-row items-center gap-[4.26%] border-b px-[4%] py-4"
      >
        <SvgXml
          xml={law}
          width={responsive.scale(16)}
          height={responsive.verticalScale(16)}
          color={
            themeMode === "light" ? Colors.primaryLight : Colors.primaryDark
          }
        />
        <Text
          style={{
            color:
              effectiveTheme === "dark"
                ? Colors.primaryDark
                : Colors.primaryLight,
          }}
          className="font-RobotoMidium text-lg"
        >
          Laws
        </Text>
      </TouchableOpacity>
      {/* book marks */}

      <TouchableOpacity
        onPress={() => router.push("/bookmarks")}
        style={{
          borderBottomColor:
            effectiveTheme === "dark"
              ? Colors.primaryDark
              : Colors.primaryLight,
        }}
        className="flex-row items-center gap-[4.26%] border-b px-[4%] py-4"
      >
        <SvgXml
          xml={bookmark}
          width={responsive.scale(16)}
          height={responsive.verticalScale(16)}
          color={
            themeMode === "light" ? Colors.primaryLight : Colors.primaryDark
          }
        />
        <Text
          style={{
            color:
              effectiveTheme === "dark"
                ? Colors.primaryDark
                : Colors.primaryLight,
          }}
          className="font-RobotoMidium text-lg"
        >
          Bookmarks
        </Text>
      </TouchableOpacity>
      {/* notes */}

      <TouchableOpacity
        onPress={() => router.push("/notes")}
        style={{
          borderBottomColor:
            effectiveTheme === "dark"
              ? Colors.primaryDark
              : Colors.primaryLight,
        }}
        className="flex-row items-center gap-[4.26%] border-b px-[4%] py-4"
      >
        <SvgXml
          xml={notes}
          width={responsive.scale(16)}
          height={responsive.verticalScale(16)}
          color={
            themeMode === "light" ? Colors.primaryLight : Colors.primaryDark
          }
        />
        <Text
          style={{
            color:
              effectiveTheme === "dark"
                ? Colors.primaryDark
                : Colors.primaryLight,
          }}
          className="font-RobotoMidium text-lg"
        >
          Notes
        </Text>
      </TouchableOpacity>
      {/* highlight */}

      <TouchableOpacity
        onPress={() => router.push("/highlights")}
        style={{
          borderBottomColor:
            effectiveTheme === "dark"
              ? Colors.primaryDark
              : Colors.primaryLight,
        }}
        className="flex-row items-center gap-[4.26%] border-b px-[4%] py-4"
      >
        <SvgXml
          xml={highlight}
          width={responsive.scale(16)}
          height={responsive.verticalScale(16)}
          color={
            themeMode === "light" ? Colors.primaryLight : Colors.primaryDark
          }
        />
        <Text
          style={{
            color:
              effectiveTheme === "dark"
                ? Colors.primaryDark
                : Colors.primaryLight,
          }}
          className="font-RobotoMidium text-lg"
        >
          Highlights
        </Text>
      </TouchableOpacity>
      {/* Setting */}
      <TouchableOpacity
        onPress={() => router.push("/settings")}
        style={{
          borderBottomColor:
            effectiveTheme === "dark"
              ? Colors.primaryDark
              : Colors.primaryLight,
        }}
        className="flex-row items-center gap-[4.26%] border-b px-[4%] py-4"
      >
        <SvgXml
          xml={setting}
          width={responsive.scale(16)}
          height={responsive.verticalScale(16)}
          color={
            themeMode === "light" ? Colors.primaryLight : Colors.primaryDark
          }
        />
        <Text
          style={{
            color:
              effectiveTheme === "dark"
                ? Colors.primaryDark
                : Colors.primaryLight,
          }}
          className="font-RobotoMidium text-lg"
        >
          Settings/Backup
        </Text>
      </TouchableOpacity>
      {/* Day night */}
      <TouchableOpacity
        onPress={handleThemeChange}
        className="flex-row items-center gap-[4.26%] px-[4%] py-4"
      >
        <SvgXml
          xml={daynight}
          width={responsive.scale(16)}
          height={responsive.verticalScale(16)}
          color={
            themeMode === "light" ? Colors.primaryLight : Colors.primaryDark
          }
        />
        <Text
          style={{
            color:
              effectiveTheme === "dark"
                ? Colors.primaryDark
                : Colors.primaryLight,
          }}
          className="font-RobotoMidium text-lg"
        >
          Day/Night
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
