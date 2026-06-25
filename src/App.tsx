import { useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { BrandHeader } from "./components/BrandHeader";
import { ToastContainer } from "./components/ToastContainer";
import { useAudioRecorder } from "./hooks/useAudioRecorder";
import { useBatchTranslation } from "./hooks/useBatchTranslation";
import { useDownloads } from "./hooks/useDownloads";
import { useMorsePlayer } from "./hooks/useMorsePlayer";
import { useToast } from "./hooks/useToast";
import { useTranslation } from "./hooks/useTranslation";
import { AboutPage } from "./pages/AboutPage";
import { FaqPage } from "./pages/FaqPage";
import { BatchTranslationPanel } from "./components/BatchTranslationPanel";
import { SignalLampPanel } from "./components/SignalLampPanel";
import { LearningModePanel } from "./components/LearningModePanel";
import type { TranslationRow } from "./types/domain";

function TranslatorPage() {
  const { toasts, notify, dismiss } = useToast();
  const recorder = useAudioRecorder({ maxSeconds: 30 });
  const player = useMorsePlayer();
  const [wpm, setWpm] = useState(18);

  const translation = useTranslation();
  const batch = useBatchTranslation(notify);
  const { makeCurrentHandlers, makeBatchHandlers } = useDownloads(notify);

  // Layout Tab selection
  const [activeTab, setActiveTab] = useState<"translator" | "batch" | "lamp" | "learning">("translator");
  // Audio Input mode ('upload' | 'record')
  const [audioInputType, setAudioInputType] = useState<"upload" | "record">("upload");
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

  function getCurrentTranslationRows(): TranslationRow[] {
    const { transcript, morseOutput } = translation;
    if (!transcript.trim() || !morseOutput.trim()) return [];
    return [{ id: "current-translation", text: transcript.trim(), morse: morseOutput.trim() }];
  }

  const isBusy = translation.isBusy || batch.isBusy;

  const currentHandlers = makeCurrentHandlers(
    getCurrentTranslationRows,
    translation.morseOutput,
    wpm
  );
  const batchHandlers = makeBatchHandlers(batch.batchRows);

  // Format record timer
  const recordSecs = String(recorder.elapsedSeconds).padStart(2, "0");

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-full shrink-0 lg:w-60 flex flex-col gap-4">
        {/* Navigation list */}
        <div className="panel flex flex-col gap-1 bg-white/70 dark:bg-panel/80">
          {[
            { id: "translator", label: "1 Translator", icon: "🎙️" },
            { id: "batch", label: "2 Batch Deck", icon: "📁" },
            { id: "lamp", label: "3 Visual Lamp", icon: "💡" },
            { id: "learning", label: "4 Learning Mode", icon: "🎓" },
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
      <main className="flex-1 min-w-0">
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
                  ★ Phase 3 Ready
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

                  {/* Upload UI */}
                  {audioInputType === "upload" && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-input bg-bg-input p-6">
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

                      {/* Mock waveform animation */}
                      <div className="h-10 flex items-center justify-center gap-1.5 bg-black/20 dark:bg-black/40 rounded-xl px-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
                          <div
                            key={i}
                            className={[
                              "w-1 rounded-full bg-emerald-500 dark:bg-accent transition-all duration-200",
                              recorder.isRecording
                                ? i % 3 === 0
                                  ? "h-8 animate-pulse"
                                  : i % 2 === 0
                                  ? "h-6 animate-pulse"
                                  : "h-4"
                                : "h-2 opacity-50",
                            ].join(" ")}
                          />
                        ))}
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
                      onClick={() => player.play(translation.morseOutput, wpm)}
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
                    <button
                      type="button"
                      onClick={currentHandlers.onDownloadTxt}
                      disabled={!translation.morseOutput}
                      className="rounded-lg bg-bg-input hover:bg-neutral-200 dark:hover:bg-black/50 text-text-main disabled:opacity-40 py-2 text-center transition"
                    >
                      📂 Export TXT
                    </button>
                    <button
                      type="button"
                      onClick={currentHandlers.onDownloadCsv}
                      disabled={!translation.morseOutput}
                      className="rounded-lg bg-bg-input hover:bg-neutral-200 dark:hover:bg-black/50 text-text-main disabled:opacity-40 py-2 text-center transition"
                    >
                      📂 Export CSV
                    </button>
                    <button
                      type="button"
                      onClick={currentHandlers.onDownloadXlsx}
                      disabled={!translation.morseOutput}
                      className="rounded-lg bg-bg-input hover:bg-neutral-200 dark:hover:bg-black/50 text-text-main disabled:opacity-40 py-2 text-center transition"
                    >
                      📂 Export Excel
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={currentHandlers.onDownloadAudio}
                    disabled={!translation.morseOutput}
                    className="w-full rounded-lg bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500/20 dark:hover:bg-amber-500/30 dark:text-text-main disabled:opacity-40 py-2.5 text-xs font-semibold transition"
                  >
                    📥 Download .wav
                  </button>
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
              onDownloadTxt={batchHandlers.onDownloadTxt}
              onDownloadCsv={batchHandlers.onDownloadCsv}
              onDownloadXlsx={batchHandlers.onDownloadXlsx}
            />
          </div>
        )}

        {/* 4. Visual Morse Lamp tab */}
        {activeTab === "lamp" && (
          <div className="animation-slideInRight">
            <SignalLampPanel morse={translation.morseOutput} wpm={wpm} />
          </div>
        )}

        {/* 5. Learning Mode tab */}
        {activeTab === "learning" && (
          <div className="animation-slideInRight">
            <LearningModePanel />
          </div>
        )}

        {/* Console Brand Footer */}
        <footer className="mt-8 text-center text-xs text-text-muted/70 border-t border-amber-500/5 dark:border-amber-300/5 pt-4">
          Built with MorseAI Console · Reliable · Fast · Private
        </footer>
      </main>

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
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-text-title">AI Speech Recognition</span>
                <span className="text-xs text-text-muted">
                  Powered by Deepgram Nova-2 models for industry-leading speed and accuracy.
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-text-title">Rate Limiting</span>
                <span className="text-xs text-text-muted">
                  Safe limits are set to 5 requests per minute per IP address.
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-text-title">Local Security</span>
                <span className="text-xs text-text-muted">
                  All text translation and file sheet exporting happen 100% locally in your browser.
                </span>
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
    </div>
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
