// Server-side proxy for volunteer form → Google Sheets (Apps Script webhook).
// Keeps the shared secret out of the client bundle.

import type { APIRoute } from 'astro';
import type { ApiResponse } from '~/types';
import { isAllowedOrigin } from '~/lib/origin';
import { verifyRecaptcha } from '~/lib/recaptcha';
import { sanitize } from '~/lib/sanitize';
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
    // Silent fake-success so the bot doesn't know it was caught.
    return json({ ok: true, message: 'Application submitted successfully!' });
  }

  // --- reCAPTCHA ---
  const remoteIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const recaptcha = await verifyRecaptcha(
    String(body.recaptcha_token ?? ''),
    'volunteer_submit',
    remoteIp,
  );
  if (!recaptcha.ok) {
    return json(
      { ok: false, message: 'Spam check failed. Please try again.', errorCode: `recaptcha_${recaptcha.reason}` },
      403,
    );
  }

  // --- Validate ---
  const validationErrors: string[] = [];
  const nameErr = validateField(String(body.Name ?? ''), 'Name', { required: true, maxLength: 80 });
  if (nameErr) validationErrors.push(nameErr);
  const emailErr = validateField(String(body.Email ?? ''), 'Email', { required: true, type: 'email' });
  if (emailErr) validationErrors.push(emailErr);
  const phoneErr = validateField(String(body.Phone ?? ''), 'Phone', { required: true, type: 'phone', minLength: 10, maxLength: 20 });
  if (phoneErr) validationErrors.push(phoneErr);
  const delivery = String(body.Delivery ?? '');
  if (!['Yes', 'No', 'Maybe'].includes(delivery)) validationErrors.push('Please select a valid delivery option');
  if (validationErrors.length > 0) {
    return json({ ok: false, message: validationErrors[0], errorCode: 'validation_error' }, 422);
  }

  // --- Sanitize ---
  const payload = {
    Name: sanitize(body.Name),
    Email: sanitize(body.Email),
    Phone: sanitize(body.Phone),
    'Additional Names': sanitize(body['Additional Names']),
    Delivery: sanitize(body.Delivery),
    Comments: sanitize(body.Comments),
    'Date added': sanitize(body['Date added']),
  };

  // --- Forward to Apps Script ---
  const webhookUrl = process.env.GSHEETS_WEBHOOK_URL;
  const sharedSecret = process.env.GSHEETS_SHARED_SECRET;
  if (!webhookUrl || !sharedSecret) {
    return json({ ok: false, message: 'Server misconfiguration.', errorCode: 'missing_env' }, 500);
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shared-Secret': sharedSecret,
      },
      body: JSON.stringify(payload),
    });

    if (!upstream.ok) {
      return json(
        { ok: false, message: 'Could not save your application. Please try again later.', errorCode: `upstream_${upstream.status}` },
        502,
      );
    }

    return json({ ok: true, message: 'Application submitted successfully!' });
  } catch {
    return json(
      { ok: false, message: 'Could not reach the server. Please try again later.', errorCode: 'upstream_network' },
      502,
    );
  }
};
