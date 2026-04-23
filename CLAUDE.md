# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:4321
npm run build      # Type-check (astro check) then build static site
npm run preview    # Preview production build locally
```

There is no test runner or linter configured.

## Architecture

Astro 6 static site (SSG) with Preact islands, deployed to Vercel. The site is for Rosetta's Angels, a Montreal nonprofit running a holiday basket brigade.

### Rendering model

- **Static by default** — all pages are pre-rendered at build time.
- **One exception:** `src/pages/api/volunteer-submit.ts` is a serverless Vercel function (`export const prerender = false`). It proxies volunteer form submissions to a Google Apps Script webhook that writes to Google Sheets, keeping the `GSHEETS_SHARED_SECRET` server-side.

### Islands (Preact)

Interactive client-side components live in `src/islands/*.tsx`. These are hydrated via Astro's `client:*` directives from `.astro` page/component files. Current islands: `VolunteerForm`, `ContactForm`, `MobileMenu`, `Lightbox`, `TestimonialsCarousel`, `HeroVideoTile`.

### Styling

Vanilla CSS with design tokens in `src/styles/tokens.css`. All values (colors, spacing, type scale, breakpoints) must be consumed via `var(--…)` — never hardcode. The type scale uses fluid `clamp()` values. Breakpoints are mobile-first: default ≤640px, `sm` ≥640, `md` ≥768, `lg` ≥1024, `xl` ≥1280, `2xl` ≥1536.

### Path alias

`~/` maps to `./src/` (configured in tsconfig.json). Use `import { foo } from '~/lib/bar'` style imports.

### Key lib modules

- **`cloudinary.ts`** — Builds deterministic Cloudinary CDN URLs with memoization. No API calls; pure URL generation.
- **`recaptcha.ts`** / **`recaptcha-client.ts`** — Server-side verify vs. client-side token fetch (reCAPTCHA v3).
- **`csrf.ts`** — Lightweight per-render CSRF token (pair with origin check).
- **`sanitize.ts`** — Input sanitization for form data.
- **`event-config.ts`** — Event dates that drive volunteer form availability. Update `EVENT_DATES` array for each year's event.
- **`gallery-assets.ts`** — Gallery asset manifest (Cloudinary public IDs).

### Form submission flow (volunteer)

1. Client: Preact `VolunteerForm` collects data, gets reCAPTCHA token, includes CSRF token + honeypot.
2. Client POSTs JSON to `/api/volunteer-submit`.
3. Server endpoint validates origin, CSRF, honeypot, reCAPTCHA, then sanitizes and forwards to Google Apps Script webhook.
4. Client also sends a notification email via EmailJS (client-side, separate from the webhook).

### Environment variables

Copy `.env.example` to `.env`. Variables prefixed `PUBLIC_` are inlined into the client bundle. Server-only secrets: `RECAPTCHA_SECRET_KEY`, `GSHEETS_WEBHOOK_URL`, `GSHEETS_SHARED_SECRET`.

### Content Security Policy

CSP headers are configured in two places: `astro.config.mjs` (dev, via Vite headers) and `vercel.json` (production, plus security headers like `X-Frame-Options`, `Referrer-Policy`).

### Reveal animations

Elements with class `.reveal` get `.is-visible` added via IntersectionObserver (in `BaseLayout.astro`). Respects `prefers-reduced-motion`.
