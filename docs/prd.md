# Product Requirements

## Product
MorseAI is a browser app that converts speech audio into Morse code.

## Users
- Students learning Morse code
- Radio hobbyists and amateur operators
- Developers and tech hobbyists
- Educators and puzzle builders

## Goals
- Transcribe uploaded or recorded speech
- Convert transcript text into Morse code
- Support batch text translation and exports
- Provide Morse playback and visual signal modes
- Provide static SEO/GEO content pages (About, FAQ) to help search crawlers and AI search agents find and cite MorseAI.
- Provide full Light Mode and Dark Mode support with a user-friendly toggle in the navigation or settings.

## Core Flows
1. Upload or record audio.
2. Transcribe the audio to editable text.
3. Translate text to Morse.
4. Copy, export, or play the Morse output.
5. Translate batches of pasted text or uploaded files.
6. Navigate via header tabs to About page (reference guides, history) and FAQ page.

## Constraints
- Max recording duration: 30 seconds
- Max upload size: 3 MB
- Supported audio formats are limited to common browser-friendly types
- Keep the interface concise and low-chatter
- All decorative overlay panels and blurred background spheres must not block mouse interactions (use `pointer-events-none`).
- Title and text colors across all pages must be theme-responsive using semantic styling, ensuring high readability in both light and dark modes.
