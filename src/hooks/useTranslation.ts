import { useCallback, useState } from "react";
import { transcribeAudio, translateText } from "../lib/api";
import { validateAudioFile } from "../lib/audioValidation";
import { morseToText, textToMorse } from "../lib/morse";

export interface TranslationState {
  transcript: string;
  morseOutput: string;
  reverseMorseInput: string;
  statusMessage: string;
  errorMessage: string;
  isBusy: boolean;
  processingMs: number | null;
}

export interface TranslationActions {
  setTranscript: (v: string) => void;
  setReverseMorseInput: (v: string) => void;
  setMorseOutput: (v: string) => void;
  handleFileSelected: (file: File | null) => Promise<void>;
  handleTranscribeBlob: (blob: Blob, filename: string, append?: boolean) => Promise<void>;
  handleTranslate: () => Promise<void>;
  handleReverseTranslate: () => void;
}

export function useTranslation(): TranslationState & TranslationActions {
  const [transcript, setTranscript] = useState("");
  const [morseOutput, setMorseOutput] = useState("");
  const [reverseMorseInput, setReverseMorseInput] = useState("");
  const [statusMessage, setStatusMessage] = useState("Ready.");
  const [errorMessage, setErrorMessage] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [processingMs, setProcessingMs] = useState<number | null>(null);

  const handleTranscribeBlob = useCallback(async (blob: Blob, filename: string, append = false) => {
    setIsBusy(true);
    setErrorMessage("");
    setStatusMessage("Transcribing audio...");
    const started = performance.now();

    try {
      const response = await transcribeAudio(blob, filename);
      const incoming = response.transcript.trim();

      setTranscript((prev) => {
        if (!append) return incoming;
        if (!prev) return incoming;
        if (incoming && prev.endsWith(incoming)) return prev;
        return `${prev} ${incoming}`.trim();
      });

      setStatusMessage(append ? "Live chunk transcribed." : "Transcription complete.");
    } catch (error) {
      // AbortError means the user cancelled — do not show an error
      if (error instanceof DOMException && error.name === "AbortError") return;
      const message = error instanceof Error ? error.message : "Transcription failed.";
      setErrorMessage(message);
      setStatusMessage("Manual editing is available while API is unavailable.");
    } finally {
      setProcessingMs(Math.round(performance.now() - started));
      setIsBusy(false);
    }
  }, []);

  const handleFileSelected = useCallback(async (file: File | null) => {
    if (!file) return;
    const check = validateAudioFile(file);
    if (!check.ok) {
      setErrorMessage(check.reason ?? "Invalid file.");
      return;
    }
    await handleTranscribeBlob(file, file.name);
  }, [handleTranscribeBlob]);

  const handleTranslate = useCallback(async () => {
    if (!transcript.trim()) return;
    setIsBusy(true);
    setErrorMessage("");
    setStatusMessage("Translating text to Morse...");
    const started = performance.now();

    try {
      const response = await translateText(transcript);
      setMorseOutput(response.morse);
      setStatusMessage("Morse output ready.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      // Fallback to local converter
      const fallback = textToMorse(transcript);
      setMorseOutput(fallback);
      const message = error instanceof Error ? error.message : "Translate API failed.";
      setErrorMessage(`${message} Local fallback applied.`);
      setStatusMessage("Morse generated with local converter.");
    } finally {
      setProcessingMs(Math.round(performance.now() - started));
      setIsBusy(false);
    }
  }, [transcript]);

  const handleReverseTranslate = useCallback(() => {
    const restored = morseToText(reverseMorseInput);
    setTranscript(restored);
    setStatusMessage("Reverse translation placed into transcript.");
  }, [reverseMorseInput]);

  return {
    transcript,
    morseOutput,
    reverseMorseInput,
    statusMessage,
    errorMessage,
    isBusy,
    processingMs,
    setTranscript,
    setReverseMorseInput,
    setMorseOutput,
    handleFileSelected,
    handleTranscribeBlob,
    handleTranslate,
    handleReverseTranslate,
  };
}
