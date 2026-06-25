import { ChangeEvent } from "react";

interface AudioInputPanelProps {
  isBusy: boolean;
  recordSeconds: number;
  isRecording: boolean;
  onFileSelected: (file: File | null) => void;
  onStartRecord: () => void;
  onStopRecord: () => void;
  onSubmitRecorded: () => void;
}

export function AudioInputPanel(props: AudioInputPanelProps) {
  const {
    isBusy,
    isRecording,
    recordSeconds,
  } = props;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    props.onFileSelected(file);
    event.currentTarget.value = "";
  }

  return (
    <section className="panel">
      <h2 className="section-title">Audio Input</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-amber-300/20 bg-black/30 p-4">
          <p className="font-display text-xs uppercase tracking-[0.18em] text-amber-200/80">
            Upload
          </p>
          <p className="mt-2 text-sm text-amber-100/70">Audio only (.wav .mp3 .m4a .ogg), max 3MB</p>
          <label className="mt-4 inline-flex cursor-pointer items-center rounded-md border border-amber-300/40 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-100 transition hover:bg-amber-300/20">
            Select Audio File
            <input
              className="hidden"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              disabled={isBusy}
            />
          </label>
        </div>

        <div className="rounded-xl border border-amber-300/20 bg-black/30 p-4">
          <p className="font-display text-xs uppercase tracking-[0.18em] text-amber-200/80">
            Record (up to 30s)
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="rounded-md bg-emerald-400/20 px-4 py-2 text-sm text-emerald-200 disabled:opacity-40"
              onClick={props.onStartRecord}
              disabled={isBusy || isRecording}
            >
              Start Record
            </button>
            <button
              type="button"
              className="rounded-md bg-rose-400/20 px-4 py-2 text-sm text-rose-200 disabled:opacity-40"
              onClick={props.onStopRecord}
              disabled={!isRecording}
            >
              Stop
            </button>
            <button
              type="button"
              className="rounded-md bg-amber-400/20 px-4 py-2 text-sm text-amber-200 disabled:opacity-40"
              onClick={props.onSubmitRecorded}
              disabled={isBusy || isRecording}
            >
              Submit Recording
            </button>
          </div>
          <p className="mt-3 text-sm text-amber-100/75">
            Recorder: {isRecording ? "LIVE" : "idle"} ({recordSeconds}s)
          </p>
        </div>
      </div>
    </section>
  );
}

