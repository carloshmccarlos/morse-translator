import type { TranslationRow } from "../types/domain";

const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export function downloadTextFile(
  filename: string,
  text: string,
  mimeType = "text/plain;charset=utf-8"
): void {
  const blob = new Blob([text], { type: mimeType });
  triggerDownload(blob, filename);
}

export function downloadBlob(filename: string, blob: Blob): void {
  triggerDownload(blob, filename);
}

export function downloadTranslationTxt(filename: string, rows: TranslationRow[]): void {
  const text = rows
    .map(
      (row, index) =>
        `Entry ${index + 1}\nOriginal Text:\n${row.text}\n\nMorse Code:\n${row.morse}`
    )
    .join("\n\n====================\n\n");

  downloadTextFile(filename, text);
}

export function downloadTranslationCsv(filename: string, rows: TranslationRow[]): void {
  const records = toExportRecords(rows);
  const header: ExportColumn[] = ["Index", "Original Text", "Morse Code"];
  const lines = [header, ...records.map((record) => header.map((key) => record[key]))].map(
    (cells) => cells.map(escapeCsvCell).join(",")
  );
  const csv = lines.join("\n");
  downloadTextFile(filename, csv, "text/csv;charset=utf-8");
}

export async function downloadTranslationXlsx(
  filename: string,
  rows: TranslationRow[]
): Promise<void> {
  const { utils, write } = await import("xlsx");
  const worksheet = utils.json_to_sheet(toExportRecords(rows));
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Translations");

  const buffer = write(workbook, { bookType: "xlsx", type: "array" });
  downloadBlob(filename, new Blob([buffer], { type: XLSX_MIME }));
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function toExportRecords(rows: TranslationRow[]) {
  return rows.map((row, index) => ({
    Index: index + 1,
    "Original Text": row.text,
    "Morse Code": row.morse
  }));
}

function escapeCsvCell(value: string | number): string {
  const normalized = String(value).replace(/"/g, "\"\"");
  return /[",\n]/.test(normalized) ? `"${normalized}"` : normalized;
}

type ExportColumn = "Index" | "Original Text" | "Morse Code";
