import { NavBar } from "./NavBar";

export function BrandHeader() {
  return (
    <header className="panel relative overflow-hidden">
      <div className="absolute -top-24 right-8 h-40 w-40 rounded-full bg-amber-300/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-8 h-40 w-40 rounded-full bg-emerald-300/10 blur-3xl pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src="/favicon.png" alt="MorseAI Logo" className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg border border-emerald-400/30" />
          <div>
            <p className="font-display text-xs uppercase tracking-[0.22em] text-text-muted">
              MorseAI Console
            </p>
            <h1 className="mt-1 font-display text-3xl text-text-h1 glow-text sm:text-4xl">
              Morse Code Translator Audio
            </h1>
          </div>
        </div>
        <NavBar />
      </div>
    </header>
  );
}

