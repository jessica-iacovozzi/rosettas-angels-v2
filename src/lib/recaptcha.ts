// Server-side reCAPTCHA v3 verification.

const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const MIN_SCORE = 0.5;

export interface RecaptchaResult {
  ok: boolean;
  score?: number;
  action?: string;
  reason?: string;
}

export async function verifyRecaptcha(
  token: string,
  expectedAction: string,
  remoteIp?: string,
): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return { ok: false, reason: 'recaptcha_not_configured' };
  }
  if (!token) return { ok: false, reason: 'missing_token' };

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  let res: Response;
  try {
    res = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
  } catch {
    return { ok: false, reason: 'network_error' };
  }

  if (!res.ok) return { ok: false, reason: `http_${res.status}` };

  const json = (await res.json()) as {
    success: boolean;
    score?: number;
    action?: string;
    'error-codes'?: string[];
  };

  if (!json.success)
    return { ok: false, reason: (json['error-codes'] || []).join(',') };
  if (json.action && json.action !== expectedAction)
    return {
      ok: false,
      score: json.score,
      action: json.action,
      reason: 'action_mismatch',
    };
  if (typeof json.score === 'number' && json.score < MIN_SCORE)
    return {
      ok: false,
      score: json.score,
      action: json.action,
      reason: 'low_score',
    };

  return { ok: true, score: json.score, action: json.action };
}
