# Tech Stack

## Frontend
- Vite
- React 18
- react-router-dom v7 for client-side routing
- TypeScript
- Tailwind CSS (configured for selector-based dark mode using `.dark` class)
- CSS Custom Properties (`:root` / `html.dark`) mapped to Tailwind configuration for theme-responsive styling (`text-text-main`, `text-text-muted`, `text-text-title`, `text-text-h1`)
- Web Audio API for tone playback and AnalyserNode for real-time microphone volume analysis
- Google Analytics (gtag.js) for page traffic measurement

## Backend
- Cloudflare Workers
- TypeScript
- Deepgram API for speech-to-text

## Tooling
- `pnpm` for package management
- Playwright for browser checks
- `xlsx` for spreadsheet import and export
- `wrangler` for local Worker development

## Deployment Notes
- The app is a client-rendered SPA.
- Vite handles static building; Cloudflare Pages redirects all non-file asset requests to `/index.html` to support client-side routing.
- `index.html` carries SEO metadata, Google tag analytics script, and verification assets.
- `public/` hosts static assets such as `favicon.png`, `robots.txt`, and `sitemap.xml`.
- To comply with Google Safe Browsing and avoid "HTML Smuggling" heuristics, all client-side files (.txt, .csv, .xlsx, .wav) are generated into memory Blob URLs bound directly to native anchor (`<a>`) href elements rather than being triggered via programmatic script clicks.
- Dynamic browser title and meta description tag updates are performed on component mount via `useEffect` lifecycle hooks in each route page component. Component layouts inspect the route using `useLocation` to conditionally adjust header elements (e.g. `<h1>` vs `<p>`) to enforce the single-h1 hierarchy per page.

