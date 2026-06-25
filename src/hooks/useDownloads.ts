import { useEffect, useState } from "react";
import {
  generateTranslationTxtBlob,
  generateTranslationCsvBlob,
  generateTranslationXlsxBlob,
} from "../lib/downloads";
import { generateMorseWav } from "../lib/morseTiming";
import type { TranslationRow } from "../types/domain";

export interface CurrentDownloadUrls {
  txtUrl: string | null;
  csvUrl: string | null;
  xlsxUrl: string | null;
  wavUrl: string | null;
}

export interface BatchDownloadUrls {
  txtUrl: string | null;
  csvUrl: string | null;
  xlsxUrl: string | null;
}

/**
 * Hook to reactively generate Blob URLs for the current translation.
 * Uses a 300ms debounce to prevent overhead during active typing.
 * Automatically handles URL revocation in its cleanup function.
 */
export function useCurrentDownloadUrls(
  transcript: string,
  morseOutput: string,
  wpm: number
): CurrentDownloadUrls {
  const [urls, setUrls] = useState<CurrentDownloadUrls>({
    txtUrl: null,
    csvUrl: null,
    xlsxUrl: null,
    wavUrl: null,
  });

  useEffect(() => {
    const trimmedTranscript = transcript.trim();
    const trimmedMorse = morseOutput.trim();

    if (!trimmedTranscript || !trimmedMorse) {
      setUrls({ txtUrl: null, csvUrl: null, xlsxUrl: null, wavUrl: null });
      return;
    }

    const handler = setTimeout(async () => {
      let txtUrl: string | null = null;
      let csvUrl: string | null = null;
      let xlsxUrl: string | null = null;
      let wavUrl: string | null = null;

      try {
        const rows: TranslationRow[] = [
          { id: "current-translation", text: trimmedTranscript, morse: trimmedMorse },
        ];

        const txtBlob = generateTranslationTxtBlob(rows);
        txtUrl = URL.createObjectURL(txtBlob);

        const csvBlob = generateTranslationCsvBlob(rows);
        csvUrl = URL.createObjectURL(csvBlob);

        const xlsxBlob = await generateTranslationXlsxBlob(rows);
        xlsxUrl = URL.createObjectURL(xlsxBlob);

        const wavBlob = await generateMorseWav(trimmedMorse, wpm);
        wavUrl = URL.createObjectURL(wavBlob);

        setUrls({ txtUrl, csvUrl, xlsxUrl, wavUrl });
      } catch (error) {
        console.error("Failed to generate current download URLs:", error);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
      // Clean up generated URLs to prevent memory leaks
      setUrls((prev) => {
        if (prev.txtUrl) URL.revokeObjectURL(prev.txtUrl);
        if (prev.csvUrl) URL.revokeObjectURL(prev.csvUrl);
        if (prev.xlsxUrl) URL.revokeObjectURL(prev.xlsxUrl);
        if (prev.wavUrl) URL.revokeObjectURL(prev.wavUrl);
        return { txtUrl: null, csvUrl: null, xlsxUrl: null, wavUrl: null };
      });
    };
  }, [transcript, morseOutput, wpm]);

  return urls;
}

/**
 * Hook to reactively generate Blob URLs for batch translation rows.
 * Uses a 300ms debounce and handles URL revocation during cleanup.
 */
export function useBatchDownloadUrls(batchRows: TranslationRow[]): BatchDownloadUrls {
  const [urls, setUrls] = useState<BatchDownloadUrls>({
    txtUrl: null,
    csvUrl: null,
    xlsxUrl: null,
  });

  useEffect(() => {
    if (!batchRows || batchRows.length === 0) {
      setUrls({ txtUrl: null, csvUrl: null, xlsxUrl: null });
      return;
    }

    const handler = setTimeout(async () => {
      let txtUrl: string | null = null;
      let csvUrl: string | null = null;
      let xlsxUrl: string | null = null;

      try {
        const txtBlob = generateTranslationTxtBlob(batchRows);
        txtUrl = URL.createObjectURL(txtBlob);

        const csvBlob = generateTranslationCsvBlob(batchRows);
        csvUrl = URL.createObjectURL(csvBlob);

        const xlsxBlob = await generateTranslationXlsxBlob(batchRows);
        xlsxUrl = URL.createObjectURL(xlsxBlob);

        setUrls({ txtUrl, csvUrl, xlsxUrl });
      } catch (error) {
        console.error("Failed to generate batch download URLs:", error);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
      // Clean up generated URLs to prevent memory leaks
      setUrls((prev) => {
        if (prev.txtUrl) URL.revokeObjectURL(prev.txtUrl);
        if (prev.csvUrl) URL.revokeObjectURL(prev.csvUrl);
        if (prev.xlsxUrl) URL.revokeObjectURL(prev.xlsxUrl);
        return { txtUrl: null, csvUrl: null, xlsxUrl: null };
      });
    };
  }, [batchRows]);

  return urls;
}
