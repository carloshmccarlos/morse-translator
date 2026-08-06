import { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { BrandHeader } from "./components/BrandHeader";
import { ToastContainer } from "./components/ToastContainer";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { useBatchTranslation } from "./hooks/useBatchTranslation";
import { useCurrentDownloadUrls, useBatchDownloadUrls } from "./hooks/useDownloads";
import { useMorsePlayer } from "./hooks/useMorsePlayer";
import { useToast } from "./hooks/useToast";
import { useTranslation } from "./hooks/useTranslation";
import { AboutPage } from "./pages/AboutPage";
import { FaqPage } from "./pages/FaqPage";
import { BatchTranslationPanel } from "./components/BatchTranslationPanel";
import { SignalLampPanel } from "./components/SignalLampPanel";
import { LearningModePanel } from "./components/LearningModePanel";

// Home-page FAQ block — mirrors the FAQPage JSON-LD in index.html so the
// structured data always has a matching visible source on the page.
const HOME_FAQS: { q: string; a: string }[] = [
  {
    q: "How does MorseAI convert audio to Morse code?",
    a: "MorseAI uses AI speech recognition (powered by Deepgram) to transcribe your audio recording or uploaded file into text. It then converts each character to its international Morse code equivalent using the ITU-R M.1677 standard, producing a dot-and-dash sequence you can play, view, or download.",
  },
  {
    q: "What audio formats does MorseAI support?",
    a: "MorseAI supports WAV, MP3, M4A, and OGG audio files up to 3MB. You can also record directly using your browser microphone for up to 30 seconds.",
  },
  {
    q: "Can I translate Morse code back to text?",
    a: "Yes. Use the Reverse Translation feature: paste any Morse code string using dots (.), dashes (-), and slash (/) word separators into the Morse Input field, then click Reverse Translate Morse to get the original text instantly.",
  },
  {
    q: "Is MorseAI free to use?",
    a: "Yes, MorseAI is completely free with no registration or account required. All features including audio upload, microphone recording, batch translation, and WAV export are available at no cost.",
  },
  {
    q: "What is the WPM setting in MorseAI?",
    a: "WPM stands for Words Per Minute. It controls the speed of the Morse code tone playback and WAV audio export. You can adjust it from 5 WPM (very slow, good for learning) to 40 WPM (experienced operator speed) using the slider in the Morse Output panel.",
  },
  {
    q: "Can I translate multiple texts to Morse code at once?",
    a: "Yes. The Batch Translation Deck feature lets you import a .txt, .csv, .xls, or .xlsx file containing multiple texts. Each entry is automatically translated to its own Morse row. You can then export all translations as TXT, CSV, or Excel.",
  },
  {
    q: "What Morse code standard does MorseAI use?",
    a: "MorseAI uses the ITU-R M.1677 International Morse Code standard, which covers all 26 letters (A-Z), digits 0-9, and 17 punctuation symbols including period, comma, question mark, exclamation point, and more.",
  },
];

function TranslatorPage() {
  useEffect(() => {
    document.title = "MorseAI — Audio Morse Code Translator (Free)";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Free AI morse code translator — record your voice or upload audio (WAV/MP3/M4A) to get instant Morse code output. Play as tone, blink as light, batch translate files, or download .wav. No signup needed."
      );
    }
  }, []);

  const { toasts, notify, dismiss } = useToast();
  const recorder = useAudioRecorder({ maxSeconds: 30 });
  const player = useMorsePlayer();

  // Settings states with localStorage persistence
  const [toneFrequency, setToneFrequency] = useState<number>(() => {
    const saved = localStorage.getItem("setting_frequency");
    return saved ? Number(saved) : 650;
  });
  const [toneVolume, setToneVolume] = useState<number>(() => {
    const saved = localStorage.getItem("setting_volume");
    return saved ? Number(saved) : 0.25; // 25% default volume is comfortable
  });
  const [lampColor, setLampColor] = useState<string>(() => {
    return localStorage.getItem("setting_lamp_color") || "emerald";
  });
  const [wpm, setWpm] = useState<number>(() => {
    const saved = localStorage.getItem("setting_wpm");
    return saved ? Number(saved) : 18;
  });

  useEffect(() => {
    localStorage.setItem("setting_frequency", String(toneFrequency));
  }, [toneFrequency]);
  useEffect(() => {
    localStorage.setItem("setting_volume", String(toneVolume));
  }, [toneVolume]);
  useEffect(() => {
    localStorage.setItem("setting_lamp_color", lampColor);
  }, [lampColor]);
  useEffect(() => {
    localStorage.setItem("setting_wpm", String(wpm));
  }, [wpm]);

  const translation = useTranslation();
  const batch = useBatchTranslation(notify);

  // Layout Tab selection
  const [activeTab, setActiveTab] = useState<"translator" | "batch" | "lamp" | "learning">("translator");
  // Audio Input mode ('upload' | 'record')
  const [audioInputType, setAudioInputType] = useState<"upload" | "record">("upload");
  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  // Modals state
  const [showSettings, setShowSettings] = useState(false);
  const [showFullGuide, setShowFullGuide] = useState(false);

  // Surface recorder errors via Toast
  useMemo(() => {
    if (recorder.error) notify(recorder.error, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorder.error]);

  async function handleSubmitRecorded() {
    if (!recorder.audioBlob) {
      notify("No recording available. Record first.", true);
      return;
    }
    await translation.handleTranscribeBlob(recorder.audioBlob, "recording.weba");
  }

  async function handleCopy() {
    if (!translation.morseOutput) return;
    try {
      await navigator.clipboard.writeText(translation.morseOutput);
      notify("Morse copied to clipboard.");
    } catch {
      notify("Clipboard access denied.", true);
    }
  }

  const isBusy = translation.isBusy || batch.isBusy;

  const currentUrls = useCurrentDownloadUrls(
    translation.transcript,
    translation.morseOutput,
    wpm
  );
  const batchUrls = useBatchDownloadUrls(batch.batchRows);

  // Format record timer
  const recordSecs = String(recorder.elapsedSeconds).padStart(2, "0");

  return (
    <main className="flex flex-col gap-6 lg:flex-row">
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-full shrink-0 lg:w-60 flex flex-col gap-4">
        {/* Navigation list */}
        <div className="panel flex flex-col gap-1 bg-white/70 dark:bg-panel/80">
          {[
            { id: "translator", label: "Translator", icon: "🎙️" },
            { id: "batch", label: "Batch Deck", icon: "📁" },
            { id: "lamp", label: "Visual Lamp", icon: "💡" },
            { id: "learning", label: "Learning Mode", icon: "🎓" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={[
                "flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 text-left border",
                activeTab === tab.id
                  ? "bg-amber-500/10 border-amber-500/30 text-text-title shadow-sm dark:bg-amber-300/10 dark:border-amber-300/30 font-semibold"
                  : "border-transparent text-text-muted hover:bg-amber-500/5 dark:hover:bg-amber-300/8",
              ].join(" ")}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}

          <hr className="my-2 border-amber-500/10 dark:border-amber-300/10" />

          {/* Settings trigger */}
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium border border-transparent text-text-muted hover:bg-amber-500/5 dark:hover:bg-amber-300/8 transition-all"
          >
            <span className="text-base">⚙️</span>
            <span>Settings</span>
          </button>
        </div>

        {/* Quick Guide card */}
        <div className="panel flex flex-col gap-3 bg-white/70 dark:bg-panel/80">
          <p className="font-display text-xs uppercase tracking-[0.16em] text-text-title">
            Morse Quick Guide
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono text-text-muted border-b border-amber-500/10 dark:border-amber-300/10 pb-3">
            <div>E <span className="text-emerald-600 dark:text-accent font-bold">.</span></div>
            <div>T <span className="text-emerald-600 dark:text-accent font-bold">-</span></div>
            <div>S <span className="text-emerald-600 dark:text-accent font-bold">...</span></div>
            <div>H <span className="text-emerald-600 dark:text-accent font-bold">....</span></div>
          </div>
          <button
            onClick={() => setShowFullGuide(true)}
            className="w-full rounded-lg border border-amber-500/30 dark:border-amber-300/25 py-2 text-center text-xs font-medium text-text-title transition hover:bg-amber-500/10 dark:hover:bg-amber-300/10"
          >
            View Full Guide
          </button>
        </div>
      </aside>

      {/* 2. Main Right Content Area */}
      <div className="flex-1 min-w-0">
        {activeTab === "translator" && (
          <div className="flex flex-col gap-6">
            {/* 1. Translator Main Card */}
            <section className="panel relative overflow-hidden bg-white/70 dark:bg-panel/80">
              <div className="absolute -top-24 right-8 h-40 w-40 rounded-full bg-amber-300/5 dark:bg-amber-300/10 blur-3xl pointer-events-none" />
              
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-amber-500/10 dark:border-amber-300/10 pb-4">
                <div>
                  <h2 className="section-title">Translator</h2>
                  <p className="mt-1 text-xs text-text-muted">
                    Convert between text and Morse code with audio
                  </p>
                </div>
                <div className="rounded-full border border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-2xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  🔒 Local & Secure
                </div>
              </div>

              {/* Two Column Workspace */}
              <div className="mt-5 grid gap-6 xl:grid-cols-2">
                {/* Left Column: Input Hub */}
                <div className="flex flex-col gap-4">
                  <p className="font-display text-xs uppercase tracking-[0.16em] text-text-title">
                    Input Method
                  </p>
                  
                  {/* Upload / Record switch */}
                  <div className="flex rounded-lg bg-bg-input p-1">
                    <button
                      type="button"
                      onClick={() => setAudioInputType("upload")}
                      className={[
                        "flex-1 rounded-md py-1.5 text-center text-xs font-semibold transition-all",
                        audioInputType === "upload"
                          ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-text-main"
                          : "text-text-muted hover:text-text-main",
                      ].join(" ")}
                    >
                      Upload Audio
                    </button>
                    <button
                      type="button"
                      onClick={() => setAudioInputType("record")}
                      className={[
                        "flex-1 rounded-md py-1.5 text-center text-xs font-semibold transition-all",
                        audioInputType === "record"
                          ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-text-main"
                          : "text-text-muted hover:text-text-main",
                      ].join(" ")}
                    >
                      Record Audio
                    </button>
                  </div>

                  {/* Upload UI with Drag and Drop */}
                  {audioInputType === "upload" && (
                    <div 
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => {
                        setIsDragging(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          translation.handleFileSelected(file);
                        }
                      }}
                      className={[
                        "flex flex-col items-center justify-center rounded-2xl border border-dashed p-6 transition-all duration-200",
                        isDragging 
                          ? "border-amber-500 bg-amber-500/10 dark:border-amber-300 dark:bg-amber-300/10" 
                          : "border-border-input bg-bg-input"
                      ].join(" ")}
                    >
                      <svg className="h-10 w-10 text-amber-600 dark:text-amber-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="mt-3 text-sm font-medium text-text-main">
                        Drag & drop audio file here
                      </p>
                      <p className="mt-1 text-2xs text-text-muted">
                        .wav, .mp3, .m4a, .ogg (max 3MB)
                      </p>

                      <label className="mt-4 inline-flex cursor-pointer items-center rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-semibold text-white dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-200 transition">
                        Choose File
                        <input
                          type="file"
                          accept="audio/*"
                          className="hidden"
                          onChange={(e) => translation.handleFileSelected(e.target.files?.[0] ?? null)}
                        />
                      </label>
                    </div>
                  )}

                  {/* Record UI */}
                  {audioInputType === "record" && (
                    <div className="rounded-2xl border border-border-input bg-bg-input p-4 flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-text-main">
                          Recording (up to 30s)
                        </span>
                        <span className="text-xs font-mono text-emerald-600 dark:text-accent font-medium">
                          00:{recordSecs} / 00:30
                        </span>
                      </div>

                      {/* Real-time audio responsive waveform */}
                      <div className="h-10 flex items-center justify-center gap-1.5 bg-black/20 dark:bg-black/40 rounded-xl px-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => {
                          const scale = 0.4 + 0.6 * Math.sin((i / 15) * Math.PI);
                          const calculatedHeight = recorder.isRecording 
                            ? Math.max(8, Math.min(32, Math.round(recorder.volume * 0.32 * scale)))
                            : 8;
                          return (
                            <div
                              key={i}
                              style={{ height: `${calculatedHeight}px` }}
                              className={[
                                "w-1 rounded-full bg-emerald-500 dark:bg-accent transition-all duration-75",
                                !recorder.isRecording && "opacity-50",
                              ].join(" ")}
                            />
                          );
                        })}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={recorder.startRecording}
                            disabled={recorder.isRecording || isBusy}
                            className="rounded-md bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 px-3 py-1.5 text-xs font-semibold transition"
                          >
                            Start
                          </button>
                          <button
                            type="button"
                            onClick={recorder.stopRecording}
                            disabled={!recorder.isRecording}
                            className="rounded-md bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 px-3 py-1.5 text-xs font-semibold transition"
                          >
                            Stop
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={handleSubmitRecorded}
                          disabled={!recorder.audioBlob || isBusy}
                          className="rounded-md bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-40 px-4 py-1.5 text-xs font-semibold transition"
                        >
                          Submit
                        </button>
                      </div>
                      <p className="text-2xs text-text-muted">
                        Status: <span className="font-semibold text-text-main">{recorder.isRecording ? "Recording..." : "Idle"}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Right Column: Output result */}
                <div className="flex flex-col gap-4">
                  <p className="font-display text-xs uppercase tracking-[0.16em] text-text-title">
                    Output
                  </p>
                  
                  {/* Morse display box */}
                  <div className="relative rounded-2xl border border-border-input bg-bg-input p-4 min-h-[148px] flex flex-col justify-between">
                    <p className="break-all font-body text-base tracking-[0.12em] text-text-main pr-8">
                      {translation.morseOutput || "No Morse output yet."}
                    </p>
                    <button
                      type="button"
                      onClick={handleCopy}
                      disabled={!translation.morseOutput}
                      className="absolute right-3 top-3 text-neutral-400 hover:text-text-title disabled:opacity-30"
                      aria-label="Copy Morse code"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>

                  {/* Playback speed controller */}
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs font-semibold text-text-main shrink-0">
                      Playback Speed (WPM)
                    </span>
                    <div className="flex-1 flex items-center gap-3">
                      <input
                        type="range"
                        min="5"
                        max="40"
                        value={wpm}
                        onChange={(e) => setWpm(Number(e.target.value))}
                        className="w-full accent-amber-600 dark:accent-amber-400"
                      />
                      <span className="w-8 text-center rounded bg-amber-500/10 dark:bg-black/30 border border-amber-500/20 dark:border-amber-300/10 py-0.5 text-xs font-mono font-bold text-text-title">
                        {wpm}
                      </span>
                    </div>
                  </div>

                  {/* Play control buttons */}
                  <div className="grid gap-2 grid-cols-3">
                    <button
                      type="button"
                      onClick={() => player.play(translation.morseOutput, wpm, toneFrequency, toneVolume)}
                      disabled={!translation.morseOutput || player.isPlaying}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 py-2.5 text-xs font-semibold transition"
                    >
                      ▶ Play
                    </button>
                    <button
                      type="button"
                      onClick={player.stop}
                      disabled={!player.isPlaying}
                      className="flex items-center justify-center gap-1.5 rounded-lg bg-neutral-500 hover:bg-neutral-600 text-white disabled:opacity-40 py-2.5 text-xs font-semibold transition"
                    >
                      ■ Stop
                    </button>
                    <button
                      type="button"
                      onClick={handleCopy}
                      disabled={!translation.morseOutput}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/30 dark:border-amber-300/20 text-text-title disabled:opacity-40 py-2.5 text-xs font-semibold transition hover:bg-amber-500/10"
                    >
                      📋 Copy
                    </button>
                  </div>

                  {/* Export and download files */}
                  <div className="grid gap-2 grid-cols-3 text-3xs sm:text-2xs font-semibold">
                    <a
                      href={currentUrls.txtUrl || undefined}
                      download="morse-output.txt"
                      onClick={() => notify("TXT export downloaded.")}
                      className={[
                        "rounded-lg bg-bg-input hover:bg-neutral-200 dark:hover:bg-black/50 text-text-main py-2 text-center transition flex items-center justify-center",
                        !currentUrls.txtUrl ? "opacity-40 pointer-events-none" : ""
                      ].join(" ")}
                    >
                      📂 Export TXT
                    </a>
                    <a
                      href={currentUrls.csvUrl || undefined}
                      download="morse-output.csv"
                      onClick={() => notify("CSV export downloaded.")}
                      className={[
                        "rounded-lg bg-bg-input hover:bg-neutral-200 dark:hover:bg-black/50 text-text-main py-2 text-center transition flex items-center justify-center",
                        !currentUrls.csvUrl ? "opacity-40 pointer-events-none" : ""
                      ].join(" ")}
                    >
                      📂 Export CSV
                    </a>
                    <a
                      href={currentUrls.xlsxUrl || undefined}
                      download="morse-output.xlsx"
                      onClick={() => notify("Excel export downloaded.")}
                      className={[
                        "rounded-lg bg-bg-input hover:bg-neutral-200 dark:hover:bg-black/50 text-text-main py-2 text-center transition flex items-center justify-center",
                        !currentUrls.xlsxUrl ? "opacity-40 pointer-events-none" : ""
                      ].join(" ")}
                    >
                      📂 Export Excel
                    </a>
                  </div>

                  <a
                    href={currentUrls.wavUrl || undefined}
                    download="morse-output.wav"
                    onClick={() => notify("WAV downloaded.")}
                    className={[
                      "w-full rounded-lg bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500/20 dark:hover:bg-amber-500/30 dark:text-text-main py-2.5 text-xs font-semibold transition flex items-center justify-center",
                      !currentUrls.wavUrl ? "opacity-40 pointer-events-none" : ""
                    ].join(" ")}
                  >
                    📥 Download .wav
                  </a>
                </div>
              </div>
            </section>

            {/* 2. Transcript & Translation Workbench */}
            <section className="panel relative overflow-hidden bg-white/70 dark:bg-panel/80">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-amber-500/10 dark:border-amber-300/10 pb-4">
                <div>
                  <h2 className="section-title">Transcript + Translation</h2>
                  <p className="mt-1 text-xs text-text-muted">
                    Edit text before Morse conversion. Reverse translation is included.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xs font-mono text-text-muted">
                    {translation.processingMs ? `Last processing: ${translation.processingMs} ms` : "No request yet"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      translation.setTranscript("");
                      translation.setReverseMorseInput("");
                    }}
                    className="text-neutral-400 hover:text-text-title"
                    title="Reset textareas"
                  >
                    🔄
                  </button>
                </div>
              </div>

              {/* Translation textareas double column */}
              <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_auto_1fr] items-center">
                {/* Left side: Original text */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-text-title uppercase tracking-wider">
                    Original Transcript
                  </span>
                  <textarea
                    value={translation.transcript}
                    onChange={(e) => translation.setTranscript(e.target.value)}
                    placeholder="Your transcript appears here..."
                    className="min-h-28 w-full rounded-xl border border-border-input bg-bg-input p-3 text-sm text-text-main outline-none transition focus:border-amber-600 dark:focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={translation.handleTranslate}
                    disabled={isBusy || !translation.transcript.trim()}
                    className="w-full sm:w-auto self-start rounded-md bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-300/20 dark:text-text-main dark:hover:bg-amber-300/30 disabled:opacity-40 px-4 py-2 text-xs font-semibold transition"
                  >
                    Translate to Morse
                  </button>
                </div>

                {/* Swap arrow icon */}
                <div className="flex justify-center xl:pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      const temp = translation.transcript;
                      translation.setTranscript(translation.reverseMorseInput);
                      translation.setReverseMorseInput(temp);
                    }}
                    className="rounded-full border border-amber-500/30 dark:border-amber-300/20 p-2 text-text-title hover:bg-amber-500/10 transition"
                  >
                    ⇄
                  </button>
                </div>

                {/* Right side: Morse reverse input */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-text-title uppercase tracking-wider">
                    Morse Input (Reverse → Text)
                  </span>
                  <textarea
                    value={translation.reverseMorseInput}
                    onChange={(e) => translation.setReverseMorseInput(e.target.value)}
                    placeholder=".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
                    className="min-h-28 w-full rounded-xl border border-border-input bg-bg-input p-3 text-sm text-text-main outline-none transition focus:border-amber-600 dark:focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={translation.handleReverseTranslate}
                    disabled={!translation.reverseMorseInput.trim()}
                    className="w-full sm:w-auto self-start rounded-md bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-accent/20 dark:text-accent dark:hover:bg-accent/30 disabled:opacity-40 px-4 py-2 text-xs font-semibold transition"
                  >
                    Reverse Translate
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 3. Batch Translation Deck tab */}
        {activeTab === "batch" && (
          <div className="animation-slideInRight">
            <BatchTranslationPanel
              batchInput={batch.batchInput}
              rows={batch.batchRows}
              isBusy={isBusy}
              sourceLabel={batch.batchSourceLabel}
              onBatchInputChange={batch.setBatchInput}
              onBatchFileSelected={batch.handleBatchFileSelected}
              onTranslateParagraphs={batch.handleTranslateParagraphs}
              txtUrl={batchUrls.txtUrl}
              csvUrl={batchUrls.csvUrl}
              xlsxUrl={batchUrls.xlsxUrl}
              onNotify={notify}
            />
          </div>
        )}

        {/* 4. Visual Morse Lamp tab */}
        {activeTab === "lamp" && (
          <div className="animation-slideInRight">
            <SignalLampPanel morse={translation.morseOutput} wpm={wpm} lampColor={lampColor} />
          </div>
        )}

        {/* 5. Learning Mode tab */}
        {activeTab === "learning" && (
          <div className="animation-slideInRight">
            <LearningModePanel />
          </div>
        )}

        {/* FAQ Section — visible Q&A mirroring the FAQPage JSON-LD in index.html */}
        <section className="panel bg-white/70 dark:bg-panel/80" aria-label="Frequently Asked Questions">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-amber-500/10 dark:border-amber-300/10 pb-4">
            <div>
              <h2 className="section-title">Frequently Asked Questions</h2>
              <p className="mt-1 text-xs text-text-muted">Quick answers before you start</p>
            </div>
            <Link
              to="/faq"
              className="self-start rounded-lg border border-amber-500/30 dark:border-amber-300/20 px-3 py-1.5 text-2xs font-semibold text-text-title transition hover:bg-amber-500/10 dark:hover:bg-amber-300/10 sm:self-auto"
            >
              View all 23 FAQs →
            </Link>
          </div>
          <div className="mt-2">
            {HOME_FAQS.map((f) => (
              <details key={f.q} open className="border-b border-border-input last:border-0">
                <summary className="cursor-pointer py-3 text-sm font-medium text-text-title">
                  {f.q}
                </summary>
                <p className="pb-3 text-sm leading-7 text-text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Console Brand Footer */}
        <footer className="mt-8 text-center text-xs text-text-muted/70 border-t border-amber-500/5 dark:border-amber-300/5 pt-4">
          Built with MorseAI Console · Reliable · Fast · Private
        </footer>
      </div>

      {/* 3. Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="panel max-w-md w-full bg-white dark:bg-neutral-900 border border-amber-500/20 dark:border-amber-300/20 relative shadow-2xl">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-text-title text-lg"
            >
              ✕
            </button>
            <h3 className="section-title border-b border-amber-500/10 dark:border-amber-300/10 pb-3">
              Application Settings
            </h3>
            
            <div className="mt-4 flex flex-col gap-4 text-sm text-text-main">
              {/* Default WPM */}
              <div className="flex flex-col gap-1.5">
                <span className="font-semibold text-text-title">Default Speed (WPM)</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={wpm}
                    onChange={(e) => setWpm(Number(e.target.value))}
                    className="w-full accent-amber-600 dark:accent-amber-400"
                  />
                  <span className="w-8 text-center rounded bg-amber-500/10 dark:bg-black/30 border border-amber-500/20 dark:border-amber-300/10 py-0.5 text-xs font-mono font-bold text-text-title">
                    {wpm}
                  </span>
                </div>
              </div>

              {/* Tone Frequency (Pitch) */}
              <div className="flex flex-col gap-1.5">
                <span className="font-semibold text-text-title">Tone Pitch / Frequency (Hz)</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="400"
                    max="1000"
                    step="50"
                    value={toneFrequency}
                    onChange={(e) => setToneFrequency(Number(e.target.value))}
                    className="w-full accent-amber-600 dark:accent-amber-400"
                  />
                  <span className="w-12 text-center rounded bg-amber-500/10 dark:bg-black/30 border border-amber-500/20 dark:border-amber-300/10 py-0.5 text-xs font-mono font-bold text-text-title">
                    {toneFrequency}
                  </span>
                </div>
              </div>

              {/* Tone Volume */}
              <div className="flex flex-col gap-1.5">
                <span className="font-semibold text-text-title">Tone Volume</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.05"
                    max="0.5"
                    step="0.05"
                    value={toneVolume}
                    onChange={(e) => setToneVolume(Number(e.target.value))}
                    className="w-full accent-amber-600 dark:accent-amber-400"
                  />
                  <span className="w-10 text-center rounded bg-amber-500/10 dark:bg-black/30 border border-amber-500/20 dark:border-amber-300/10 py-0.5 text-xs font-mono font-bold text-text-title">
                    {Math.round(toneVolume * 200)}%
                  </span>
                </div>
              </div>

              {/* Lamp Color */}
              <div className="flex flex-col gap-1.5">
                <span className="font-semibold text-text-title">Visual Lamp Color</span>
                <div className="flex gap-2">
                  {[
                    { id: "emerald", label: "Emerald", colorClass: "bg-accent" },
                    { id: "amber", label: "Amber", colorClass: "bg-amber-500" },
                    { id: "rose", label: "Rose", colorClass: "bg-rose-500" },
                    { id: "sky", label: "Sky", colorClass: "bg-sky-500" },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setLampColor(c.id)}
                      className={[
                        "flex-1 py-1.5 px-1 rounded-lg text-2xs font-semibold border transition-all flex flex-col items-center gap-1",
                        lampColor === c.id
                          ? "border-amber-500 bg-amber-500/10 dark:border-amber-300 dark:bg-amber-300/10 text-text-title"
                          : "border-border-input hover:bg-bg-input text-text-muted",
                      ].join(" ")}
                    >
                      <span className={`h-3.5 w-3.5 rounded-full ${c.colorClass}`} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-6 w-full rounded-lg bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-300/15 dark:hover:bg-amber-300/25 dark:text-text-main py-2.5 text-xs font-semibold transition"
            >
              Dismiss Settings
            </button>
          </div>
        </div>
      )}

      {/* 4. Full Guide Reference Modal */}
      {showFullGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="panel max-w-2xl w-full bg-white dark:bg-neutral-900 border border-amber-500/20 dark:border-amber-300/20 relative shadow-2xl max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setShowFullGuide(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-text-title text-lg"
            >
              ✕
            </button>
            <h3 className="section-title border-b border-amber-500/10 dark:border-amber-300/10 pb-3">
              Morse Code Character Reference
            </h3>
            
            <div className="mt-4 grid gap-6 md:grid-cols-2 text-xs">
              <div>
                <p className="font-semibold text-text-title uppercase tracking-wider mb-2">Letters A–Z</p>
                <div className="grid grid-cols-2 gap-y-1.5 font-mono text-text-muted">
                  <div>A : ·−</div><div>N : −·</div>
                  <div>B : −···</div><div>O : −−−</div>
                  <div>C : −·−·</div><div>P : ·−−·</div>
                  <div>D : −··</div><div>Q : −−·−</div>
                  <div>E : ·</div><div>R : ·−·</div>
                  <div>F : ··−·</div><div>S : ···</div>
                  <div>G : −−·</div><div>T : −</div>
                  <div>H : ····</div><div>U : ··−</div>
                  <div>I : ··</div><div>V : ···−</div>
                  <div>J : ·−−−</div><div>W : ·−−</div>
                  <div>K : −·−</div><div>X : −··−</div>
                  <div>L : ·−··</div><div>Y : −·−−</div>
                  <div>M : −−</div><div>Z : −−··</div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <p className="font-semibold text-text-title uppercase tracking-wider mb-2">Digits 0–9</p>
                  <div className="grid grid-cols-2 gap-y-1.5 font-mono text-text-muted">
                    <div>0 : −−−−−</div><div>5 : ·····</div>
                    <div>1 : ·−−−−</div><div>6 : −····</div>
                    <div>2 : ··−−−</div><div>7 : −−···</div>
                    <div>3 : ···−−</div><div>8 : −−−··</div>
                    <div>4 : ····−</div><div>9 : −−−−·</div>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-text-title uppercase tracking-wider mb-2">Punctuation</p>
                  <div className="grid grid-cols-2 gap-y-1.5 font-mono text-text-muted">
                    <div>. : ·−·−·−</div><div>, : −−··−−</div>
                    <div>? : ··−−··</div><div>! : −·−·−−</div>
                    <div>/ : −··−·</div><div>@ : ·−−·−·</div>
                    <div>= : −···−</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFullGuide(false)}
              className="mt-6 w-full rounded-lg bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-300/15 dark:hover:bg-amber-300/25 dark:text-text-main py-2.5 text-xs font-semibold transition"
            >
              Close Reference Guide
            </button>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </main>
  );
}

export function App() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8">
      <BrandHeader />
      <Routes>
        <Route path="/" element={<TranslatorPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/faq" element={<FaqPage />} />
      </Routes>
    </div>
  );
}
