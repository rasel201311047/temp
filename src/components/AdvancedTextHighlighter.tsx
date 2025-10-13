import React, { useRef, useState } from "react";
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Highlight = {
  start: number;
  end: number;
  color: string;
};

type Props = {
  text: string;
  fontSize?: number;
  highlightColor?: string;
};

export default function AdvancedTextHighlighter({
  text,
  fontSize = 16,
  highlightColor = "yellow",
}: Props) {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [selection, setSelection] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const [charLayouts, setCharLayouts] = useState<
    { x: number; y: number; width: number; height: number }[]
  >([]);

  const containerRef = useRef<View>(null);

  // Measure each character's layout
  const onTextLayout = (event: LayoutChangeEvent) => {
    const lines = event.nativeEvent.lines;
    const layouts: { x: number; y: number; width: number; height: number }[] =
      [];
    lines.forEach((line) => {
      line.elements.forEach((char) => {
        layouts.push({
          x: char.x,
          y: char.y,
          width: char.width,
          height: char.height,
        });
      });
    });
    setCharLayouts(layouts);
  };

  // Map touch coordinates to character index
  const getCharIndex = (x: number, y: number) => {
    if (!charLayouts.length) return 0;
    for (let i = 0; i < charLayouts.length; i++) {
      const rect = charLayouts[i];
      if (
        x >= rect.x &&
        x <= rect.x + rect.width &&
        y >= rect.y &&
        y <= rect.y + rect.height
      ) {
        return i;
      }
    }
    return charLayouts.length - 1;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const touchX = evt.nativeEvent.locationX;
        const touchY = evt.nativeEvent.locationY;
        const startIdx = getCharIndex(touchX, touchY);
        setSelection({ start: startIdx, end: startIdx });
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const touchX = evt.nativeEvent.locationX;
        const touchY = evt.nativeEvent.locationY;
        const endIdx = getCharIndex(touchX, touchY);
        setSelection((prev) => (prev ? { ...prev, end: endIdx } : null));
      },
      onPanResponderRelease: () => {
        if (selection) {
          const start = Math.min(selection.start, selection.end);
          const end = Math.max(selection.start, selection.end) + 1;
          setHighlights((prev) => [
            ...prev,
            { start, end, color: highlightColor },
          ]);
          setSelection(null);
        }
      },
    })
  ).current;

  // Split text for rendering
  const renderText = () => {
    if (!highlights.length && !selection)
      return <Text style={{ fontSize }}>{text}</Text>;

    const parts: { text: string; color?: string }[] = [];
    let lastIndex = 0;

    const allHighlights = selection
      ? [
          ...highlights,
          {
            start: Math.min(selection.start, selection.end),
            end: Math.max(selection.start, selection.end) + 1,
            color: highlightColor,
          },
        ]
      : highlights;

    allHighlights.sort((a, b) => a.start - b.start);

    allHighlights.forEach((hl) => {
      if (hl.start > lastIndex) {
        parts.push({ text: text.slice(lastIndex, hl.start) });
      }
      parts.push({ text: text.slice(hl.start, hl.end), color: hl.color });
      lastIndex = hl.end;
    });

    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex) });
    }

    return parts.map((part, idx) => (
      <Text
        key={idx}
        style={{ backgroundColor: part.color || "transparent", fontSize }}
      >
        {part.text}
      </Text>
    ));
  };

  return (
    <View
      ref={containerRef}
      style={styles.container}
      {...panResponder.panHandlers}
    >
      <Text
        selectable={false}
        onTextLayout={onTextLayout}
        style={{ flexWrap: "wrap", lineHeight: fontSize * 2 }}
      >
        {renderText()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
