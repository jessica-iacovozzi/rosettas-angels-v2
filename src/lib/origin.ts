// Origin allow-list per spec.

const ALLOWED = new Set([
  'https://www.rosettasangels.org',
  'https://rosettasangels.org',
  // Local dev (Astro default port)
  'http://localhost:4321',
  'http://127.0.0.1:4321',
]);

export function isAllowedOrigin(origin: string | null | undefined): boolean {
  if (!origin) return false;
  return ALLOWED.has(origin.replace(/\/$/, ''));
}
