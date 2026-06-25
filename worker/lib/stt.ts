interface Env {
  DEEPGRAM_API_KEY?: string;
}

interface DeepgramResponse {
  results?: {
    channels?: Array<{
      alternatives?: Array<{ transcript?: string }>;
    }>;
  };
}

export async function transcribeWithDeepgram(audioFile: File, env: Env): Promise<string> {
  const apiKey = env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPGRAM_API_KEY is missing.");
  }

  const url = new URL("https://api.deepgram.com/v1/listen");
  url.searchParams.set("model", "nova-2");
  url.searchParams.set("smart_format", "true");

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": audioFile.type || "audio/webm"
    },
    body: audioFile
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`STT provider failed (${response.status}): ${details}`);
  }

  const payload = (await response.json()) as DeepgramResponse;
  const transcript = payload?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? "";
  return transcript.trim();
}
