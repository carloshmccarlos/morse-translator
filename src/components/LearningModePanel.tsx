import { useMemo, useState } from "react";
import { SUPPORTED_CHARS, textToMorse } from "../lib/morse";

function randomChallengeCharacter() {
  const idx = Math.floor(Math.random() * SUPPORTED_CHARS.length);
  return SUPPORTED_CHARS[idx];
}

export function LearningModePanel() {
  const [target, setTarget] = useState(() => randomChallengeCharacter());
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState("");
  const morse = useMemo(() => textToMorse(target), [target]);

  function nextChallenge() {
    setTarget(randomChallengeCharacter());
    setGuess("");
    setResult("");
  }

  function checkAnswer() {
    const normalized = guess.trim().toUpperCase();
    if (!normalized) return;
    setResult(normalized === target ? "Correct signal decode! 🎉" : `Incorrect. Expected letter: ${target}`);
  }

  const isCorrect = result.startsWith("Correct");

  return (
    <section className="panel bg-white/70 dark:bg-panel/80">
      <div className="border-b border-amber-500/10 dark:border-amber-300/10 pb-4">
        <h2 className="section-title">Learning Mode</h2>
        <p className="mt-1 text-xs text-neutral-500 dark:text-amber-100/60">
          Learn and practice Morse code.
        </p>
      </div>

      <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 dark:border-emerald-500/30">
        <p className="text-2xs font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-400">
          Challenge Morse
        </p>
        <p className="mt-2 font-display text-3xl text-emerald-600 dark:text-accent glow-text select-all font-bold tracking-[0.1em]">
          {morse}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <input
          className="w-24 rounded-lg border border-amber-500/20 bg-white dark:border-amber-300/30 dark:bg-black/40 px-3 py-2 text-center text-neutral-800 dark:text-amber-100 outline-none font-semibold focus:border-amber-600 dark:focus:border-accent transition"
          value={guess}
          onChange={(event) => setGuess(event.target.value)}
          maxLength={1}
          placeholder="A-Z/0-9"
        />
        <button
          type="button"
          className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-accent/20 dark:text-accent dark:hover:bg-accent/30 px-5 py-2 text-xs font-semibold transition"
          onClick={checkAnswer}
        >
          Check
        </button>
        <button
          type="button"
          className="rounded-lg bg-neutral-200 hover:bg-neutral-300 text-neutral-800 dark:bg-amber-300/20 dark:text-amber-100 dark:hover:bg-amber-300/30 px-5 py-2 text-xs font-semibold transition"
          onClick={nextChallenge}
        >
          Next
        </button>
      </div>

      <p
        className={[
          "mt-4 min-h-5 text-sm font-semibold transition-all duration-200",
          result
            ? isCorrect
              ? "text-emerald-700 dark:text-emerald-400 scale-100"
              : "text-red-600 dark:text-red-400 scale-100"
            : "opacity-0",
        ].join(" ")}
      >
        {result}
      </p>
    </section>
  );
}
