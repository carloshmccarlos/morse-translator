import type { TranslationRow } from "../types/domain";
import { textToMorse } from "./morse";

const TEXT_HEADERS = new Set([
  "text",
  "transcript",
  "message",
  "content",
  "paragraph",
  "input"
]);

const SPREADSHEET_EXTENSIONS = new Set(["csv", "xlsx", "xls"]);

export function parseParagraphInput(input: string): string[] {
  return input
    .split(/\r?\n\s*\r?\n+/)
    .map((block) => block.replace(/\r?\n+/g, " ").trim())
    .filter(Boolean);
}

export function buildTranslationRows(texts: string[]): TranslationRow[] {
  return texts
    .map((text) => text.trim())
    .filter(Boolean)
    .map((text, index) => ({
      id: `${crypto.randomUUID()}-${index}`,
      text,
      morse: textToMorse(text)
    }));
}

export async function parseBatchFile(file: File): Promise<string[]> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (extension === "txt") {
    return parseParagraphInput(await file.text());
  }

  if (SPREADSHEET_EXTENSIONS.has(extension)) {
    return parseSpreadsheetEntries(await file.arrayBuffer());
  }

  throw new Error("Unsupported batch file. Use .txt, .csv, .xls, or .xlsx.");
}

async function parseSpreadsheetEntries(buffer: ArrayBuffer): Promise<string[]> {
  const { read, utils } = await import("xlsx");
  const workbook = read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) return [];

  const worksheet = workbook.Sheets[firstSheetName];
  const rows = utils.sheet_to_json<(string | number | boolean | null)[]>(worksheet, {
    header: 1,
    blankrows: false,
    raw: false,
    defval: ""
  });

  return extractTextsFromRows(rows);
}

function extractTextsFromRows(rows: (string | number | boolean | null)[][]): string[] {
  if (!rows.length) return [];

  const headerRow = rows[0].map((cell) => normalizeCell(cell).toLowerCase());
  const textColumn = headerRow.findIndex((value) => TEXT_HEADERS.has(value));
  const dataRows = textColumn >= 0 ? rows.slice(1) : rows;

  return dataRows
    .map((row) => pickRowText(row, textColumn))
    .filter(Boolean);
}

function pickRowText(
  row: (string | number | boolean | null)[],
  textColumn: number
): string {
  if (textColumn >= 0) {
    return normalizeCell(row[textColumn]);
  }

  const normalizedCells = row.map(normalizeCell).filter(Boolean);
  if (!normalizedCells.length) return "";

  const textLikeCell = normalizedCells.find((cell) => /[A-Za-z\u00C0-\uFFFF]/.test(cell));
  return textLikeCell ?? normalizedCells[0];
}

function normalizeCell(value: string | number | boolean | null | undefined): string {
  return String(value ?? "")
    .replace(/\r?\n+/g, " ")
    .trim();
}
