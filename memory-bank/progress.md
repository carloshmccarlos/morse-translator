# Progress Log

## 2026-03-08
### Completed
- Added `sitemap.xml` to `public` directory for SEO.
- Added Google Search Console verification file (`google7cfc68ab913bcd14.html`) to `public` directory.
- Verified project build with `pnpm build`.
- Deployed project to Cloudflare Workers with Assets.

## 2026-03-06
### Completed
- Added browser-side batch translation support for uploaded `.txt`, `.csv`, `.xls`, and `.xlsx` files.
- Added multi-paragraph paste workflow that splits entries by blank lines and generates per-entry Morse output.
- Expanded export options so users can download original text plus Morse code as `.txt`, `.csv`, or `.xlsx`.
- Added `xlsx` dependency and local spreadsheet parsing/export helpers.
- Lazy-loaded spreadsheet parsing/export code so the default client bundle stays smaller.
- Updated memory-bank documents (`prd.md`, `implementation.md`, `architecture.md`) for the new batch import/export workflow.
- Verified with:
  - `pnpm typecheck` passed
  - `pnpm build` passed

## 2026-03-05
### Completed
- Added frontend and backend validations to strictly allow only audio uploads and explicitly reject video file formats.
- Migrated STT service from OpenAI Whisper to Deepgram API for improved transcription.
- Updated `.env` and Cloudflare Worker to use `DEEPGRAM_API_KEY`.
- Updated `worker/lib/stt.ts` to call Deepgram's `v1/listen` endpoint using `nova-2` model.
- Updated memory-bank documents (`architecture.md`, `prd.md`, `implementation.md`) to reflect the change to Deepgram.
- Removed real-time transcription feature to simplify the UI and architecture.
- Integrated Umami analytics script for usage tracking.
## 2026-03-04
### Completed
- Added `memory-bank/prd.md` with full product requirements for MorseAI.
- Added `memory-bank/architecture.md` with MVP system design baseline.
- Added `memory-bank/implementation.md` with phased implementation plan.
- Implemented full project scaffold with `pnpm`, Vite React frontend, Tailwind styling, and Cloudflare Worker backend.
- Implemented Phase 1:
  - Audio upload validation (type/size)
  - Browser microphone recording with 30s cap
  - STT integration endpoint (`POST /api/transcribe`) wired to OpenAI API
  - Editable transcript and backend/local Morse translation flow
- Implemented Phase 2:
  - Morse playback (Web Audio API)
  - WPM speed control
  - Copy Morse output
  - Download `.txt` and generated `.wav`
- Implemented Phase 3:
  - Learning mode challenge panel
  - Visual Morse lamp blink panel
  - Reverse Morse-to-text utility in UI
- Verified with:
  - `pnpm typecheck` passed
  - `pnpm build` passed

### Next
- Add automated tests for Morse conversion and API handlers.
- Add end-to-end browser test script for recording/upload flow.
- Add deploy pipeline to Cloudflare with environment configuration checks.

### Risks to Track
- STT latency may challenge < 3s target depending on provider/model.
- Browser audio behavior can vary by codec and device permissions.
