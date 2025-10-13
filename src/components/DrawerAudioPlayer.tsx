import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import {
  nexticon,
  pauseicon,
  preicon,
  starticon,
} from "../../assets/icons/icons";
import TTSServiceDrawer from "../services/ttsServiceDrawer";
import { Colors } from "../utils/colors";

type Verse = {
  verse?: string | number;
  text?: string;
};

const DrawerAudioPlayer = ({
  verses,
  themeMode,
  initialVerseIndex = 0,
  onClose,
  title,
}: {
  verses: Verse[];
  themeMode: "light" | "dark";
  initialVerseIndex?: number;
  onClose: () => void;
  title: string;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(initialVerseIndex);
  const [progress, setProgress] = useState({ currentTime: 0, duration: 1 });
  const downSlideAudioBar = useRef(new Animated.Value(195)).current;
  const isInitialized = useRef(false);
  const hasPlayed = useRef(false);

  const handlePlayStateChange = useCallback((playing: boolean) => {
    setIsPlaying(playing);
  }, []);

  const handleVerseChange = useCallback((index: number) => {
    setCurrentVerseIndex(index);
  }, []);

  const handleProgressUpdate = useCallback(
    (newProgress: { currentTime: number; duration: number }) => {
      setProgress(newProgress);
    },
    []
  );

  useEffect(() => {
    // Only initialize once when the component mounts
    if (!isInitialized.current) {
      TTSServiceDrawer.setOnPlayStateChange(handlePlayStateChange);
      TTSServiceDrawer.setOnVerseChange(handleVerseChange);
      TTSServiceDrawer.setOnProgressUpdate(handleProgressUpdate);
      isInitialized.current = true;
    }

    // animate in
    Animated.timing(downSlideAudioBar, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // cleanup
    return () => {
      // Don't remove listeners here to maintain state between opens/closes
    };
  }, [
    downSlideAudioBar,
    handlePlayStateChange,
    handleVerseChange,
    handleProgressUpdate,
  ]);

  // Separate effect to handle verse changes - ONLY play when verses change
  useEffect(() => {
    if (verses.length > 0 && !hasPlayed.current) {
      hasPlayed.current = true;
      TTSServiceDrawer.resetAndPlayNewContent(verses, initialVerseIndex);
    }
  }, [verses, initialVerseIndex]);

  const handlePlayPause = async () => {
    await TTSServiceDrawer.togglePlayPause();
  };

  const handlePrevious = async () => {
    if (progress.currentTime > 5) {
      await TTSServiceDrawer.jumpSeconds(-5);
    } else {
      TTSServiceDrawer.playPreviousVerse();
    }
  };

  const handleNext = async () => {
    if (progress.duration - progress.currentTime > 5) {
      await TTSServiceDrawer.jumpSeconds(5);
    } else {
      TTSServiceDrawer.playNextVerse();
    }
  };

  const handleClose = useCallback(() => {
    TTSServiceDrawer.pause();
    hasPlayed.current = false; // Reset for next time
    Animated.timing(downSlideAudioBar, {
      toValue: 195,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  }, [downSlideAudioBar, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const progressPercent = Math.max(
    0,
    Math.min(1, progress.currentTime / Math.max(1, progress.duration))
  );

  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleClose}
        className="absolute inset-0 bg-black/30"
        accessibilityLabel="Close audio player"
      />

      <Animated.View
        style={{
          height: 195,
          transform: [{ translateY: downSlideAudioBar }],
        }}
        className="absolute bottom-0 left-0 right-0"
        accessibilityLabel="Audio player controls"
      >
        <View className="bg-primary-light dark:bg-primary-dark mx-auto p-4 h-full">
          <Text className="text-secondary-light dark:text-secondary-dark pt-2 pb-4 text-center font-RobotoMidium text-xl">
            {title}
          </Text>

          <View className="mx-auto flex-row items-center justify-between w-64">
            <TouchableOpacity
              onPress={handlePrevious}
              accessibilityLabel="Previous verse or rewind 5 seconds"
            >
              <SvgXml
                xml={preicon}
                width={21}
                height={12}
                color={
                  themeMode === "light"
                    ? Colors.primaryLight
                    : Colors.primaryDark
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handlePlayPause}
              accessibilityLabel={isPlaying ? "Pause" : "Play"}
            >
              <SvgXml
                xml={isPlaying ? pauseicon : starticon}
                width={28}
                height={28}
                color={
                  themeMode === "light"
                    ? Colors.primaryLight
                    : Colors.primaryDark
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              accessibilityLabel="Next verse or forward 5 seconds"
            >
              <SvgXml
                xml={nexticon}
                width={21}
                height={12}
                color={
                  themeMode === "light"
                    ? Colors.primaryLight
                    : Colors.primaryDark
                }
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mx-auto py-4 gap-2 w-full px-6">
            <Text className="font-RobotoMidium text-sm text-secondary-light dark:text-secondary-dark">
              {formatTime(progress.currentTime)}
            </Text>

            <Pressable
              className="bg-secondary-light dark:bg-secondary-dark relative flex-1 h-1 rounded-full"
              accessibilityLabel="Progress bar"
            >
              <View
                className="absolute left-0 top-0 bottom-0"
                style={{
                  width: `${progressPercent * 100}%`,
                  backgroundColor:
                    themeMode === "light"
                      ? Colors.primaryLight
                      : Colors.primaryDark,
                }}
              />
              <View
                className="absolute rounded-full w-3 h-3 -top-1 "
                style={{
                  left: `${progressPercent * 100}%`,
                  marginLeft: -6,
                  backgroundColor:
                    themeMode === "light"
                      ? Colors.primaryLight
                      : Colors.primaryDark,
                }}
              />
            </Pressable>

            <Text className="font-RobotoMidium text-sm text-secondary-light dark:text-secondary-dark">
              {formatTime(progress.duration)}
            </Text>
          </View>

          <TouchableOpacity className="pl-4">
            <Text className="text-secondary-light dark:text-secondary-dark font-Roboto">
              1x
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </>
  );
};

export default DrawerAudioPlayer;
