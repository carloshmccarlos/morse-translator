export interface TranslateResponse {
  morse: string;
}

export interface TranscribeResponse {
  transcript: string;
}

export interface ApiErrorPayload {
  error: string;
}

export interface AudioFileCheckResult {
  ok: boolean;
  reason?: string;
}

export interface TranslationRow {
  id: string;
  text: string;
  morse: string;
}
