import AsyncStorage from "@react-native-async-storage/async-storage";

const BOOKMARKS_KEY = "BOOKMARKS";
const NOTES_KEY = "NOTES";

// ✅ Save Bookmark
export const addBookmark = async (verse) => {
  try {
    const stored = await AsyncStorage.getItem(BOOKMARKS_KEY);
    const bookmarks = stored ? JSON.parse(stored) : [];
    if (!bookmarks.find((b) => b.verse === verse.verse)) {
      bookmarks.push(verse);
      await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    }
  } catch (err) {
    console.log("Error saving bookmark", err);
  }
};

// ✅ Get Bookmarks
export const getBookmarks = async () => {
  try {
    const stored = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// ✅ Remove Bookmark
export const removeBookmark = async (verseNumber) => {
  try {
    const stored = await AsyncStorage.getItem(BOOKMARKS_KEY);
    let bookmarks = stored ? JSON.parse(stored) : [];
    bookmarks = bookmarks.filter((b) => b.verse !== verseNumber);
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  } catch {}
};

// ✅ Notes
export const addNote = async (verse, note) => {
  try {
    const stored = await AsyncStorage.getItem(NOTES_KEY);
    const notes = stored ? JSON.parse(stored) : {};
    notes[verse.verse] = { verse, note };
    await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  } catch {}
};

export const getNotes = async () => {
  try {
    const stored = await AsyncStorage.getItem(NOTES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};
