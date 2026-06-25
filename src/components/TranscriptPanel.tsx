interface TranscriptPanelProps {
  transcript: string;
  reverseMorseInput: string;
  isBusy: boolean;
  processingMs: number | null;
  onTranscriptChange: (next: string) => void;
  onTranslate: () => void;
  onReverseInputChange: (next: string) => void;
  onReverseTranslate: () => void;
}

export function TranscriptPanel(props: TranscriptPanelProps) {
  return (
    <section className="panel">
      <h2 className="section-title">Transcript + Translation</h2>
      <p className="mt-3 text-sm text-amber-100/75">
        Edit text before Morse conversion. Reverse translation is included for Phase 3 extension.
      </p>

      <label className="mt-4 block text-sm text-amber-100/80">
        Transcript
        <textarea
          className="mt-2 min-h-28 w-full rounded-xl border border-amber-300/25 bg-black/35 p-3 text-sm text-amber-100 outline-none ring-0 focus:border-accent"
          value={props.transcript}
          onChange={(event) => props.onTranscriptChange(event.target.value)}
          placeholder="Your transcript appears here..."
        />
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded-md bg-amber-300/20 px-4 py-2 text-sm text-amber-100 disabled:opacity-40"
          onClick={props.onTranslate}
          disabled={props.isBusy || !props.transcript.trim()}
        >
          Translate to Morse
        </button>
        <p className="text-sm text-amber-100/70">
          {props.processingMs ? `last processing: ${props.processingMs} ms` : "no request yet"}
        </p>
      </div>

      <label className="mt-5 block text-sm text-amber-100/80">
        Morse Input (Reverse -&gt; Text)
        <textarea
          className="mt-2 min-h-24 w-full rounded-xl border border-amber-300/25 bg-black/35 p-3 text-sm text-amber-100 outline-none focus:border-accent"
          value={props.reverseMorseInput}
          onChange={(event) => props.onReverseInputChange(event.target.value)}
          placeholder=".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
        />
      </label>

      <button
        type="button"
        className="mt-3 rounded-md bg-accent/20 px-4 py-2 text-sm text-accent disabled:opacity-40"
        onClick={props.onReverseTranslate}
        disabled={!props.reverseMorseInput.trim()}
      >
        Reverse Translate Morse
      </button>
    </section>
  );
}
