# Architecture

## Scope
Implemented architecture for Phases 1-3 of `MorseAI - Audio to Morse Code Translator`.

## System Overview
- Client app captures or uploads audio.
- Backend endpoint transcribes audio with external STT.
- Transcript is editable on client.
- Transcript is converted to Morse and rendered.
- Client can import text batches from `.txt`, `.csv`, and `.xlsx`.
- Client can translate multiple pasted paragraphs in one batch.
- Client can export single or batch translation results as `.txt`, `.csv`, and `.xlsx`.
- Client can synthesize Morse tone audio for playback.
- Learning mode provides Morse decoding practice challenges.
- Visual lamp mode blinks Morse output timing as a light signal.

## Runtime Topology
- Frontend: Vite + React + TypeScript + Tailwind CSS
- Backend: Cloudflare Worker API routes
- External AI: Deepgram API

## Major Components
1. UI Shell
- Console-themed landing shell, responsive desktop/mobile sections
- Distinct UI panels for input, transcript, output, learning, visual signal

2. Audio Input Module
- Browser recording via `MediaRecorder`
- File upload validation (`.wav/.mp3/.m4a/.ogg/.weba`, <= 3 MB, video forbidden)
- Max recording duration: 30s

3. Transcription API Module
- `POST /api/transcribe`
- Accepts audio payload and returns transcript text
- Enforces size/type limits and rate limiting
- Forwards to Deepgram transcription model (`nova-2`)

4. Translation Module
- `POST /api/translate`
- Deterministic mapping for A-Z, 0-9, spaces
- Returns Morse string
- Reverse translation utility on client for Morse-to-text extension

5. Batch Translation Workspace
- Browser-side parser for `.txt`, `.csv`, `.xls`, `.xlsx`
- Spreadsheet imports read the first worksheet
- Header-aware extraction prefers `text` / `transcript` columns
- Paragraph paste flow splits entries on blank lines
- Batch translation uses shared deterministic client conversion

6. Export Module
- Current translation export supports `.txt`, `.csv`, `.xlsx`
- Batch translation export supports `.txt`, `.csv`, `.xlsx`
- Text exports include both original text and Morse output

7. Morse Audio Playback Module
- Web Audio API tone generation
- WPM-adjustable timing for dot/dash/gaps
- Play/stop controls
- WAV export generated from deterministic Morse timing

## Data Contracts (Initial)
- Transcribe response:
```json
{ "transcript": "hello world" }
```
- Translate response:
```json
{ "morse": ".... . .-.. .-.. --- / .-- --- .-. .-.. -.." }
```

## Non-Functional Requirements
- Processing target: < 3s (subject to external STT latency)
- Max recording duration: 30s
- Upload limit: 3MB
- No permanent audio persistence in MVP
- Batch import/export stays browser-side to avoid extra backend load

## Security Baseline
- MIME/extension validation
- Request size limits
- In-memory IP rate limiting at Worker edge
- Avoid logging raw audio content
- Batch file parsing is local-only and limited to user-provided files in the browser

## Current Gaps / Next Decisions
- Production-ready persistent rate limiting (Durable Objects/KV) if traffic increases
- Optional temporary storage flow (R2) for debugging large uploads
- Multilingual transcription support strategy
