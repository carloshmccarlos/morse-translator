export interface ToneSegment {
  on: boolean;
  durationSec: number;
}

function unitDuration(wpm: number): number {
  return 1.2 / Math.max(5, wpm);
}

export function morseToToneSegments(morse: string, wpm: number): ToneSegment[] {
  const unit = unitDuration(wpm);
  const words = morse.trim().split(/\s*\/\s*/).filter(Boolean);
  const segments: ToneSegment[] = [];

  words.forEach((word, wordIndex) => {
    const letters = word.split(/\s+/).filter(Boolean);

    letters.forEach((letter, letterIndex) => {
      letter.split("").forEach((symbol, symbolIndex) => {
        if (symbol === ".") {
          segments.push({ on: true, durationSec: unit });
        } else if (symbol === "-") {
          segments.push({ on: true, durationSec: unit * 3 });
        }

        if (symbolIndex < letter.length - 1) {
          segments.push({ on: false, durationSec: unit });
        }
      });

      if (letterIndex < letters.length - 1) {
        segments.push({ on: false, durationSec: unit * 3 });
      }
    });

    if (wordIndex < words.length - 1) {
      segments.push({ on: false, durationSec: unit * 7 });
    }
  });

  return segments;
}

export async function generateMorseWav(
  morse: string,
  wpm: number,
  frequencyHz = 650
): Promise<Blob> {
  const segments = morseToToneSegments(morse, wpm);
  const sampleRate = 44_100;
  const totalSamples = Math.max(
    1,
    Math.ceil(
      segments.reduce((total, segment) => total + segment.durationSec, 0) * sampleRate
    )
  );

  const pcm = new Int16Array(totalSamples);
  let cursor = 0;

  segments.forEach((segment) => {
    const samples = Math.ceil(segment.durationSec * sampleRate);
    if (segment.on) {
      // Attack: first 10% of samples, Release: last 15% — cosine envelope to eliminate clicks
      const attackEnd = Math.floor(samples * 0.1);
      const releaseStart = Math.floor(samples * 0.85);

      for (let i = 0; i < samples && cursor + i < pcm.length; i += 1) {
        const t = i / sampleRate;
        let envelope = 1.0;

        if (i < attackEnd && attackEnd > 0) {
          // cosine fade-in: 0 → 1
          envelope = 0.5 - 0.5 * Math.cos((Math.PI * i) / attackEnd);
        } else if (i >= releaseStart && samples - releaseStart > 0) {
          // cosine fade-out: 1 → 0
          const releaseProgress = (i - releaseStart) / (samples - releaseStart);
          envelope = 0.5 + 0.5 * Math.cos(Math.PI * releaseProgress);
        }

        const sample = Math.sin(2 * Math.PI * frequencyHz * t) * envelope;
        pcm[cursor + i] = Math.round(sample * 16_000);
      }
    }
    cursor += samples;
  });

  const buffer = new ArrayBuffer(44 + pcm.length * 2);
  const view = new DataView(buffer);

  writeWavHeader(view, sampleRate, pcm.length);
  for (let i = 0; i < pcm.length; i += 1) {
    view.setInt16(44 + i * 2, pcm[i], true);
  }

  return new Blob([buffer], { type: "audio/wav" });
}

function writeWavHeader(view: DataView, sampleRate: number, samples: number): void {
  const blockAlign = 2;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples * 2;

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);
}

function writeString(view: DataView, offset: number, text: string): void {
  for (let i = 0; i < text.length; i += 1) {
    view.setUint8(offset + i, text.charCodeAt(i));
  }
}
