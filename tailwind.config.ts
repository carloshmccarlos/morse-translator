import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Audiowide", "sans-serif"],
        body: ["IBM Plex Mono", "monospace"]
      },
      colors: {
        panel: "var(--color-bg-panel)",
        "border-panel": "var(--color-border-panel)",
        "bg-input": "var(--color-bg-input)",
        "border-input": "var(--color-border-input)",
        "text-main": "var(--color-text-main)",
        "text-muted": "var(--color-text-muted)",
        "text-title": "var(--color-text-title)",
        "text-h1": "var(--color-text-h1)",
        glow: "#ffb300",
        accent: "#00d9a6"
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(255,179,0,0.2), 0 0 32px rgba(255,179,0,0.12)"
      },
      keyframes: {
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(1.5rem)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        }
      },
      animation: {
        slideInRight: "slideInRight 0.25s ease-out"
      }
    }
  },
  plugins: []
} satisfies Config;
