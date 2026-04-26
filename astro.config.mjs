// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || 'https://www.rosettasangels.org',
  output: 'static',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
  },

  integrations: [preact(), sitemap()],
  adapter: vercel(),

  image: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
    domains: ['res.cloudinary.com'],
  },

  vite: {
    server: {
      headers: {
        // Loosened in dev so the Donorbox/reCAPTCHA scripts and Google fonts load.
        'Content-Security-Policy':
          "default-src 'self'; " +
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://donorbox.org https://www.google.com https://www.gstatic.com https://cdn.emailjs.com; " +
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
          "font-src 'self' https://fonts.gstatic.com data:; " +
          "img-src 'self' data: blob: https:; " +
          "media-src 'self' blob: https://res.cloudinary.com; " +
          "frame-src https://donorbox.org https://www.google.com; " +
          "connect-src 'self' https://donorbox.org https://api.emailjs.com https://www.google.com https://script.google.com https://script.googleusercontent.com;",
      },
    },
  },
});
