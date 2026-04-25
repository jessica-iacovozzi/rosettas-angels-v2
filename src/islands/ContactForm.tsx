import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { ContactFormData } from '~/types';
import { validateField } from '~/lib/validation';
import { executeRecaptcha } from '~/lib/recaptcha-client';
import { sendEmail, TEMPLATES } from '~/lib/emailjs-client';

const RATE_LIMIT_MS = 30_000;
const STORAGE_KEY = 'lastEmailTime';

type Errors = Partial<Record<keyof ContactFormData, string>>;

const empty: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  honeypot: '',
};

export default function ContactForm() {
  const [data, setData] = useState<ContactFormData>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<
    { type: 'success' | 'error'; message: string } | null
  >(null);
  const liveRegion = useRef<HTMLDivElement>(null);

  const update = (k: keyof ContactFormData) => (e: Event) => {
    const v = (e.currentTarget as HTMLInputElement | HTMLTextAreaElement).value;
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  function validate(): Errors {
    const e: Errors = {};
    e.name = validateField(data.name, 'Name', { required: true, maxLength: 50 }) ?? undefined;
    e.email = validateField(data.email, 'Email', { required: true, type: 'email' }) ?? undefined;
    if (data.phone)
      e.phone = validateField(data.phone, 'Phone', { type: 'phone', minLength: 10, maxLength: 20 }) ?? undefined;
    e.subject = validateField(data.subject, 'Subject', { required: true }) ?? undefined;
    e.message = validateField(data.message, 'Message', { required: true }) ?? undefined;
    Object.keys(e).forEach((k) => {
      if (!e[k as keyof Errors]) delete e[k as keyof Errors];
    });
    return e;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (submitting) return;

    // Rate limit
    const last = Number(localStorage.getItem(STORAGE_KEY) || 0);
    const wait = RATE_LIMIT_MS - (Date.now() - last);
    if (wait > 0) {
      const seconds = Math.ceil(wait / 1000);
      setToast({ type: 'error', message: `Please wait ${seconds}s before sending another message.` });
      return;
    }

    // Honeypot — silent fake-success
    if (data.honeypot) {
      setData(empty);
      setToast({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
      return;
    }

    const e2 = validate();
    setErrors(e2);
    if (Object.keys(e2).length > 0) {
      // Focus first invalid
      const firstKey = Object.keys(e2)[0];
      document.getElementById(`contact-${firstKey}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const token = await executeRecaptcha('contact_submit').catch(() => '');

      // Verify reCAPTCHA + validate server-side before sending email
      const verifyRes = await fetch('/api/contact-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
          recaptcha_token: token,
        }),
      });
      const verifyJson = (await verifyRes.json()) as { ok: boolean; message: string };
      if (!verifyRes.ok || !verifyJson.ok) {
        throw new Error(verifyJson.message || `Server returned ${verifyRes.status}`);
      }

      // Server approved — now send via EmailJS
      await sendEmail({
        templateId: TEMPLATES.contact,
        params: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
        },
      });

      localStorage.setItem(STORAGE_KEY, String(Date.now()));
      setData({ ...empty });
      setToast({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setToast({ type: 'error', message: `Failed to send message. Please try again later. (${msg})` });
    } finally {
      setSubmitting(false);
    }
  }

  // Auto-dismiss toasts
  useEffect(() => {
    if (!toast) return;
    if (liveRegion.current) liveRegion.current.textContent = toast.message;
    const t = setTimeout(() => setToast(null), 7000);
    return () => clearTimeout(t);
  }, [toast]);

  const f = useMemo(
    () => ({
      name: { id: 'contact-name', label: 'Name', value: data.name, required: true, max: 50, type: 'text' as const, autocomplete: 'name' as const },
      email: { id: 'contact-email', label: 'Email', value: data.email, required: true, max: 80, type: 'email' as const, autocomplete: 'email' as const },
      phone: { id: 'contact-phone', label: 'Phone', value: data.phone, required: false, max: 20, type: 'tel' as const, autocomplete: 'tel' as const },
      subject: { id: 'contact-subject', label: 'Subject', value: data.subject, required: true, max: 120, type: 'text' as const, autocomplete: 'off' as const },
    }),
    [data]
  );

  return (
    <form class="contact-form" onSubmit={handleSubmit} noValidate>
      <div class="contact-form__row">
        {(['name', 'email'] as const).map((k) => (
          <div class="field" key={k}>
            <label class="field__label" for={f[k].id}>
              {f[k].label} {f[k].required && <span class="required" aria-hidden="true">*</span>}
              {f[k].required && <span class="sr-only">required</span>}
            </label>
            <input
              id={f[k].id}
              class="field__control"
              name={k}
              type={f[k].type}
              value={f[k].value}
              maxLength={f[k].max}
              required={f[k].required}
              autocomplete={f[k].autocomplete}
              aria-invalid={errors[k] ? 'true' : undefined}
              aria-describedby={errors[k] ? `${f[k].id}-err` : undefined}
              onInput={update(k)}
            />
            {errors[k] && <p class="field__error" id={`${f[k].id}-err`}>{errors[k]}</p>}
          </div>
        ))}
      </div>

      <div class="contact-form__row">
        {(['phone', 'subject'] as const).map((k) => (
          <div class="field" key={k}>
            <label class="field__label" for={f[k].id}>
              {f[k].label}
              {!f[k].required && <span class="field__hint" style={{ marginInlineStart: 6 }}>(optional)</span>}
              {f[k].required && (<><span class="required" aria-hidden="true">*</span><span class="sr-only">required</span></>)}
            </label>
            <input
              id={f[k].id}
              class="field__control"
              name={k}
              type={f[k].type}
              value={f[k].value}
              maxLength={f[k].max}
              required={f[k].required}
              autocomplete={f[k].autocomplete}
              aria-invalid={errors[k] ? 'true' : undefined}
              aria-describedby={errors[k] ? `${f[k].id}-err` : undefined}
              onInput={update(k)}
            />
            {errors[k] && <p class="field__error" id={`${f[k].id}-err`}>{errors[k]}</p>}
          </div>
        ))}
      </div>

      <div class="field">
        <label class="field__label" for="contact-message">
          Message <span class="required" aria-hidden="true">*</span>
          <span class="sr-only">required</span>
        </label>
        <textarea
          id="contact-message"
          class="field__control"
          name="message"
          rows={6}
          required
          value={data.message}
          aria-invalid={errors.message ? 'true' : undefined}
          aria-describedby={errors.message ? 'contact-message-err' : undefined}
          onInput={update('message')}
        />
        {errors.message && <p class="field__error" id="contact-message-err">{errors.message}</p>}
      </div>

      {/* Honeypot — visually & semantically hidden from real users */}
      <div class="honeypot" aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name="honeypot" tabIndex={-1} autocomplete="off" value={data.honeypot} onInput={update('honeypot')} />
        </label>
      </div>

      <div class="contact-form__actions">
        <button type="submit" class="btn btn--primary btn--lg" disabled={submitting}>
          {submitting ? 'Sending…' : 'Send Message'}
        </button>
        <p class="contact-form__legal">
          Protected by reCAPTCHA. By sending you agree to our use of your contact details to reply.
        </p>
      </div>

      <div ref={liveRegion} class="sr-only" role="status" aria-live="polite" />

      {toast && (
        <div class={`snackbar ${toast.type === 'error' ? 'snackbar--error' : ''}`} role="alert">
          <span>{toast.message}</span>
          <button
            type="button"
            class="snackbar__close"
            onClick={() => setToast(null)}
            aria-label="Dismiss notification"
          >
            Dismiss
          </button>
        </div>
      )}

      <style>{`
        .contact-form { display: flex; flex-direction: column; gap: 0; }
        .contact-form__row {
          display: grid;
          gap: var(--space-4);
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px) { .contact-form__row { grid-template-columns: 1fr 1fr; } }
        .contact-form__actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
          align-items: flex-start;
          margin-block-start: var(--space-4);
        }
        .contact-form__legal {
          font-size: var(--fs-xs);
          color: var(--color-ink-muted);
        }
      `}</style>
    </form>
  );
}
