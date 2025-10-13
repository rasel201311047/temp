import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

// --- CONFIG ---
const MURF_API_KEY = "ap2_e0df179a-12b3-4dc6-a35e-9824d4929a7f";
const VOICE_ID = "en-US-terrell";
const VOICE_STYLE = "Inspirational";

// --- TYPES ---
type Verse = {
  verse?: string | number;
  text: string;
};

// --- GENERATE SPEECH (MURF.AI REST API) ---
async function generateSpeech(text: string): Promise<string> {
  try {
    console.log("Sending request to Murf API...");

    const response = await fetch("https://api.murf.ai/v1/speech/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": MURF_API_KEY,
      },
      body: JSON.stringify({
        voice_id: VOICE_ID,
        style: VOICE_STYLE,
        format: "mp3",
        text,
      }),
    });

    // Get raw response text first for debugging
    const responseText = await response.text();
    console.log("Murf API raw response:", responseText);

    if (!response.ok) {
      let errorMsg = responseText;
      try {
        const errorData = JSON.parse(responseText);
        errorMsg =
          errorData.errorMessage ||
          errorData.error ||
          errorData.message ||
          JSON.stringify(errorData);
      } catch (e) {
        // If not JSON, use raw text
      }
      throw new Error(`Murf API error: ${response.status} - ${errorMsg}`);
    }

    // Parse successful response
    let result;
    try {
      result = JSON.parse(responseText);
      console.log("Parsed API response:", JSON.stringify(result, null, 2));
    } catch (parseError) {
      throw new Error(`Failed to parse API response: ${responseText}`);
    }

    const audioUrl =
      result.audioFile ||
      result.audio_url ||
      result.audio?.url ||
      result.url ||
      result.downloadUrl ||
      result.data?.audio_url ||
      result.data?.url;

    if (!audioUrl) {
      console.error(
        "Invalid Murf API response structure. Available keys:",
        Object.keys(result)
      );
      throw new Error(
        "Invalid response format from Murf API: Missing audio URL"
      );
    }

    console.log("Downloading audio from:", audioUrl);

    const fileUri = `${FileSystem.cacheDirectory}tts_${Date.now()}.mp3`;
    const { uri } = await FileSystem.downloadAsync(audioUrl, fileUri);

    console.log("Audio downloaded to:", uri);
    return uri;
  } catch (error) {
    console.error("Error in generateSpeech:", error);
    throw error;
  }
}

// --- TTS SERVICE CLASS ---
class TTSServiceDrawer {
  private verses: Verse[] = [];
  private currentVerseIndex: number = 0;
  private isInitialized: boolean = false;
  private isPlaying: boolean = false;
  private sound: Audio.Sound | null = null;
  private currentAudioUri: string | null = null;
  private currentTextHash: string = "";

  private progressInterval: NodeJS.Timeout | null = null;

  private onPlayStateChange: ((playing: boolean) => void) | null = null;
  private onVerseChange: ((index: number) => void) | null = null;
  private onProgressUpdate:
    | ((progress: { currentTime: number; duration: number }) => void)
    | null = null;

  // --- SETUP ---
  setVerses(verses: Verse[]) {
    this.verses = verses;
    this.isInitialized = true;
    console.log(`Set ${verses.length} verses`);
  }

  setCurrentVerseIndex(index: number) {
    if (index >= 0 && index < this.verses.length) {
      this.currentVerseIndex = index;
      console.log("Current verse index set to:", index);
    }
  }

  setOnPlayStateChange(cb: ((playing: boolean) => void) | null) {
    this.onPlayStateChange = cb;
  }

  setOnVerseChange(cb: ((index: number) => void) | null) {
    this.onVerseChange = cb;
  }

  setOnProgressUpdate(
    cb: ((progress: { currentTime: number; duration: number }) => void) | null
  ) {
    this.onProgressUpdate = cb;
  }

  // --- PLAYBACK ---
  async playVerse(index: number | null = null) {
    if (!this.isInitialized) {
      console.log("TTS Service not initialized");
      return;
    }

    if (index !== null) {
      this.currentVerseIndex = index;
    }

    try {
      const verse = this.verses[this.currentVerseIndex];
      if (!verse || !verse.text) {
        console.log("No verse text available");
        return;
      }

      // Create a simple hash of the current text to check if it's different
      const textHash = this.simpleHash(verse.text);
      const isDifferentText = this.currentTextHash !== textHash;

      // Always stop current playback completely when starting new text
      await this.stop();

      if (isDifferentText || !this.currentAudioUri) {
        console.log(
          `Generating new speech for verse ${this.currentVerseIndex}: ${verse.text.substring(0, 50)}...`
        );

        const uri = await generateSpeech(verse.text);
        this.currentAudioUri = uri;
        this.currentTextHash = textHash;
      }

      // Always create new sound instance to ensure fresh start
      const { sound } = await Audio.Sound.createAsync(
        { uri: this.currentAudioUri! },
        { shouldPlay: true, positionMillis: 0 },
        this.onPlaybackStatusUpdate.bind(this)
      );

      this.sound = sound;
      this.isPlaying = true;
      this.onPlayStateChange?.(true);
      this.onVerseChange?.(this.currentVerseIndex);

      this.startProgressTracking();
      console.log("Playback started from beginning for new text");
    } catch (error) {
      console.error("Error playing verse:", error);
      this.isPlaying = false;
      this.onPlayStateChange?.(false);
    }
  }

  private simpleHash(text: string): string {
    // Simple hash function to identify text changes
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  private async onPlaybackStatusUpdate(status: any) {
    if (!status.isLoaded) return;

    if (status.didJustFinish) {
      console.log("Playback finished");
      this.isPlaying = false;
      this.onPlayStateChange?.(false);
      this.stopProgressTracking();
    }
  }

  async pause() {
    if (this.sound) {
      try {
        await this.sound.pauseAsync();
        console.log("Playback paused");
      } catch (e) {
        console.log("Error during pause:", e);
      }
    }
    this.isPlaying = false;
    this.onPlayStateChange?.(false);
    this.stopProgressTracking();
  }

  async stop() {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        console.log("Playback stopped and unloaded");
      } catch (e) {
        console.log("Error during stop:", e);
      }
      this.sound = null;
    }
    this.isPlaying = false;
    this.onPlayStateChange?.(false);
    this.stopProgressTracking();
  }

  async resume() {
    if (!this.isPlaying && this.sound) {
      try {
        await this.sound.playAsync();
        this.isPlaying = true;
        this.onPlayStateChange?.(true);
        this.startProgressTracking();
        console.log("Playback resumed");
      } catch (resumeError) {
        console.log("Resume failed:", resumeError);
        // If resume fails, restart from beginning
        await this.playVerse(this.currentVerseIndex);
      }
    } else if (!this.isPlaying && this.verses.length > 0) {
      await this.playVerse(this.currentVerseIndex);
    }
  }

  async togglePlayPause() {
    if (this.isPlaying) {
      await this.pause();
    } else {
      await this.resume();
    }
  }

  async playNextVerse() {
    if (this.currentVerseIndex < this.verses.length - 1) {
      this.currentVerseIndex++;
      console.log("Playing next verse:", this.currentVerseIndex);
      await this.playVerse(this.currentVerseIndex);
    } else {
      console.log("Reached end of verses");
      await this.stop();
    }
  }

  async playPreviousVerse() {
    if (this.currentVerseIndex > 0) {
      this.currentVerseIndex--;
      console.log("Playing previous verse:", this.currentVerseIndex);
      await this.playVerse(this.currentVerseIndex);
    }
  }

  // --- SEEK / PROGRESS ---
  async jumpSeconds(seconds: number) {
    if (!this.sound) return;

    try {
      const status = await this.sound.getStatusAsync();
      if (status.isLoaded && status.positionMillis !== undefined) {
        const newPosition = Math.max(0, status.positionMillis + seconds * 1000);
        const duration = status.durationMillis || 0;

        if (newPosition >= duration) {
          await this.playNextVerse();
        } else if (newPosition <= 0) {
          await this.playPreviousVerse();
        } else {
          await this.sound.setPositionAsync(newPosition);
          this.onProgressUpdate?.({
            currentTime: newPosition / 1000,
            duration: duration / 1000,
          });
        }
      }
    } catch (error) {
      console.error("Error jumping:", error);
    }
  }

  // Method to completely reset and play new content
  async resetAndPlayNewContent(
    newVerses: Verse[],
    initialVerseIndex: number = 0
  ) {
    await this.stop();
    this.setVerses(newVerses);
    this.setCurrentVerseIndex(initialVerseIndex);
    await this.playVerse(initialVerseIndex);
  }

  private startProgressTracking() {
    this.stopProgressTracking();
    this.progressInterval = setInterval(async () => {
      if (this.sound) {
        try {
          const status = await this.sound.getStatusAsync();
          if (status.isLoaded && this.onProgressUpdate) {
            this.onProgressUpdate({
              currentTime: status.positionMillis / 1000,
              duration: status.durationMillis
                ? status.durationMillis / 1000
                : 1,
            });
          }
        } catch (error) {
          console.log("Progress tracking error:", error);
        }
      }
    }, 400);
  }

  private stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  async cleanup() {
    await this.stop();
    this.verses = [];
    this.currentVerseIndex = 0;
    this.isInitialized = false;
    this.currentAudioUri = null;
    this.currentTextHash = "";
    console.log("TTS Service completely cleaned up");
  }

  // --- GETTERS ---
  getCurrentVerseIndex(): number {
    return this.currentVerseIndex;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getVersesCount(): number {
    return this.verses.length;
  }
}

export default new TTSServiceDrawer();
