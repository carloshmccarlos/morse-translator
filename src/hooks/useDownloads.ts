import { useCallback, useState } from "react";
import {
  downloadBlob,
  downloadTranslationCsv,
  downloadTranslationTxt,
  downloadTranslationXlsx
} from "../lib/downloads";
import { generateMorseWav } from "../lib/morseTiming";
import type { TranslationRow } from "../types/domain";

type Notifier = (message: string, isError?: boolean) => void;

/**
 * Returns factory-generated download handlers for both "current" and "batch" translation rows.
 * All handlers notify via the provided `notify` callback instead of setting state directly,
 * eliminating the 6 near-identical handler functions that existed in App.tsx.
 */
export function useDownloads(notify: Notifier) {
  const makeDownloader = useCallback(
    (
      fn: () => void | Promise<void>,
      successMsg: string,
      failMsg?: string
    ) =>
      async () => {
        try {
          await fn();
          notify(successMsg);
        } catch {
          notify(failMsg ?? "Export failed.", true);
        }
      },
    [notify]
  );

  function makeCurrentHandlers(getRows: () => TranslationRow[], morseOutput: string, wpm: number) {
    return {
      onDownloadTxt: makeDownloader(
        () => downloadTranslationTxt("morse-output.txt", getRows()),
        "TXT export downloaded."
      ),
      onDownloadCsv: makeDownloader(
        () => downloadTranslationCsv("morse-output.csv", getRows()),
        "CSV export downloaded."
      ),
      onDownloadXlsx: makeDownloader(
        () => downloadTranslationXlsx("morse-output.xlsx", getRows()),
        "Excel export downloaded.",
        "Excel export failed."
      ),
      onDownloadAudio: makeDownloader(
        async () => {
          if (!morseOutput) return;
          const wavBlob = await generateMorseWav(morseOutput, wpm);
          downloadBlob("morse-output.wav", wavBlob);
        },
        "WAV downloaded."
      ),
    };
  }

  function makeBatchHandlers(rows: TranslationRow[]) {
    return {
      onDownloadTxt: makeDownloader(
        () => downloadTranslationTxt("morse-batch.txt", rows),
        "Batch TXT export downloaded."
      ),
      onDownloadCsv: makeDownloader(
        () => downloadTranslationCsv("morse-batch.csv", rows),
        "Batch CSV export downloaded."
      ),
      onDownloadXlsx: makeDownloader(
        () => downloadTranslationXlsx("morse-batch.xlsx", rows),
        "Batch Excel export downloaded.",
        "Batch Excel export failed."
      ),
    };
  }

  return { makeCurrentHandlers, makeBatchHandlers };
}
