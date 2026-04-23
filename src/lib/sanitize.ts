// Server-side sanitizer for free-text form fields. Strips HTML tags then
// entity-encodes the surviving characters, matching the spec.

const HTML_TAG = /<[^>]*>/g;
const ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
};

export function sanitize(value: unknown): string {
  if (typeof value !== 'string') return '';
  const stripped = value.replace(HTML_TAG, '');
  return stripped.replace(/[&<>"'/]/g, (ch) => ENTITY_MAP[ch] ?? ch);
}
