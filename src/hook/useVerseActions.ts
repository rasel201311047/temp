import * as Clipboard from "expo-clipboard";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { getData, storeData } from "../utils/storage";

export interface Bookmark {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  timestamp: number;
}

export interface Note {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  note: string;
  timestamp: number;
}

export interface Highlight {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  color: string;
  timestamp: number;
}

export const useVerseActions = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const savedBookmarks = await getData("bookmarks");
    const savedNotes = await getData("notes");
    const savedHighlights = await getData("highlights");

    if (savedBookmarks) setBookmarks(savedBookmarks);
    if (savedNotes) setNotes(savedNotes);
    if (savedHighlights) setHighlights(savedHighlights);
  };

  const addBookmark = async (
    book: string,
    chapter: number,
    verse: number,
    text: string
  ) => {
    const newBookmark: Bookmark = {
      id: `${book}-${chapter}-${verse}`,
      book,
      chapter,
      verse,
      text,
      timestamp: Date.now(),
    };

    if (bookmarks.some((b) => b.id === newBookmark.id)) {
      Alert.alert(
        "Already Bookmarked",
        "This verse is already in your bookmarks."
      );
      return;
    }

    const updatedBookmarks = [...bookmarks, newBookmark];
    setBookmarks(updatedBookmarks);
    await storeData("bookmarks", updatedBookmarks);
    Alert.alert("Bookmark Added", "Verse has been added to your bookmarks.");
  };

  const removeBookmark = async (id: string) => {
    const updatedBookmarks = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updatedBookmarks);
    await storeData("bookmarks", updatedBookmarks);
  };

  const addNote = async (
    book: string,
    chapter: number,
    verse: number,
    text: string,
    noteText: string
  ) => {
    try {
      const newNote: Note = {
        id: `${book}-${chapter}-${verse}`, // Consistent ID format
        book,
        chapter,
        verse,
        text,
        note: noteText,
        timestamp: Date.now(),
      };

      const updatedNotes = [
        ...notes.filter((n) => n.id !== newNote.id),
        newNote,
      ];
      setNotes(updatedNotes);
      await storeData("notes", updatedNotes);
      Alert.alert("Note Saved", "Your note has been saved.");
    } catch (error) {
      console.error("Error saving note:", error);
      Alert.alert("Error", "Failed to save note");
    }
  };

  const updateNote = async (id: string, noteText: string) => {
    try {
      const updatedNotes = notes.map((n) =>
        n.id === id ? { ...n, note: noteText, timestamp: Date.now() } : n
      );
      setNotes(updatedNotes);
      await storeData("notes", updatedNotes);
    } catch (error) {
      console.error("Error updating note:", error);
      Alert.alert("Error", "Failed to update note");
    }
  };

  const removeNote = async (id: string) => {
    try {
      const updatedNotes = notes.filter((n) => n.id !== id);
      setNotes(updatedNotes);
      await storeData("notes", updatedNotes);
      Alert.alert("Success", "Note removed");
    } catch (error) {
      console.error("Error removing note:", error);
      Alert.alert("Error", "Failed to remove note");
    }
  };

  const removeNoteByReference = async (
    book: string,
    chapter: number,
    verse: number
  ) => {
    try {
      const updatedNotes = notes.filter(
        (n) => !(n.book === book && n.chapter === chapter && n.verse === verse)
      );
      setNotes(updatedNotes);
      await storeData("notes", updatedNotes);
      Alert.alert("Success", "Note removed");
    } catch (error) {
      console.error("Error removing note:", error);
      Alert.alert("Error", "Failed to remove note");
    }
  };

  const addHighlight = async (
    book: string,
    chapter: number,
    verse: number,
    text: string,
    color: string
  ) => {
    const newHighlight: Highlight = {
      id: `${book}-${chapter}-${verse}`,
      book,
      chapter,
      verse,
      text,
      color,
      timestamp: Date.now(),
    };

    const updatedHighlights = [
      ...highlights.filter((h) => h.id !== newHighlight.id),
      newHighlight,
    ];
    setHighlights(updatedHighlights);
    await storeData("highlights", updatedHighlights);
  };
  const removeHighlight = async (id: string) => {
    try {
      const updatedHighlights = highlights.filter((h) => h.id !== id);
      setHighlights(updatedHighlights);
      await storeData("highlights", updatedHighlights);
      return true;
    } catch (error) {
      console.error("Error removing highlight:", error);
      Alert.alert("Error", "Failed to remove highlight");
      return false;
    }
  };

  //copy

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied", "Text copied to clipboard.");
  };

  const isBookmarked = (id: string) => {
    return bookmarks.some((b) => b.id === id);
  };

  const getHighlightColor = (id: string) => {
    const highlight = highlights.find((h) => h.id === id);
    return highlight ? highlight.color : null;
  };

  return {
    bookmarks,
    notes,
    highlights,
    addBookmark,
    removeBookmark,
    addNote,
    updateNote,
    removeNote,
    removeNoteByReference,
    addHighlight,
    removeHighlight,
    copyToClipboard,
    isBookmarked,
    getHighlightColor,
  };
};
