import type {
  ApiErrorPayload,
  TranscribeResponse,
  TranslateResponse
} from "../types/domain";

const API_BASE_URL = resolveApiBaseUrl();

// Active abort controllers for in-flight requests
const controllers: Record<string, AbortController> = {};

function abortPrevious(key: string): AbortSignal {
  controllers[key]?.abort();
  const controller = new AbortController();
  controllers[key] = controller;
  return controller.signal;
}

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as ApiErrorPayload;
    return payload.error || `Request failed (${response.status})`;
  } catch {
    return `Request failed (${response.status})`;
  }
}

export async function transcribeAudio(
  audioBlob: Blob,
  filename: string
): Promise<TranscribeResponse> {
  const signal = abortPrevious("transcribe");
  const formData = new FormData();
  formData.set("audio", audioBlob, filename);

  const response = await request(buildApiUrl("/api/transcribe"), {
    method: "POST",
    body: formData,
    signal
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as TranscribeResponse;
}

export async function translateText(text: string): Promise<TranslateResponse> {
  const signal = abortPrevious("translate");
  const response = await request(buildApiUrl("/api/translate"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text }),
    signal
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as TranslateResponse;
}

function buildApiUrl(pathname: string): string {
  return `${API_BASE_URL}${pathname}`;
}

function resolveApiBaseUrl(): string {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/+$/, "");
  }

  if (import.meta.env.DEV) {
    return "http://127.0.0.1:8787";
  }

  return "";
}

async function request(input: string, init: RequestInit): Promise<Response> {
  try {
    return await fetch(input, init);
  } catch (error) {
    // AbortError is expected when user cancels — don't show an error message
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    if (error instanceof TypeError) {
      throw new Error(
        `API server is offline at ${API_BASE_URL || window.location.origin}. Start \`pnpm dev:worker\` or \`pnpm dev:all\`.`
      );
    }
    throw error;
  }
}

