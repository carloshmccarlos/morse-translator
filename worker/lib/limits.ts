interface WindowState {
  count: number;
  resetAt: number;
}

const windows = new Map<string, WindowState>();

export function rateLimitByIp(ip: string, requestsPerMinute: number): boolean {
  const now = Date.now();
  const windowSizeMs = 60_000;
  const state = windows.get(ip);

  if (!state || state.resetAt <= now) {
    windows.set(ip, { count: 1, resetAt: now + windowSizeMs });
    return true;
  }

  if (state.count >= requestsPerMinute) {
    return false;
  }

  state.count += 1;
  windows.set(ip, state);
  return true;
}

export function isSupportedAudioType(filename: string): boolean {
  const extension = `.${filename.split(".").pop()?.toLowerCase() ?? ""}`;
  return [".wav", ".mp3", ".m4a", ".ogg", ".webm", ".weba"].includes(extension);
}
