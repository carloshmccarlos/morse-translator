const MORSE_TABLE: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "0": "-----",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  // ITU-R standard punctuation
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  "_": "..--.-",
  '"': ".-..-.",
  "@": ".--.-.",
  "'": ".----."
};

const REVERSE_TABLE = Object.entries(MORSE_TABLE).reduce<Record<string, string>>(
  (acc, [plain, code]) => {
    acc[code] = plain;
    return acc;
  },
  {}
);

export const SUPPORTED_CHARS = Object.keys(MORSE_TABLE);

export function textToMorse(text: string): string {
  const normalized = text.toUpperCase().trim();
  if (!normalized) return "";

  const words = normalized.split(/\s+/);
  const convertedWords = words.map((word) =>
    word
      .split("")
      .map((char) => MORSE_TABLE[char] ?? "")
      .filter(Boolean)
      .join(" ")
  );

  return convertedWords.filter(Boolean).join(" / ");
}

export function morseToText(morse: string): string {
  const normalized = morse.trim();
  if (!normalized) return "";

  const words = normalized.split(/\s*\/\s*/);
  const convertedWords = words.map((word) =>
    word
      .trim()
      .split(/\s+/)
      .map((chunk) => REVERSE_TABLE[chunk] ?? "")
      .join("")
  );

  return convertedWords.filter(Boolean).join(" ");
}
