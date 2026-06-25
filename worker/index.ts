import { isSupportedAudioType, rateLimitByIp } from "./lib/limits";
import { textToMorse } from "./lib/morse";
import { transcribeWithDeepgram } from "./lib/stt";

interface Env {
  DEEPGRAM_API_KEY?: string;
  RATE_LIMIT_PER_MINUTE?: string;
  /** Comma-separated list of allowed origins, e.g. "https://example.com,https://www.example.com".
   *  Defaults to "*" in local development only. Set this in production wrangler secrets. */
  ALLOWED_ORIGIN?: string;
}

const MAX_AUDIO_BYTES = 3 * 1024 * 1024;

function getAllowedOrigin(env: Env, requestOrigin: string | null): string {
  const configured = env.ALLOWED_ORIGIN?.trim();

  // No restriction configured — allow all (useful for local dev)
  if (!configured) return "*";

  const allowed = configured.split(",").map((o) => o.trim());
  if (requestOrigin && allowed.includes(requestOrigin)) {
    return requestOrigin;
  }

  // Return the first allowed origin as a safe fallback
  return allowed[0] ?? "*";
}

function jsonResponse(data: unknown, status = 200, origin = "*"): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "content-type",
      "vary": "Origin"
    }
  });
}

function badRequest(error: string, origin: string): Response {
  return jsonResponse({ error }, 400, origin);
}

function methodNotAllowed(origin: string): Response {
  return jsonResponse({ error: "Method not allowed." }, 405, origin);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const requestOrigin = request.headers.get("origin");
    const origin = getAllowedOrigin(env, requestOrigin);

    if (request.method === "OPTIONS") {
      return jsonResponse({ ok: true }, 200, origin);
    }

    const ip = request.headers.get("cf-connecting-ip") ?? "local";
    const maxPerMinute = Number(env.RATE_LIMIT_PER_MINUTE ?? "20");
    const allowed = rateLimitByIp(ip, Number.isFinite(maxPerMinute) ? maxPerMinute : 20);
    if (!allowed) {
      return jsonResponse({ error: "Too many requests. Slow down." }, 429, origin);
    }

    if (url.pathname === "/api/translate") {
      // NOTE: This endpoint is intentionally kept server-side even though the conversion
      // is currently local. It serves as the extension point for future LLM-powered
      // translation (e.g. natural language → optimised Morse, abbreviations, prosigns).
      if (request.method !== "POST") return methodNotAllowed(origin);
      const body = await request.json().catch(() => null);
      if (!body || typeof body !== "object" || !("text" in body) || typeof (body as Record<string, unknown>).text !== "string") {
        return badRequest("Request body must include text.", origin);
      }
      const text = (body as { text: string }).text;
      return jsonResponse({ morse: textToMorse(text) }, 200, origin);
    }

    if (url.pathname === "/api/transcribe") {
      if (request.method !== "POST") return methodNotAllowed(origin);

      const formData = await request.formData().catch(() => null);
      const audio = formData?.get("audio");

      if (!(audio instanceof File)) {
        return badRequest("Missing audio file in multipart field `audio`.", origin);
      }

      if (audio.type.startsWith("video/")) {
        return badRequest("Video files are not allowed. Please upload an audio file.", origin);
      }

      if (!isSupportedAudioType(audio.name)) {
        return badRequest("Unsupported audio extension.", origin);
      }

      if (audio.size > MAX_AUDIO_BYTES) {
        return badRequest("Audio file exceeds 3MB limit.", origin);
      }

      try {
        const transcript = await transcribeWithDeepgram(audio, env);
        return jsonResponse({ transcript }, 200, origin);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Speech-to-text request failed.";
        return jsonResponse({ error: message }, 502, origin);
      }
    }

    if (url.pathname === "/health") {
      return jsonResponse({ status: "ok", service: "morseai-worker" }, 200, origin);
    }

    return jsonResponse({ error: "Not found." }, 404, origin);
  }
};

