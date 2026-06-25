import { useState } from "react";
import { Link } from "react-router-dom";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  id: string;
  label: string;
  icon: string;
  items: FaqItem[];
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: "basics",
    label: "Getting Started",
    icon: "🚀",
    items: [
      {
        q: "What is MorseAI?",
        a: "MorseAI is a free, browser-based AI-powered Morse code translator. It converts spoken words and audio files into Morse code using AI speech recognition. No installation or account is needed.",
      },
      {
        q: "Is MorseAI free to use?",
        a: "Yes — completely free. All features including AI voice transcription, audio upload, batch translation, WAV export, and learning mode are available at no cost and with no account required.",
      },
      {
        q: "Does MorseAI work on mobile?",
        a: "Yes. MorseAI is a responsive web app that works in any modern browser on desktop, tablet, and mobile. Microphone recording requires a browser with getUserMedia support (Chrome, Firefox, Safari, Edge).",
      },
      {
        q: "Do I need to install anything?",
        a: "No installation needed. MorseAI runs entirely in your browser. Just open the website and start translating.",
      },
    ],
  },
  {
    id: "audio",
    label: "Audio & Recording",
    icon: "🎙️",
    items: [
      {
        q: "What audio formats does MorseAI support?",
        a: "MorseAI accepts WAV, MP3, M4A, OGG, and WEBM audio files up to 3MB per file. For microphone recording, the browser captures audio in WebM/Opus format automatically.",
      },
      {
        q: "How long can I record?",
        a: "Up to 30 seconds per recording. For longer content, use the audio file upload feature — or use the Batch Translation Deck to process multiple segments at once.",
      },
      {
        q: "Why is my microphone not working?",
        a: "Check that you have granted microphone permission to the browser. On Chrome: click the lock icon in the address bar → Microphone → Allow. On Safari, go to Settings → Safari → Microphone. Also ensure no other app is exclusively using the microphone.",
      },
      {
        q: "How accurate is the AI transcription?",
        a: "MorseAI uses Deepgram Nova-2, one of the most accurate speech-to-text models available (97%+ accuracy on clear audio). Accuracy depends on audio quality — speak clearly in a quiet environment and hold the microphone 15–30cm from your mouth for best results.",
      },
      {
        q: "Can I upload audio longer than 3MB?",
        a: "Currently the limit is 3MB. For longer content, trim your audio using a free tool like Audacity or use the browser's built-in recording feature and submit in 30-second chunks. Batch Translation can combine results.",
      },
    ],
  },
  {
    id: "morse",
    label: "Morse Code",
    icon: "⚡",
    items: [
      {
        q: "What Morse code standard does MorseAI use?",
        a: "MorseAI uses the ITU-R M.1677 International Morse Code standard — the globally recognised standard used by amateur radio operators, military, and maritime services. It covers all 26 letters (A–Z), digits 0–9, and 17 punctuation symbols including . , ? ! / ( ) & : ; = + - _ \" @ '",
      },
      {
        q: "What does the '/' separator mean in Morse output?",
        a: "The slash (/) represents a word boundary in MorseAI's text output. For example: 'HI THERE' becomes '.... .. / - .... . .-. .'. In actual transmission, a word gap is represented by a 7-unit silence between characters.",
      },
      {
        q: "Can I translate Morse code back to text?",
        a: "Yes. Use the 'Morse Input (Reverse → Text)' field in the Transcript panel. Paste any Morse code using dots (.), dashes (-), spaces between letters, and slashes (/) between words. Click 'Reverse Translate Morse' to decode it to plain text.",
      },
      {
        q: "What is WPM and how do I choose the right speed?",
        a: "WPM (Words Per Minute) controls the speed of Morse tone playback and WAV export. Guidelines: 5–10 WPM is beginner speed for learning. 13 WPM is the minimum for many amateur radio licences. 20–25 WPM is comfortable for experienced operators. 35–40 WPM is expert/contest speed. The Farnsworth method recommends sending characters at full speed (18+ WPM) but with extra spacing while learning.",
      },
      {
        q: "Does MorseAI support special characters and punctuation?",
        a: "Yes. MorseAI supports all ITU-R standard punctuation: period (·−·−·−), comma (−−··−−), question mark (··−−··), exclamation (−·−·−−), slash (−··−·), parentheses, ampersand, colon, semicolon, equals, plus, hyphen, underscore, quote, at-sign, and apostrophe. Characters not in the standard (e.g. accented letters) are silently skipped.",
      },
      {
        q: "What is the timing ratio for Morse code?",
        a: "International Morse Code uses a 1:3:7 timing ratio. One 'unit' is the duration of a dot. A dash = 3 units. Gap between symbols in the same letter = 1 unit. Gap between letters = 3 units. Gap between words = 7 units. MorseAI follows this standard precisely in both playback and WAV export.",
      },
    ],
  },
  {
    id: "features",
    label: "Features",
    icon: "⚙️",
    items: [
      {
        q: "How does batch translation work?",
        a: "The Batch Translation Deck lets you translate multiple texts at once. You can: (1) Upload a .txt file — each paragraph becomes one row. (2) Upload a .csv, .xls, or .xlsx file — MorseAI looks for a 'text' or 'transcript' column. (3) Paste multiple paragraphs separated by blank lines into the multi-paragraph input. All entries are translated locally using the built-in Morse engine.",
      },
      {
        q: "How do I export the Morse code?",
        a: "The Morse Output panel has four export buttons: 'Export TXT' (plain text file), 'Export CSV' (spreadsheet-compatible), 'Export Excel' (.xlsx), and 'Download .wav' (audio file). The Batch Translation Deck also has TXT, CSV, and Excel export for all batch rows.",
      },
      {
        q: "What is the Visual Morse Lamp?",
        a: "The Signal Lamp panel animates a glowing dot that turns on and off following the Morse timing of your translated output. It's useful for visual demonstrations, accessibility applications, and escape room props.",
      },
      {
        q: "How does Learning Mode work?",
        a: "Learning Mode presents a random Morse code character and asks you to identify the letter or digit. Type your answer (A–Z or 0–9) and click 'Check' to see if you're correct. Click 'Next' to get a new challenge. This trains character recognition — the key skill for reading Morse code by ear.",
      },
      {
        q: "Can I copy the Morse output to clipboard?",
        a: "Yes. Click the 'Copy' button in the Morse Output panel to copy the full Morse code string to your clipboard. Requires clipboard permission in your browser.",
      },
    ],
  },
  {
    id: "privacy",
    label: "Privacy & Data",
    icon: "🔒",
    items: [
      {
        q: "Is my audio stored or shared?",
        a: "Audio is sent to the Deepgram API for transcription over an encrypted HTTPS connection. Deepgram processes the audio and returns the transcript — MorseAI does not store your audio on its own servers. Text translation happens entirely in your browser (no data sent to any server). Review Deepgram's privacy policy at deepgram.com for details on their data handling.",
      },
      {
        q: "Does MorseAI use cookies or tracking?",
        a: "MorseAI uses Umami Analytics (privacy-first, GDPR-compliant, no cookies, no personal data collection) to count page visits. No advertising trackers or third-party cookies are used.",
      },
      {
        q: "Does Morse translation happen on my device?",
        a: "Yes. All text-to-Morse and Morse-to-text conversion happens locally in your browser using the built-in JavaScript engine. Only audio transcription requires a network call (to Deepgram). Batch translation of text files is also 100% local.",
      },
    ],
  },
];

function AccordionItem({ item, isOpen, onToggle }: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border-input last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-4 py-4 text-left transition-colors hover:text-text-title"
      >
        <span className={`text-sm font-medium leading-6 ${isOpen ? "text-text-title font-semibold" : "text-text-main"}`}>
          {item.q}
        </span>
        <span
          className={`mt-0.5 shrink-0 text-emerald-700 dark:text-accent transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
          aria-hidden="true"
        >
          ✕
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 pb-4" : "max-h-0"}`}
      >
        <p className="text-sm leading-7 text-text-muted">{item.a}</p>
      </div>
    </div>
  );
}

export function FaqPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  function toggleItem(key: string) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const normalised = query.trim().toLowerCase();
  const filtered = FAQ_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        (!normalised || item.q.toLowerCase().includes(normalised) || item.a.toLowerCase().includes(normalised)) &&
        (activeCategory === "all" || cat.id === activeCategory)
    ),
  })).filter((cat) => cat.items.length > 0);

  const totalResults = filtered.reduce((n, c) => n + c.items.length, 0);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">

      {/* Header */}
      <section className="panel relative overflow-hidden">
        <div className="absolute -top-20 right-0 h-48 w-48 rounded-full bg-amber-300/8 blur-3xl pointer-events-none" />
        <div className="relative">
          <p className="font-display text-xs uppercase tracking-[0.22em] text-text-title opacity-70">Help Center</p>
          <h1 className="mt-2 font-display text-3xl text-text-h1 glow-text sm:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-sm text-text-muted">
            {FAQ_CATEGORIES.reduce((n, c) => n + c.items.length, 0)} answers across{" "}
            {FAQ_CATEGORIES.length} categories
          </p>

          {/* Search */}
          <div className="mt-5 relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-title opacity-40" aria-hidden="true">⌕</span>
            <input
              id="faq-search"
              type="search"
              placeholder="Search questions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-border-input bg-bg-input py-2.5 pl-9 pr-4 text-sm text-text-main placeholder-text-muted outline-none transition focus:border-emerald-500 dark:focus:border-accent focus:ring-1 focus:ring-accent/30 sm:max-w-md"
            />
          </div>
        </div>
      </section>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="FAQ categories">
        <button
          role="tab"
          aria-selected={activeCategory === "all"}
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-full px-4 py-1.5 text-sm transition-all ${
            activeCategory === "all"
              ? "bg-accent/20 text-emerald-700 dark:text-accent font-semibold"
              : "border border-border-input text-text-muted hover:border-border-panel hover:text-text-title"
          }`}
        >
          All
        </button>
        {FAQ_CATEGORIES.map((cat) => (
          <button
            role="tab"
            aria-selected={activeCategory === cat.id}
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`rounded-full px-4 py-1.5 text-sm transition-all ${
              activeCategory === cat.id
                ? "bg-accent/20 text-emerald-700 dark:text-accent font-semibold"
                : "border border-border-input text-text-muted hover:border-border-panel hover:text-text-title"
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Results count when searching */}
      {normalised && (
        <p className="text-sm text-text-muted opacity-80">
          {totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
        </p>
      )}

      {/* FAQ Sections */}
      {filtered.length > 0 ? (
        filtered.map((cat) => (
          <section key={cat.id} className="panel">
            <div className="flex items-center gap-3">
              <span className="text-xl">{cat.icon}</span>
              <h2 className="section-title">{cat.label}</h2>
              <span className="rounded-full border border-border-input bg-bg-input px-2.5 py-0.5 text-xs text-text-title font-medium">
                {cat.items.length}
              </span>
            </div>

            <div className="mt-4">
              {cat.items.map((item) => {
                const key = `${cat.id}__${item.q}`;
                return (
                  <AccordionItem
                    key={key}
                    item={item}
                    isOpen={openItems.has(key)}
                    onToggle={() => toggleItem(key)}
                  />
                );
              })}
            </div>
          </section>
        ))
      ) : (
        <div className="panel text-center py-12">
          <p className="text-3xl">🔍</p>
          <p className="mt-3 text-sm text-text-muted">No results for &ldquo;{query}&rdquo;</p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-3 text-sm text-emerald-700 dark:text-accent font-semibold hover:underline"
          >
            Clear search
          </button>
        </div>
      )}

      {/* CTA */}
      <div className="panel text-center">
        <p className="text-sm text-text-muted">Still have questions?</p>
        <Link
          to="/"
          className="mt-3 inline-block rounded-lg bg-accent/20 px-6 py-2.5 text-sm font-medium text-emerald-700 dark:text-accent transition hover:bg-accent/30"
        >
          Open the Translator →
        </Link>
      </div>

    </main>
  );
}
