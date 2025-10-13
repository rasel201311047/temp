// AudioPlayer.tsx
import React, { useEffect, useRef, useState } from "react";
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
import TTSService from "../services/ttsService";
import { Colors } from "../utils/colors";

type Verse = {
  verse?: string | number;
  text?: string;
};

const AudioPlayer = ({
  verses,
  themeMode,
  initialVerseIndex = 0,
  onClose,
}: {
  verses: Verse[];
  themeMode: "light" | "dark";
  initialVerseIndex?: number;
  onClose: () => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(initialVerseIndex);
  const [progress, setProgress] = useState({ currentTime: 0, duration: 1 });
  const downSlideAudioBar = useRef(new Animated.Value(195)).current;

  // Interval to poll progress from service (since Tts doesn't provide exact time)
  const progressPollRef = useRef<number | null>(null);

  useEffect(() => {
    TTSService.setVerses(verses);
    TTSService.setCurrentVerseIndex(initialVerseIndex);

    TTSService.setOnPlayStateChange((playing) => {
      setIsPlaying(playing);

      if (playing) {
        startProgressPoll();
      } else {
        stopProgressPoll();
      }
    });

    TTSService.setOnVerseChange((index) => {
      setCurrentVerseIndex(index);
      // reset progress from service
      const p = TTSService.getProgress();
      setProgress({
        currentTime: p.currentTime,
        duration: Math.max(1, p.duration),
      });
    });

    // animate in
    Animated.timing(downSlideAudioBar, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // cleanup
    return () => {
      TTSService.setOnPlayStateChange(null);
      TTSService.setOnVerseChange(null);
      stopProgressPoll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verses, initialVerseIndex]);

  // Poll progress every 400ms (adjustable)
  const startProgressPoll = () => {
    if (progressPollRef.current) return;
    progressPollRef.current = setInterval(() => {
      const p = TTSService.getProgress();
      setProgress({
        currentTime: p.currentTime,
        duration: Math.max(1, p.duration),
      });
    }, 400) as unknown as number;
  };

  const stopProgressPoll = () => {
    if (progressPollRef.current) {
      clearInterval(progressPollRef.current as any);
      progressPollRef.current = null;
    }
  };

  const handlePlayPause = async () => {
    await TTSService.togglePlayPause();
  };

  const handlePrevious = async () => {
    // If currently farther than 5s into verse, jump back 5s. Else go previous verse.
    if (progress.currentTime > 5) {
      await TTSService.jumpSeconds(-5);
    } else {
      TTSService.playPreviousVerse();
    }
  };

  const handleNext = async () => {
    // If there is more than 5s left in current verse, jump forward 5s. Else next verse.
    if (progress.duration - progress.currentTime > 5) {
      await TTSService.jumpSeconds(5);
    } else {
      TTSService.playNextVerse();
    }
  };

  const handleClose = () => {
    TTSService.pause();
    Animated.timing(downSlideAudioBar, {
      toValue: 195,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const currentVerse = verses[currentVerseIndex] || {};
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
      />

      <Animated.View
        style={{
          height: 195,
          transform: [{ translateY: downSlideAudioBar }],
        }}
        className="absolute bottom-0 left-0 right-0"
      >
        <View className="bg-primary-light dark:bg-primary-dark mx-auto p-4 h-full">
          <Text className="text-secondary-light dark:text-secondary-dark pt-2 pb-4 text-center font-RobotoMidium text-xl">
            {`Genesis ${currentVerse.verse || ""}`}
          </Text>

          <View className="mx-auto flex-row items-center justify-between w-64">
            <TouchableOpacity onPress={handlePrevious}>
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

            <TouchableOpacity onPress={handlePlayPause}>
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

            <TouchableOpacity onPress={handleNext}>
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
              className="bg-secondary-light dark:bg-secondary-dark relative flex-1 h-1 rounded-full overflow-hidden"
              // optional: add onPress to jump to location; not implemented here
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
                className="absolute rounded-full w-3 h-3 -top-1"
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

export default AudioPlayer;
