# SEO Changes Implemented

## 2026-08-06 — SEO/GEO Optimization Round 2

### 1. File: `public/og-image.png` (P0 fix)
- **What changed:** The file was actually a JPEG (1024×1024) with a `.png` extension, which broke social previews. Re-encoded to a true PNG at 1200×630 via `scripts/generate-seo-assets.mjs`.
- **Why it changed:** Social platforms (WeChat/X/Telegram) verify the declared `og:image:type` against the file; a mismatched format fails the preview.

### 2. New favicon / PWA icon set (generated from `public/favicon.png`)
- `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/favicon.ico` (16/32/48 PNG-embedded ICO)
- `public/icons/apple-touch-icon.png` (180), `public/icons/icon-192.png`, `public/icons/icon-512.png`
- `public/manifest.json` — PWA manifest (standalone, theme_color #0f1115, maskable icon)
- **Why it changed:** Browser tabs, iOS home screen, and PWA installability all require these; previously only a single 640×640 `favicon.png` existed.
- Regenerate anytime: `node scripts/generate-seo-assets.mjs`

### 3. GEO: `public/llms-full.txt` (new)
- Full llmstxt.org-compliant file: all 23 FAQs with full answers, feature list, character set, 1:3:7 timing reference, use cases, tech stack, machine-access endpoints.
- `public/llms.txt` updated to link to `/llms-full.txt` and corrected FAQ count 26 → 23.

### 4. File: `public/robots.txt`
- Expanded explicit AI-bot allowlist from 6 to 23 agents (added GPTBot, ClaudeBot, anthropic-ai, Google-Extended, Google-CloudVertexBot, cohere-ai, Cohere-AI, Bytespider, Applebot, meta-externalagent, meta-webagent, YouBot, Diffbot, CCBot, ImagesiftBot, TimpiBot, Perplexity-User).
- Kept `Disallow: /api/` for the worker endpoint; sitemap reference retained.

### 5. File: `public/sitemap.xml`
- `lastmod` refreshed to 2026-08-06 for all 3 URLs (/, /about, /faq).

### 6. File: `index.html`
- Title optimized to ~55 chars: `MorseAI — Audio Morse Code Translator (Free)` (was 77 chars, truncated in SERPs).
- Added `og:image:type` (image/png), `og:image:secure_url`, `twitter:image:alt`.
- Added `theme-color`, `application-name`, full icon links (16/32/ico/apple-touch-icon), `manifest.json`.
- JSON-LD consolidated into a single `@graph` with 6 entity types: **WebSite + Organization + WebApplication + FAQPage + HowTo + BreadcrumbList**, linked via `@id` anchors (`#website`, `#organization`, `#webapp`, `#faq`, `#howto`, `#breadcrumb`); Organization has real GitHub `sameAs`.

### 7. Files: `src/App.tsx`, `src/pages/FaqPage.tsx`
- Home page now renders a visible FAQ block (`<details open>` ×7) that exactly mirrors the FAQPage JSON-LD — AI engines distrust FAQ structured data without matching visible text.
- `/faq` page injects a page-level FAQPage JSON-LD (all 23 visible Q&As) via `useEffect`, so the full FAQ set is structured-data-annotated.
- Page titles synced with new brand title.

### 8. Scripts
- `scripts/generate-seo-assets.mjs` — regenerates all raster assets from `public/favicon.png` and repairs og-image. Uses sharp (isolated tool dir fallback since pnpm is broken in this sandbox).

## 1. File: `/public/sitemap.xml` (original round)
- **What changed:** Created a static XML sitemap for the site pointing to the home URL.
- **Why it changed:** Enables search engines like Google to discover and index the page correctly because it acts as a structured map.
- **Assumption:** I assumed the production URL is `https://morseai.app`. You should update this to your actual production domain.

## 2. File: `/public/robots.txt`
- **What changed:** Created a standard robots exclusion protocol file allowing all user agents, explicitly disallowing any potential internal `/api/` endpoints (to prevent indexing sensitive worker endpoints), and locating the sitemap.
- **Why it changed:** Crucial signal for crawlers to understand indexing rules and discover the sitemap.
- **Assumption:** The host domain is `https://morseai.app`. `/api/` logic handled via workers was excluded.

## 3. File: `index.html`
- **What changed:** 
  1. Injected `<link rel="canonical" href="https://morseai.app/" />` to establish the canonical URL.
  2. Optimized meta keywords list and slightly expanded meta descriptions to directly grab keywords like "speech to morse code, ai translator".
  3. Added an open graph image (`og:image`), twitter card image (`twitter:image`), and explicit `og:url`. Since no dedicated open graph cover image was found, I defaulted it to `/favicon.png`.
  4. Embedded a `<script type="application/ld+json">` snippet using the `WebApplication` (SoftwareApplication schema) so that search engines can better recognize and perhaps feature MorseAI inside rich results.
- **Why it changed:** A complete and compliant `<head>` dramatically improves shareability (via rich previews on social platforms) and indexing quality via precise metadata descriptors.

## 4. What still needs manual input from you
1. **Update the Domain:** Search the codebase (`index.html`, `sitemap.xml`, `robots.txt`) for `https://morseai.app` and replace it with your actual deployment domain.
2. **Create a proper Social Image:** In `index.html`, I set the `og:image` to `/favicon.png`. For better social sharing impact, design a 1200x630 pixel graphic and save it as `/public/og-image.jpg`, then update `index.html` to point to it.
3. **Expand the Sitemap (Future-Proofing):** If you build an additional "About" or "Blog" page, don't forget to append it manually or switch to an automated `vite-plugin-sitemap` plugin.
4. **Heading & Alt Text Architecture:** The codebase is well-structured. Found a clear `<h1>` in `BrandHeader.tsx` and proper `<h2>` blocks across all interactive components. Image `alt` tags are appropriately set on logos. Keep adhering to this standard when adding new components!
