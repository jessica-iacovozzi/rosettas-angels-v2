// Server-side gate for the contact form. Verifies origin, honeypot, and
// reCAPTCHA before telling the client it's OK to send via EmailJS.
// EmailJS itself remains client-side (it's designed that way), but this
// endpoint ensures bots can't trigger sends without passing reCAPTCHA.

import type { APIRoute } from 'astro';
import type { ApiResponse } from '~/types';
import { isAllowedOrigin } from '~/lib/origin';
import { verifyRecaptcha } from '~/lib/recaptcha';
import { validateField } from '~/lib/validation';

export const prerender = false;

function json(body: ApiResponse, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  // --- Content-Type ---
  const ct = request.headers.get('content-type') ?? '';
  if (!ct.includes('application/json')) {
    return json({ ok: false, message: 'Invalid content type.', errorCode: 'bad_content_type' }, 415);
  }

  // --- Origin ---
  const origin = request.headers.get('origin');
  if (!isAllowedOrigin(origin)) {
    return json({ ok: false, message: 'Request not allowed.', errorCode: 'bad_origin' }, 403);
  }

  // --- Parse body ---
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, message: 'Invalid JSON body.', errorCode: 'bad_json' }, 400);
  }

  // --- Honeypot ---
  if (body.honeypot) {
    return json({ ok: true, message: 'Message sent successfully!' });
  }

  // --- Validate ---
  const validationErrors: string[] = [];
  const nameErr = validateField(String(body.name ?? ''), 'Name', { required: true, maxLength: 50 });
  if (nameErr) validationErrors.push(nameErr);
  const emailErr = validateField(String(body.email ?? ''), 'Email', { required: true, type: 'email' });
  if (emailErr) validationErrors.push(emailErr);
  if (body.phone) {
    const phoneErr = validateField(String(body.phone), 'Phone', { type: 'phone', minLength: 10, maxLength: 20 });
    if (phoneErr) validationErrors.push(phoneErr);
  }
  const subjectErr = validateField(String(body.subject ?? ''), 'Subject', { required: true });
  if (subjectErr) validationErrors.push(subjectErr);
  const messageErr = validateField(String(body.message ?? ''), 'Message', { required: true });
  if (messageErr) validationErrors.push(messageErr);
  if (validationErrors.length > 0) {
    return json({ ok: false, message: validationErrors[0], errorCode: 'validation_error' }, 422);
  }

  // --- reCAPTCHA ---
  const remoteIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const recaptcha = await verifyRecaptcha(
    String(body.recaptcha_token ?? ''),
    'contact_submit',
    remoteIp,
  );
  if (!recaptcha.ok) {
    return json(
      { ok: false, message: 'Spam check failed. Please try again.', errorCode: `recaptcha_${recaptcha.reason}` },
      403,
    );
  }

  return json({ ok: true, message: 'Verified. OK to send.' });
};
