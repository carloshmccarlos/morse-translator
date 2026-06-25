# Product Requirements Document (PRD)

## Product Name
MorseAI - Audio to Morse Code Translator

## 1. Overview
MorseAI is a web application that converts spoken audio into Morse code.
Users can either upload an audio file or record speech directly in the browser.
The system uses AI speech-to-text to transcribe speech and then converts the transcript into Morse code.

Primary intent:
- Fast, simple, interactive Morse exploration
- Education-friendly workflow (listen, transcribe, translate, play)

## 2. Goals & Objectives
### Primary Goals
- Convert spoken audio into Morse code
- Provide instant transcription and Morse translation
- Support audio upload and live recording
- Deliver a simple, responsive web interface

### Success Metrics
- Users successfully generate Morse output
- Average processing time under 3 seconds
- Session completion rate above 70%

## 3. Target Users
### Primary Users
- Students learning Morse code
- Radio hobbyists / amateur radio operators
- Developers and tech hobbyists
- Educators teaching communication protocols

### Secondary Users
- Puzzle / escape room creators
- Security / cryptography hobbyists

## 4. Core Features (MVP)
### 4.1 Audio Input
Users provide audio in two ways:
- Record audio from browser microphone
- Upload audio file

#### Recording Requirements
- Max duration: 30 seconds
- Visual recording indicator
- Stop and submit recording

#### Upload Requirements
- Supported formats: `.wav`, `.mp3`, `.m4a`, `.ogg`, `.webm`, `.weba` (Audio files only, video explicitly forbidden)
- Max file size: 3 MB

### 4.2 Speech-to-Text (AI)
Flow:
1. Audio submitted
2. Audio sent to backend
3. STT model processes audio
4. Transcript returned to frontend

Requirements:
- Accuracy prioritized over real-time streaming
- Processing target under 3 seconds
- Transcript editable before Morse conversion

Example:
- Input audio: `hello world`
- Transcript: `hello world`

### 4.3 Morse Code Translation
Deterministic transcript-to-Morse conversion.

Example:
- Input: `hello world`
- Output: `.... . .-.. .-.. --- / .-- --- .-. .-.. -..`

Rules:
- A-Z supported
- 0-9 supported
- Space mapped to `/`

### 4.4 Morse Output Display
UI should provide:
- Morse text output
- Copy button
- Optional downloads: `.txt`, `.csv`, `.xlsx`, `.wav` (Morse tone audio)
- Text exports must include both the original text and the Morse result

### 4.5 Batch Text Translation
Users can translate multiple text entries in one pass.

Requirements:
- Upload supported batch text files: `.txt`, `.csv`, `.xlsx`
- Paste multiple paragraphs directly into the UI
- Batch input should normalize and skip empty entries
- Each batch row returns original text plus Morse output
- Batch results are exportable as `.txt`, `.csv`, `.xlsx`

Parsing rules:
- `.txt` files use paragraph breaks as the primary delimiter
- `.csv` / `.xlsx` imports should prefer a `text` or `transcript` column when present
- If no recognized header exists, use the first non-empty column per row

### 4.6 Morse Audio Playback
Generate Morse tone playback with:
- Play
- Stop
- Speed control (WPM)

Tone rules:
- Dot = short beep
- Dash = long beep
- Proper spacing between symbols, letters, and words

### 4.7 Analytics
- Integration with Umami for usage tracking.
- Metrics: page views, processing events, tool usage.

### 4.8 SEO
- `sitemap.xml` included to help search engines index the site.
- Google Search Console verification integrated.

## 5. Future Features (Post-MVP)
- Reverse translation (Morse -> Text)
- Real-time streaming transcription
- Visual Morse (blinking light animation)
- Learning mode
- Shareable result links
- Offline mode (client-side inference)

## 6. User Flows
### Flow 1: Record Audio
1. Open website
2. Click Record
3. Speak message
4. Click Stop
5. System transcribes audio
6. Transcript displayed
7. User edits transcript
8. Click Translate
9. Morse generated
10. User plays/copies/downloads output

### Flow 2: Upload Audio
1. Open website
2. Upload audio file
3. File processed
4. Transcript generated
5. User edits transcript
6. Click Translate
7. Morse generated

### Flow 3: Batch Import
1. Open website
2. Upload a `.txt`, `.csv`, or `.xlsx` file
3. System extracts text rows or paragraphs
4. Morse translations are generated for each row
5. User reviews the batch preview
6. User exports the batch as `.txt`, `.csv`, or `.xlsx`

### Flow 4: Multi-Paragraph Paste
1. Open website
2. Paste multiple paragraphs into the batch text area
3. Click translate batch
4. System splits paragraphs and generates Morse rows
5. User exports the translated batch

## 7. System Architecture (Product-Level)
### Frontend
- Built with Vinext (Cloudflare)
- Responsibilities: recording, upload, result display, interaction
- Tech: TypeScript, Tailwind CSS, Web Audio API, Fetch API

### Backend
- Cloudflare Workers
- Responsibilities: receive audio, call STT API, process transcript, convert to Morse

### AI Service
- Primary recommendation: Deepgram API
- Alternatives: OpenAI Whisper, AssemblyAI

### Morse Engine
- Deterministic dictionary-based conversion
- Input text -> normalized chars -> Morse map -> output string

## 8. Tech Stack
### Frontend
- Vinext
- TypeScript
- Tailwind CSS
- Web Audio API

### Backend
- Cloudflare Workers
- TypeScript

### Optional Storage
- Cloudflare R2 (if temporary storage needed)

### AI
- Deepgram API

## 9. Performance Requirements
- Audio processing: under 3 seconds
- Upload limit: 3 MB
- Max audio length: 30 seconds
- Page load: under 1 second

## 10. Security
- Validate file type
- Enforce upload size limits
- Rate limit requests
- Do not store audio permanently in MVP

## 11. UI Pages
### Landing Page
- Product title
- Record button
- Upload control
- "How it works" section
- Batch translation workspace

### Result Section / Page
- Editable transcript
- Morse output
- Morse audio playback controls
- Copy/download actions
- Batch preview and export actions

## 12. Risks & Mitigations
- Speech recognition errors -> allow transcript editing
- Background noise -> user guidance for clear speech
- Large/bad files -> strict validation and limits

## 13. Milestones
### Phase 1 (Core MVP)
- Recording
- Upload
- STT integration
- Morse translation

### Phase 2 (Playback + UX)
- Morse audio playback
- Copy/download UX

### Phase 3 (Enhancements)
- Real-time mode
- Learning features

## 14. API Design (Draft)
### `POST /api/transcribe`
Request:
- multipart form with audio file

Response:
```json
{
  "transcript": "hello world"
}
```

### `POST /api/translate`
Request:
```json
{
  "text": "hello world"
}
```

Response:
```json
{
  "morse": ".... . .-.. .-.. --- / .-- --- .-. .-.. -.."
}
```
