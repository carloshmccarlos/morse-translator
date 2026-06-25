import type { TranslationRow } from "../types/domain";

const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export function generateTranslationTxtBlob(rows: TranslationRow[]): Blob {
  const text = rows
    .map(
      (row, index) =>
        `Entry ${index + 1}\nOriginal Text:\n${row.text}\n\nMorse Code:\n${row.morse}`
    )
    .join("\n\n====================\n\n");

  return new Blob([text], { type: "text/plain;charset=utf-8" });
}

export function generateTranslationCsvBlob(rows: TranslationRow[]): Blob {
  const records = toExportRecords(rows);
  const header: ExportColumn[] = ["Index", "Original Text", "Morse Code"];
  const lines = [header, ...records.map((record) => header.map((key) => record[key]))].map(
    (cells) => cells.map(escapeCsvCell).join(",")
  );
  const csv = lines.join("\n");
  return new Blob([csv], { type: "text/csv;charset=utf-8" });
}

export async function generateTranslationXlsxBlob(
  rows: TranslationRow[]
): Promise<Blob> {
  const { utils, write } = await import("xlsx");
  const worksheet = utils.json_to_sheet(toExportRecords(rows));
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Translations");

  const buffer = write(workbook, { bookType: "xlsx", type: "array" });
  return new Blob([buffer], { type: XLSX_MIME });
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
