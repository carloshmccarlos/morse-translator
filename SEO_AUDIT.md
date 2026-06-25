# SEO Audit: MorseAI

## 1. Project Overview & Context
- **Framework & Stack:** React SPA bundled with Vite, deployed likely via Cloudflare Pages (indicated by `wrangler.toml` and worker output).
- **Rendering Strategy:** Client-Side Rendering (CSR). Since search engines like Google can execute JS, the app is indexable, but having pre-rendered metadata in `index.html` is crucial.
- **Audience:** Students, radio hobbyists, escape room creators, tech hobbyists.
- **Main Keywords:** morse code translator, morse code translator audio.
- **Important Pages:** Single Page Application (only `/`).

## 2. Issues Discovered

### A. Missing `sitemap.xml`
- **Severity:** High
- **Why it matters:** Sitemaps help search engine crawlers discover and index pages efficiently. 
- **Files Involved:** N/A (Missing from `/public`)
- **Fix:** Create a static `sitemap.xml` in the `public` directory covering the root URL.

### B. Missing `robots.txt`
- **Severity:** High
- **Why it matters:** Controls crawler access, prevents indexing of private or irrelevant paths (like API endpoints or admin routes), and points to the sitemap.
- **Files Involved:** N/A (Missing from `/public`)
- **Fix:** Create `robots.txt` in the `public` directory.

### C. Missing Canonical URL Tag
- **Severity:** High
- **Why it matters:** Protects against duplicate content issues if the site is accessible via multiple domains, subdomains (e.g., www vs non-www), or HTTP vs HTTPS.
- **Files Involved:** `index.html`
- **Fix:** Add `<link rel="canonical" href="...">` pointing to the main domain.

### D. Missing Structured Data (JSON-LD)
- **Severity:** Medium
- **Why it matters:** Structured data helps search engines understand the content, and it can qualify the page for rich snippets (like "Software Application").
- **Files Involved:** `index.html`
- **Fix:** Add JSON-LD schema for a `WebApplication` or `SoftwareApplication`.

### E. Incomplete Open Graph & Twitter Card Data
- **Severity:** Medium
- **Why it matters:** Currently missing an `og:image` and `twitter:image`. When shared on social media, the link will not have a rich preview image, reducing click-through rates.
- **Files Involved:** `index.html`
- **Fix:** Add `og:image`, `og:url`, and `twitter:image` tags. We will point to an assumed image paths.

### F. Meta Description & Title Tweaks
- **Severity:** Low
- **Why it matters:** Current tags are good but can be slightly enhanced to capture more of the primary keywords ("speech to morse code", "ai morse translator").
- **Files Involved:** `index.html`
- **Fix:** Minor structural enhancements to meta tags.

### G. Heading Hierarchy & Alt Texts
- **Severity:** Low (Already well implemented)
- **Why it matters:** Accessibility and letting search engines understand the page outline.
- **Files Involved:** `src/components/*`
- **Current State:** The repo has a clear `<h1>` in `BrandHeader.tsx` and proper `<h2>` tags for panels. The logo has an `alt` text. No major fixes needed here!

## 3. Recommended Implementation Plan
- **Create `/public/sitemap.xml`**: Single URL mapping for the SPA.
- **Create `/public/robots.txt`**: Allow all, link to the sitemap.
- **Update `index.html`**:
  - Inject `<link rel="canonical">`.
  - Add missing `og:image` and `twitter:image` tags using `/favicon.png` as fallback since a dedicated social image doesn't exist yet.
  - Inject JSON-LD `SoftwareApplication` / `WebApplication` script.
