# Implementation Plan

## Current Status
- PRD captured and normalized.
- Architecture baseline established.
- Phase 1-3 implementation completed in codebase.
- SEO improvements (sitemap, verification) implemented.
- Initial deployment to Cloudflare completed.
- Batch text import/export extension is planned for the next iteration.

## Build Plan (Phases 1-3)
1. Project scaffold
- Initialize Vinext + TypeScript + Tailwind project
- Configure Cloudflare Worker runtime and API routes

2. Shared domain logic
- Implement Morse dictionary and conversion utility
- Add tests for conversion edge cases (letters, digits, spaces, symbols handling)

3. Audio input UI
- Microphone recording flow (start/stop, 30s cap, status indicator)
- File upload flow with client validation (reject video files explicitly)

4. Backend STT endpoint
- `POST /api/transcribe` multipart handler
- File type/size validation
- Deepgram API call + transcript response

5. Translation endpoint
- `POST /api/translate` JSON handler
- Normalization and deterministic Morse mapping

6. Result UX
- Editable transcript field
- Translate action
- Morse text output + copy button

7. Morse audio playback
- Web Audio API tone generation from Morse
- Play/stop and WPM control

8. Hardening
- Error states and retries
- Rate limiting
- Basic telemetry/perf timing
- Umami analytics integration for usage tracking

9. Phase 3 enhancements
- Learning mode (Morse practice challenge)
- Optional reverse translation and visual blink mode if time allows

10. Batch text workflows
- Add browser-side parser for `.txt`, `.csv`, and `.xlsx`
- Support multi-paragraph paste input separated by blank lines
- Generate per-row Morse results using shared deterministic conversion
- Add export helpers for `.txt`, `.csv`, and `.xlsx`
- Surface batch preview rows in a dedicated UI panel

## Acceptance Criteria (MVP + Phase 3)
- User can record or upload valid audio and receive transcript.
- User can edit transcript and translate to valid Morse output.
- User can play Morse audio at adjustable WPM.
- User can export the current text + Morse pair as `.txt`, `.csv`, and `.xlsx`.
- User can upload valid `.txt`, `.csv`, or `.xlsx` files and receive batch Morse rows.
- User can paste multiple paragraphs and translate them as a batch.
- Core interactions complete under normal conditions with clear errors.
- Learning mode provides interactive practice feedback.

## Verification Snapshot
- `pnpm typecheck`: pass
- `pnpm build`: pass
