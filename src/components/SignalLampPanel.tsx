import { useCallback, useEffect, useRef, useState } from "react";
import { morseToToneSegments } from "../lib/morseTiming";

interface SignalLampPanelProps {
  morse: string;
  wpm: number;
}

export function SignalLampPanel(props: SignalLampPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const [step, setStep] = useState(0);
  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const stop = useCallback(() => {
    clearTimers();
    setIsRunning(false);
    setIsOn(false);
    setStep(0);
  }, [clearTimers]);

  // Cleanup all pending timers on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  function runSignal() {
    if (!props.morse.trim()) return;
    stop();

    const segments = morseToToneSegments(props.morse, props.wpm);
    let cursorMs = 0;

    segments.forEach((segment, index) => {
      const timer = window.setTimeout(() => {
        setIsOn(segment.on);
        setStep(index + 1);
      }, cursorMs);
      timersRef.current.push(timer);
      cursorMs += segment.durationSec * 1_000;
    });

    const doneTimer = window.setTimeout(() => {
      setIsRunning(false);
      setIsOn(false);
    }, cursorMs + 20);

    timersRef.current.push(doneTimer);
    setIsRunning(true);
  }

  return (
    <section className="panel bg-white/70 dark:bg-panel/80">
      <div className="border-b border-amber-500/10 dark:border-amber-300/10 pb-4">
        <h2 className="section-title">Visual Morse Lamp</h2>
        <p className="mt-1 text-xs text-neutral-500 dark:text-amber-100/60">
          See Morse code in real-time.
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={[
              "h-3 w-3 rounded-full transition-all",
              isOn
                ? "bg-accent shadow-[0_0_18px_rgba(0,217,166,0.9)]"
                : "bg-neutral-300 dark:bg-neutral-700",
            ].join(" ")}
          />
          <span className="text-sm font-semibold text-neutral-700 dark:text-amber-100/80">
            Status: {isRunning ? `Running sequence (step ${step})` : "Idle"}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-accent/20 dark:text-accent dark:hover:bg-accent/30 disabled:opacity-40 px-4 py-2 text-xs font-semibold transition"
            onClick={runSignal}
            disabled={!props.morse}
          >
            Blink Signal
          </button>
          <button
            type="button"
            className="rounded-md bg-neutral-200 hover:bg-neutral-300 text-neutral-800 dark:bg-black/40 dark:text-amber-100 disabled:opacity-40 px-4 py-2 text-xs font-semibold transition"
            onClick={stop}
            disabled={!isRunning}
          >
            Stop Blink
          </button>
        </div>
      </div>

      {/* Row of 8 Blinking Lamps */}
      <div className="mt-8 flex justify-center items-center gap-3 bg-neutral-100/40 dark:bg-black/35 rounded-2xl p-5 border border-amber-500/10 dark:border-amber-300/5">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <span
            key={i}
            className={[
              "h-7 w-7 rounded-full transition-all duration-150 border-2",
              isOn
                ? "bg-accent border-accent shadow-[0_0_22px_rgba(0,217,166,0.9)] scale-110"
                : "bg-neutral-200 border-neutral-300 dark:bg-neutral-800 dark:border-amber-300/10",
            ].join(" ")}
          />
        ))}
      </div>
    </section>
  );
}
