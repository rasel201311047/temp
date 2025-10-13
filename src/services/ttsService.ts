import Tts from "react-native-tts";

type Verse = {
  verse?: string | number;
  text?: string;
};

class TTSService {
  private verses: Verse[] = [];
  private currentVerseIndex: number = 0;
  private isPlaying: boolean = false;
  private onPlayStateChange: ((playing: boolean) => void) | null = null;
  private onVerseChange: ((index: number) => void) | null = null;
  private startTime: number = 0;
  private estimatedDuration: number = 0;

  constructor() {
    this.initializeTTS();
  }

  private initializeTTS = async () => {
    try {
      // Initialize TTS
      await Tts.setDefaultLanguage("en-US");

      // Set the voice to "Vince Douglas" if available
      const voices = await Tts.voices();
      const vinceDouglasVoice = voices.find(
        (voice) =>
          voice.name.includes("Vince") ||
          voice.name.includes("Douglas") ||
          voice.name.toLowerCase().includes("vince") ||
          voice.name.toLowerCase().includes("douglas")
      );

      if (vinceDouglasVoice) {
        await Tts.setDefaultVoice(vinceDouglasVoice.id);
      } else {
        // Fallback to a male voice if Vince Douglas is not available
        const maleVoice = voices.find(
          (voice) =>
            voice.name.toLowerCase().includes("male") ||
            voice.gender?.toLowerCase() === "male"
        );
        if (maleVoice) {
          await Tts.setDefaultVoice(maleVoice.id);
        }
      }

      // Set speech rate (adjust as needed)
      await Tts.setDefaultRate(0.5, true);

      // Set up event listeners
      Tts.addEventListener("tts-start", this.onSpeechStart);
      Tts.addEventListener("tts-finish", this.onSpeechFinish);
      Tts.addEventListener("tts-cancel", this.onSpeechCancel);
      Tts.addEventListener("tts-progress", this.onSpeechProgress);
    } catch (error) {
      console.error("Error initializing TTS:", error);
    }
  };

  setVerses = (verses: Verse[]) => {
    this.verses = verses;
  };

  setCurrentVerseIndex = (index: number) => {
    this.currentVerseIndex = index;
  };

  setOnPlayStateChange = (callback: ((playing: boolean) => void) | null) => {
    this.onPlayStateChange = callback;
  };

  setOnVerseChange = (callback: ((index: number) => void) | null) => {
    this.onVerseChange = callback;
  };

  private onSpeechStart = (event: any) => {
    this.isPlaying = true;
    this.startTime = Date.now();

    // Estimate duration based on text length (average reading speed: 150 words per minute)
    const currentVerse = this.verses[this.currentVerseIndex];
    if (currentVerse && currentVerse.text) {
      const wordCount = currentVerse.text.split(" ").length;
      this.estimatedDuration = (wordCount / 150) * 60 * 1000; // Convert to milliseconds
    }

    if (this.onPlayStateChange) {
      this.onPlayStateChange(true);
    }
  };

  private onSpeechFinish = (event: any) => {
    this.isPlaying = false;

    if (this.onPlayStateChange) {
      this.onPlayStateChange(false);
    }

    // Play next verse automatically if available
    if (this.currentVerseIndex < this.verses.length - 1) {
      this.playNextVerse();
    }
  };

  private onSpeechCancel = (event: any) => {
    this.isPlaying = false;

    if (this.onPlayStateChange) {
      this.onPlayStateChange(false);
    }
  };

  private onSpeechProgress = (event: any) => {
    // You can use this event to track progress if needed
  };

  togglePlayPause = async () => {
    if (this.isPlaying) {
      await Tts.stop();
      this.isPlaying = false;
    } else {
      await this.speakCurrentVerse();
    }
  };

  private speakCurrentVerse = async () => {
    if (this.currentVerseIndex >= this.verses.length) return;

    const currentVerse = this.verses[this.currentVerseIndex];
    if (!currentVerse || !currentVerse.text) return;

    try {
      await Tts.stop(); // Stop any ongoing speech
      await Tts.speak(currentVerse.text);

      if (this.onVerseChange) {
        this.onVerseChange(this.currentVerseIndex);
      }
    } catch (error) {
      console.error("Error speaking verse:", error);
    }
  };

  playNextVerse = () => {
    if (this.currentVerseIndex < this.verses.length - 1) {
      this.currentVerseIndex++;
      this.speakCurrentVerse();
    }
  };

  playPreviousVerse = () => {
    if (this.currentVerseIndex > 0) {
      this.currentVerseIndex--;
      this.speakCurrentVerse();
    }
  };

  jumpSeconds = async (seconds: number) => {
    // Note: TTS doesn't support seeking, so we'll need to stop and restart
    // This is a limitation of react-native-tts
    await Tts.stop();

    // For a proper seek implementation, you might need a different TTS solution
    // that supports seeking within speech
    this.speakCurrentVerse();
  };

  pause = async () => {
    await Tts.stop();
    this.isPlaying = false;

    if (this.onPlayStateChange) {
      this.onPlayStateChange(false);
    }
  };

  getProgress = () => {
    if (!this.isPlaying) {
      return { currentTime: 0, duration: 1 };
    }

    const elapsed = Date.now() - this.startTime;
    const currentTime = Math.min(elapsed / 1000, this.estimatedDuration / 1000);

    return {
      currentTime,
      duration: this.estimatedDuration / 1000,
    };
  };
}

export default new TTSService();
