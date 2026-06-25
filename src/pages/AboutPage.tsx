import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "🎙️",
    title: "AI Voice Transcription",
    desc: "Record up to 30 seconds of speech via your browser microphone. Deepgram Nova-2 AI converts your voice to text with industry-leading accuracy.",
  },
  {
    icon: "📁",
    title: "Audio File Upload",
    desc: "Upload WAV, MP3, M4A, or OGG audio files up to 3MB. Drop in a recording and get Morse code output in seconds.",
  },
  {
    icon: "🔊",
    title: "Tone Playback",
    desc: "Hear the Morse code as a sine-wave tone at adjustable speed — from 5 WPM (beginner) to 40 WPM (experienced operator).",
  },
  {
    icon: "💡",
    title: "Visual Signal Lamp",
    desc: "Watch the Morse code blink as a light signal. Perfect for visual learners and escape room demonstrations.",
  },
  {
    icon: "📊",
    title: "Batch Translation",
    desc: "Import .txt, .csv, .xls, or .xlsx files and translate all rows at once. Export results as TXT, CSV, or Excel.",
  },
  {
    icon: "🔄",
    title: "Reverse Translation",
    desc: "Paste any Morse code string (dots, dashes, slashes) and decode it back to plain text instantly.",
  },
  {
    icon: "💾",
    title: "WAV Audio Export",
    desc: "Download the Morse signal as a standard WAV audio file — ready for radio transmission or puzzle design.",
  },
  {
    icon: "🎓",
    title: "Learning Mode",
    desc: "Practice decoding random Morse code characters with instant feedback. Train your ear and muscle memory.",
  },
];

const USE_CASES = [
  {
    title: "Amateur Radio (Ham Radio)",
    icon: "📡",
    desc: "Practice CW (continuous wave) Morse communication. Generate audio files at the exact WPM for your license exam preparation.",
  },
  {
    title: "Escape Room Design",
    icon: "🔐",
    desc: "Create immersive Morse code puzzles with audio output and visual lamp signals. Export WAV files for playback devices.",
  },
  {
    title: "ARG & Puzzle Design",
    icon: "🧩",
    desc: "Encode secret messages as Morse audio for alternate reality games and interactive puzzles. Batch encode entire scripts.",
  },
  {
    title: "Education",
    icon: "📚",
    desc: "Demonstrate Morse code encoding and decoding in the classroom. The Learning Mode turns practice into a game.",
  },
];

const MORSE_HISTORY = [
  {
    year: "1836",
    event: "Samuel Morse and Alfred Vail develop the first working telegraph system and Morse code.",
  },
  {
    year: "1865",
    event: "International Morse Code standardised by the International Telecommunication Union (ITU) predecessor.",
  },
  {
    year: "1912",
    event: "The Titanic disaster highlights the critical role of Morse code — SOS (··· --- ···) becomes universal distress signal.",
  },
  {
    year: "1999",
    event: "Commercial maritime use of Morse code ends, replaced by GMDSS. Amateur radio operators keep it alive.",
  },
  {
    year: "Today",
    event: "Morse code is still used by ham radio operators globally, in military contexts, and as an accessibility input method.",
  },
];

export function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8">

      {/* Hero */}
      <section className="panel relative overflow-hidden">
        <div className="absolute -top-32 right-0 h-64 w-64 rounded-full bg-amber-300/8 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 left-0 h-48 w-48 rounded-full bg-emerald-400/8 blur-3xl pointer-events-none" />

        <div className="relative">
          <p className="font-display text-xs uppercase tracking-[0.22em] text-text-title opacity-70">About</p>
          <h1 className="mt-2 font-display text-3xl text-text-h1 glow-text sm:text-4xl">
            What is MorseAI?
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-text-main">
            MorseAI is a free, browser-based AI-powered Morse code translator. It converts spoken
            words and audio files into Morse code — no installation, no account required.
          </p>
          <p className="mt-3 max-w-3xl text-base leading-7 text-text-muted">
            Unlike basic text-to-Morse tools, MorseAI handles the full workflow: upload or record
            audio → AI speech recognition transcribes your words → instant Morse code output →
            play as tone, blink as light, or export as WAV. It follows the{" "}
            <strong className="text-text-title">ITU-R M.1677 International Morse Code</strong>{" "}
            standard, covering A–Z, 0–9, and 17 punctuation symbols.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-lg bg-accent/20 px-5 py-2.5 text-sm font-medium text-emerald-700 dark:text-accent transition hover:bg-accent/30"
            >
              Open Translator →
            </Link>
            <Link
              to="/faq"
              className="rounded-lg border border-border-panel px-5 py-2.5 text-sm font-medium text-text-title transition hover:bg-amber-500/10 dark:hover:bg-amber-300/10"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section>
        <h2 className="section-title">Features</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <article
              key={f.title}
              className="rounded-2xl border border-border-input bg-bg-input p-5 transition-all duration-200 hover:border-border-panel"
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-3 font-display text-sm uppercase tracking-[0.14em] text-text-title">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">{f.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section>
        <h2 className="section-title">Use Cases</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {USE_CASES.map((u) => (
            <article
              key={u.title}
              className="flex gap-4 rounded-2xl border border-border-input bg-bg-input p-5"
            >
              <span className="mt-0.5 shrink-0 text-2xl">{u.icon}</span>
              <div>
                <h3 className="font-display text-sm uppercase tracking-[0.14em] text-text-title">
                  {u.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-muted">{u.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Morse Code Reference */}
      <section className="panel">
        <h2 className="section-title">Morse Code Character Reference</h2>
        <p className="mt-2 text-sm text-text-muted">
          International Morse Code — ITU-R M.1677 standard
        </p>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-panel">
                <th className="pb-2 text-left font-display text-xs uppercase tracking-[0.16em] text-text-title opacity-70">Char</th>
                <th className="pb-2 text-left font-display text-xs uppercase tracking-[0.16em] text-text-title opacity-70">Code</th>
                <th className="pb-2 text-left font-display text-xs uppercase tracking-[0.16em] text-text-title opacity-70">Char</th>
                <th className="pb-2 text-left font-display text-xs uppercase tracking-[0.16em] text-text-title opacity-70">Code</th>
                <th className="pb-2 text-left font-display text-xs uppercase tracking-[0.16em] text-text-title opacity-70">Char</th>
                <th className="pb-2 text-left font-display text-xs uppercase tracking-[0.16em] text-text-title opacity-70">Code</th>
              </tr>
            </thead>
            <tbody className="font-body">
              {[
                ["A", "·−", "J", "·−−−", "S", "···"],
                ["B", "−···", "K", "−·−", "T", "−"],
                ["C", "−·−·", "L", "·−··", "U", "··−"],
                ["D", "−··", "M", "−−", "V", "···−"],
                ["E", "·", "N", "−·", "W", "·−−"],
                ["F", "··−·", "O", "−−−", "X", "−··−"],
                ["G", "−−·", "P", "·−−·", "Y", "−·−−"],
                ["H", "····", "Q", "−−·−", "Z", "−−··"],
                ["I", "··", "R", "·−·", "", ""],
              ].map((row, i) => (
                <tr key={i} className="border-b border-border-input">
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      className={`py-1.5 pr-4 ${
                        j % 2 === 0
                          ? "font-medium text-text-title"
                          : "tracking-[0.12em] text-emerald-700 dark:text-accent font-semibold"
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Digits */}
        <div className="mt-5">
          <p className="font-display text-xs uppercase tracking-[0.16em] text-text-title opacity-70">Digits</p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 font-body text-sm">
            {[
              ["0","−−−−−"],["1","·−−−−"],["2","··−−−"],["3","···−−"],
              ["4","····−"],["5","·····"],["6","−····"],["7","−−···"],
              ["8","−−−··"],["9","−−−−·"],
            ].map(([ch, code]) => (
              <span key={ch}>
                <span className="font-medium text-text-title">{ch}</span>
                <span className="ml-2 tracking-[0.1em] text-emerald-700 dark:text-accent font-semibold">{code}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Common punctuation */}
        <div className="mt-5">
          <p className="font-display text-xs uppercase tracking-[0.16em] text-text-title opacity-70">Common Punctuation</p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 font-body text-sm">
            {[
              [".","·−·−·−"],[",","−−··−−"],["?","··−−··"],["!","−·−·−−"],
              ["/","−··−·"],["@","·−−·−·"],["=","-···-"],
            ].map(([ch, code]) => (
              <span key={ch}>
                <span className="font-medium text-text-title">{ch}</span>
                <span className="ml-2 tracking-[0.1em] text-emerald-700 dark:text-accent font-semibold">{code}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* History timeline */}
      <section className="panel">
        <h2 className="section-title">A Brief History of Morse Code</h2>
        <div className="mt-5 space-y-0">
          {MORSE_HISTORY.map((item, index) => (
            <div key={item.year} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-panel bg-amber-500/10 dark:bg-amber-300/10">
                  <span className="text-xs font-medium text-text-title">{item.year.slice(-2)}</span>
                </div>
                {index < MORSE_HISTORY.length - 1 && (
                  <div className="mt-1 w-px flex-1 bg-border-panel" />
                )}
              </div>
              <div className={`pb-6 ${index === MORSE_HISTORY.length - 1 ? "pb-0" : ""}`}>
                <p className="font-display text-sm text-text-title">{item.year}</p>
                <p className="mt-1 text-sm leading-6 text-text-muted">{item.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="panel">
        <h2 className="section-title">Technology</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Frontend", value: "React 18 · TypeScript · Vite · TailwindCSS" },
            { label: "AI Transcription", value: "Deepgram Nova-2 · Cloudflare Workers" },
            { label: "Audio Engine", value: "Web Audio API · WAV PCM encoder" },
          ].map((t) => (
            <div key={t.label} className="rounded-xl border border-border-input bg-bg-input p-4">
              <p className="font-display text-xs uppercase tracking-[0.18em] text-text-title opacity-70">{t.label}</p>
              <p className="mt-2 text-sm text-text-muted">{t.value}</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
