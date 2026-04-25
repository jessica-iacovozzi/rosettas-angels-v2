// Lazy-load the reCAPTCHA v3 script and expose a typed `execute` helper.
// We intentionally keep the badge visible (Google ToS) but pull it off the
// bottom-right via a small CSS rule loaded by pages that include forms.

const SCRIPT_ID = 'recaptcha-v3-script';

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(siteKey: string): Promise<void> {
  if (scriptPromise) return scriptPromise;
  if (typeof window === 'undefined') return Promise.resolve();
  scriptPromise = new Promise((resolve, reject) => {
    if (document.getElementById(SCRIPT_ID)) return resolve();
    const s = document.createElement('script');
    s.id = SCRIPT_ID;
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export async function executeRecaptcha(action: string): Promise<string> {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    // No-op token in dev when reCAPTCHA isn't configured — server will reject
    // with a clear message rather than failing silently.
    return 'dev-no-recaptcha';
  }
  await loadScript(siteKey);
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) return reject(new Error('reCAPTCHA not loaded'));
    window.grecaptcha.ready(() => {
      window
        .grecaptcha!.execute(siteKey, { action })
        .then(resolve)
        .catch(reject);
    });
  });
}
