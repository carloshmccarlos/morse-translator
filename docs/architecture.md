# Architecture

## Runtime Layout
- Static HTML shell loads the app and metadata.
- React Router manages client-side routing.
- React renders the interactive workspace into `#root` based on current path (`/`, `/about`, or `/faq`).
- Cloudflare Pages handles SPA routing by falling back to `index.html` via `public/_redirects`.
- Cloudflare Worker endpoints handle transcription and translation.

## Major UI Modules
- **TranslatorPage** (Main interactive workspace):
  - Audio input panel for upload and recording
  - Editable transcript workspace
  - Morse output and playback controls
  - Batch translation deck for multi-entry text
  - Signal lamp and learning mode panels
- **AboutPage** (Static content, Morse reference guides, and history timeline)
- **FaqPage** (Collapsible accordion Q&As, search input, and category tabs)
- **BrandHeader & NavBar** (Unified header shell containing site branding, routing navigation links, and theme toggle switch)

## Data Flow
1. User provides audio or text.
2. Frontend validates the input.
3. Audio is sent to the Worker for transcription.
4. Transcript is edited locally.
5. Transcript is translated to Morse locally or through the API fallback.
6. Output is copied, exported, played, or visualized.
7. User navigates between pages using standard client-side Router Links.
8. User switches themes; theme state sets the `.dark` class on the `<html>` or `<body>` element to instantly swap styles. All text colors dynamically adapt through Tailwind variable-mapped custom colors (`text-text-main`, `text-text-muted`, `text-text-title`, `text-text-h1`).

## Non-Functional Requirements
- Keep the main flow responsive and simple
- Enforce file size and duration limits
- Preserve a clear heading hierarchy for accessibility and SEO
- Ensure decorative elements do not capture clicks by using `pointer-events-none`
- Avoid adding unnecessary UI noise
