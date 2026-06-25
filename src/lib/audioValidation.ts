import type { AudioFileCheckResult } from "../types/domain";

const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = [".wav", ".mp3", ".m4a", ".ogg", ".webm", ".weba"];

export function validateAudioFile(file: File): AudioFileCheckResult {
  if (file.type.startsWith("video/")) {
    return {
      ok: false,
      reason: "Video files are not allowed. Please upload an audio file."
    };
  }

  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;

  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    return {
      ok: false,
      reason: "Unsupported file type. Use .wav, .mp3, .m4a, .ogg, or .webm."
    };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return {
      ok: false,
      reason: "File is larger than 10MB."
    };
  }

  return { ok: true };
}
