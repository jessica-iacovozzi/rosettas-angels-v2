# Rosetta's Angels

Astro 6 + Preact islands site for Rosetta's Angels, a Montreal-based non-profit
running a holiday basket brigade for families in need.

## Quickstart

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev            # http://localhost:4321
```

## Stack

- **Astro 6** static SSG, deployed to Vercel
- **Preact** for interactive islands (forms, lightbox, carousel, mobile menu)
- **Vanilla CSS** with design tokens — no CSS framework
- **Cloudinary** for images and video (cloud name `rosettasangels`)
- **EmailJS** client-side notification email
- **Google Sheets** via Apps Script Web App webhook for volunteer submissions
- **Donorbox** embedded widget for donations
- **reCAPTCHA v3** for form bot protection

## Project layout

```
src/
├── pages/             # .astro routes (one file = one URL)
│   └── api/           # serverless endpoints (Vercel functions)
├── layouts/           # BaseLayout.astro
├── components/        # presentational .astro components
│   ├── layout/        # Header, Footer, SkipLink
│   ├── sections/      # page sections (Hero, Stats, Quote, …)
│   └── ui/            # buttons, cards, dividers
├── islands/           # Preact components hydrated client-side
├── lib/               # cloudinary, recaptcha, sanitize, csrf, gallery-assets
├── styles/            # tokens.css, global.css
└── types/             # shared TS types
```

## Apps Script webhook

Volunteer form submissions are POSTed (server-side, from `/api/volunteer-submit`)
to a Google Apps Script Web App that appends a row to the Sheet. See
`docs/apps-script-setup.md` for the script source and deployment steps.
