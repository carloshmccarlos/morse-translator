import { useCallback, useState } from "react";
import { buildTranslationRows, parseBatchFile, parseParagraphInput } from "../lib/batchTranslation";
import type { TranslationRow } from "../types/domain";

type Notifier = (message: string, isError?: boolean) => void;

export interface BatchTranslationState {
  batchInput: string;
  batchRows: TranslationRow[];
  batchSourceLabel: string;
  isBusy: boolean;
}

export interface BatchTranslationActions {
  setBatchInput: (v: string) => void;
  handleBatchFileSelected: (file: File | null) => Promise<void>;
  handleTranslateParagraphs: () => void;
}

export function useBatchTranslation(
  notify: Notifier
): BatchTranslationState & BatchTranslationActions {
  const [batchInput, setBatchInput] = useState("");
  const [batchRows, setBatchRows] = useState<TranslationRow[]>([]);
  const [batchSourceLabel, setBatchSourceLabel] = useState("");
  const [isBusy, setIsBusy] = useState(false);

  const handleBatchFileSelected = useCallback(
    async (file: File | null) => {
      if (!file) return;
      setIsBusy(true);

      try {
        const texts = await parseBatchFile(file);
        const rows = buildTranslationRows(texts);

        if (!rows.length) {
          throw new Error("No text rows found in the uploaded file.");
        }

        setBatchRows(rows);
        setBatchInput(texts.join("\n\n"));
        setBatchSourceLabel(`Loaded from ${file.name}`);
        notify(`Batch translation ready (${rows.length} entries).`);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Batch import failed.";
        notify(message, true);
      } finally {
        setIsBusy(false);
      }
    },
    [notify]
  );

  const handleTranslateParagraphs = useCallback(() => {
    const texts = parseParagraphInput(batchInput);
    if (!texts.length) {
      notify("Add at least one paragraph to translate.", true);
      return;
    }

    const rows = buildTranslationRows(texts);
    setBatchRows(rows);
    setBatchSourceLabel("Loaded from pasted paragraphs");
    notify(`Paragraph batch translated (${rows.length} entries).`);
  }, [batchInput, notify]);

  return {
    batchInput,
    batchRows,
    batchSourceLabel,
    isBusy,
    setBatchInput,
    handleBatchFileSelected,
    handleTranslateParagraphs,
  };
}
