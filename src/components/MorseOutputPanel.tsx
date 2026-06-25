interface MorseOutputPanelProps {
  morse: string;
  isPlaying: boolean;
  wpm: number;
  onWpmChange: (wpm: number) => void;
  onPlay: () => void;
  onStop: () => void;
  onCopy: () => void;
  onDownloadTxt: () => void;
  onDownloadCsv: () => void;
  onDownloadXlsx: () => void;
  onDownloadAudio: () => void;
}

export function MorseOutputPanel(props: MorseOutputPanelProps) {
  return (
    <section className="panel">
      <h2 className="section-title">Morse Output</h2>
      <div className="mt-4 rounded-xl border border-amber-300/20 bg-black/35 p-4">
        <p className="break-words font-body text-lg tracking-[0.08em] text-amber-100">
          {props.morse || "No Morse output yet."}
        </p>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm text-amber-100/80">
          Tone Speed (WPM): {props.wpm}
          <input
            type="range"
            min={5}
            max={40}
            value={props.wpm}
            onChange={(event) => props.onWpmChange(Number(event.target.value))}
            className="mt-2 w-full accent-accent"
          />
        </label>

        <div className="flex flex-wrap items-end gap-2">
          <button
            type="button"
            className="rounded-md bg-accent/20 px-4 py-2 text-sm text-accent disabled:opacity-40"
            onClick={props.onPlay}
            disabled={!props.morse}
          >
            {props.isPlaying ? "Playing..." : "Play"}
          </button>
          <button
            type="button"
            className="rounded-md bg-black/40 px-4 py-2 text-sm text-amber-100 disabled:opacity-40"
            onClick={props.onStop}
            disabled={!props.isPlaying}
          >
            Stop
          </button>
          <button
            type="button"
            className="rounded-md bg-amber-300/20 px-4 py-2 text-sm text-amber-100 disabled:opacity-40"
            onClick={props.onCopy}
            disabled={!props.morse}
          >
            Copy
          </button>
          <button
            type="button"
            className="rounded-md bg-amber-300/20 px-4 py-2 text-sm text-amber-100 disabled:opacity-40"
            onClick={props.onDownloadTxt}
            disabled={!props.morse}
          >
            Export TXT
          </button>
          <button
            type="button"
            className="rounded-md bg-amber-300/20 px-4 py-2 text-sm text-amber-100 disabled:opacity-40"
            onClick={props.onDownloadCsv}
            disabled={!props.morse}
          >
            Export CSV
          </button>
          <button
            type="button"
            className="rounded-md bg-amber-300/20 px-4 py-2 text-sm text-amber-100 disabled:opacity-40"
            onClick={props.onDownloadXlsx}
            disabled={!props.morse}
          >
            Export Excel
          </button>
          <button
            type="button"
            className="rounded-md bg-amber-300/20 px-4 py-2 text-sm text-amber-100 disabled:opacity-40"
            onClick={props.onDownloadAudio}
            disabled={!props.morse}
          >
            Download .wav
          </button>
        </div>
      </div>
    </section>
  );
}

