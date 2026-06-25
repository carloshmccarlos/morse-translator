import type { ChangeEvent } from "react";
import type { TranslationRow } from "../types/domain";

interface BatchTranslationPanelProps {
  batchInput: string;
  rows: TranslationRow[];
  isBusy: boolean;
  sourceLabel: string;
  onBatchInputChange: (next: string) => void;
  onBatchFileSelected: (file: File | null) => void;
  onTranslateParagraphs: () => void;
  onDownloadTxt: () => void;
  onDownloadCsv: () => void;
  onDownloadXlsx: () => void;
}

export function BatchTranslationPanel(props: BatchTranslationPanelProps) {
  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    props.onBatchFileSelected(file);
    event.currentTarget.value = "";
  }

  return (
    <section className="panel bg-white/70 dark:bg-panel/80">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-amber-500/10 dark:border-amber-300/10 pb-4">
        <div>
          <h2 className="section-title">Batch Translation Deck</h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-amber-100/60">
            Import a text file or spreadsheet, or paste multiple paragraphs. Each entry is translated locally.
          </p>
        </div>
        <div className="rounded-full border border-amber-500/30 bg-amber-500/10 dark:border-amber-300/20 dark:bg-black/30 px-4 py-1.5 text-xs uppercase tracking-[0.12em] font-semibold text-amber-800 dark:text-amber-200">
          {props.rows.length} rows ready
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.1fr]">
        <div className="rounded-2xl border border-dashed border-amber-500/25 bg-amber-500/5 dark:border-amber-300/30 dark:bg-black/25 p-4 flex flex-col justify-between">
          <div>
            <p className="font-display text-xs uppercase tracking-[0.16em] text-emerald-800 dark:text-emerald-200/80">
              File Import
            </p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-amber-100/70">
              Accepts `.txt`, `.csv`, `.xls`, and `.xlsx`. Spreadsheets use a `text` or
              `transcript` column when available.
            </p>
          </div>
          
          <div className="mt-4">
            <label className="inline-flex cursor-pointer items-center rounded-md bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-400/10 px-4 py-2 text-xs font-semibold text-white dark:text-emerald-100 transition dark:hover:bg-emerald-400/20">
              Upload Batch File
              <input
                className="hidden"
                type="file"
                accept=".txt,.csv,.xls,.xlsx,text/plain,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFileChange}
                disabled={props.isBusy}
              />
            </label>
            <p className="mt-3 text-2xs uppercase tracking-[0.12em] text-neutral-500 dark:text-amber-200/60">
              Source: <span className="font-semibold text-neutral-700 dark:text-amber-100">{props.sourceLabel || "No batch source loaded yet"}</span>
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:border-amber-300/20 dark:bg-black/30 p-4">
          <div className="flex flex-col gap-3">
            <label className="block text-sm font-semibold text-neutral-700 dark:text-amber-100/85">
              Multi-paragraph Input
              <textarea
                className="mt-2 min-h-36 w-full rounded-xl border border-amber-500/20 bg-neutral-100/40 dark:border-amber-300/25 dark:bg-black/35 p-3 text-sm text-neutral-800 dark:text-amber-100 outline-none focus:border-amber-600 dark:focus:border-accent"
                value={props.batchInput}
                onChange={(event) => props.onBatchInputChange(event.target.value)}
                placeholder={"Paragraph one...\n\nParagraph two...\n\nParagraph three..."}
              />
            </label>
            <button
              type="button"
              className="rounded-md bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-accent/20 dark:text-accent dark:hover:bg-accent/30 disabled:opacity-40 px-4 py-2 text-xs font-semibold transition self-start"
              onClick={props.onTranslateParagraphs}
              disabled={props.isBusy || !props.batchInput.trim()}
            >
              Translate Paragraphs
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-amber-500/5 dark:border-amber-300/5 pt-4">
        <button
          type="button"
          className="rounded-md bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-300/20 dark:text-amber-100 dark:hover:bg-amber-300/30 disabled:opacity-40 px-4 py-2 text-xs font-semibold transition"
          onClick={props.onDownloadTxt}
          disabled={!props.rows.length}
        >
          Export TXT
        </button>
        <button
          type="button"
          className="rounded-md bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-300/20 dark:text-amber-100 dark:hover:bg-amber-300/30 disabled:opacity-40 px-4 py-2 text-xs font-semibold transition"
          onClick={props.onDownloadCsv}
          disabled={!props.rows.length}
        >
          Export CSV
        </button>
        <button
          type="button"
          className="rounded-md bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-300/20 dark:text-amber-100 dark:hover:bg-amber-300/30 disabled:opacity-40 px-4 py-2 text-xs font-semibold transition"
          onClick={props.onDownloadXlsx}
          disabled={!props.rows.length}
        >
          Export Excel
        </button>
      </div>

      <div className="mt-5 max-h-[22rem] space-y-3 overflow-y-auto pr-1">
        {props.rows.length ? (
          props.rows.map((row, index) => (
            <article
              key={row.id}
              className="rounded-2xl border border-amber-500/10 bg-neutral-100/30 dark:border-amber-300/15 dark:bg-black/30 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-display text-xs uppercase tracking-[0.2em] text-amber-800/70 dark:text-amber-200/70">
                  Entry {index + 1}
                </p>
                <div className="h-px flex-1 bg-gradient-to-r from-amber-500/20 dark:from-amber-400/30 to-transparent" />
              </div>
              <p className="mt-3 text-sm leading-6 text-neutral-800 dark:text-amber-100/85">{row.text}</p>
              <p className="mt-3 break-words rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-3 font-body text-sm tracking-[0.08em] text-emerald-800 dark:text-emerald-100/90">
                {row.morse}
              </p>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-amber-500/10 bg-amber-500/5 dark:border-amber-300/15 dark:bg-black/25 p-5 text-sm text-neutral-500 dark:text-amber-100/65">
            No batch rows yet. Upload a file or paste multiple paragraphs to generate a translation deck.
          </div>
        )}
      </div>
    </section>
  );
}
