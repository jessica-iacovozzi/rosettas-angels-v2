import { useEffect, useRef, useState } from 'preact/hooks';
import type { VolunteerFormData, ApiResponse } from '~/types';
import { validateField } from '~/lib/validation';
import { executeRecaptcha } from '~/lib/recaptcha-client';
import { sendEmail, TEMPLATES } from '~/lib/emailjs-client';

const empty: VolunteerFormData = {
  name: '',
  email: '',
  phone: '',
  additionalNames: '',
  delivery: '',
  comments: '',
  honeypot: '',
};

type Errors = Partial<Record<keyof VolunteerFormData, string>>;

function isoToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function VolunteerForm() {
  const [data, setData] = useState<VolunteerFormData>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const additionalRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea for additionalNames
  useEffect(() => {
    const t = additionalRef.current;
    if (!t) return;
    t.style.height = 'auto';
    t.style.height = `${Math.min(t.scrollHeight, 320)}px`;
  }, [data.additionalNames]);

  const update =
    <K extends keyof VolunteerFormData>(k: K) =>
    (e: Event) => {
      const v = (e.currentTarget as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).value;
      setData((d) => ({ ...d, [k]: v as VolunteerFormData[K] }));
      if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
    };

  function validate(): Errors {
    const e: Errors = {};
    e.name = validateField(data.name, 'Name', { required: true, maxLength: 80 }) ?? undefined;
    e.email = validateField(data.email, 'Email', { required: true, type: 'email' }) ?? undefined;
    e.phone = validateField(data.phone, 'Phone', { required: true, type: 'phone', minLength: 10, maxLength: 20 }) ?? undefined;
    if (!data.delivery) e.delivery = 'Please select an answer';
    Object.keys(e).forEach((k) => {
      if (!e[k as keyof Errors]) delete e[k as keyof Errors];
    });
    return e;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (submitting) return;

    if (data.honeypot) {
      // Silent fake-success per spec
      setData({ ...empty });
      setToast({ type: 'success', message: 'Application submitted successfully! We will contact you soon.' });
      return;
    }

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0];
      document.getElementById(`vol-${first}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const token = await executeRecaptcha('volunteer_submit').catch(() => '');

      // 1) EmailJS — notification email
      await sendEmail({
        templateId: TEMPLATES.volunteer,
        params: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: 'RSVP: Volunteering',
          message: data.comments,
          additional_names: data.additionalNames,
          delivery: data.delivery,
        },
      });

      // 2) Apps Script webhook (via our own server proxy so the script's
      //    shared secret never appears in the bundle).
      const res = await fetch('/api/volunteer-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Name: data.name,
          Email: data.email,
          Phone: data.phone,
          'Additional Names': data.additionalNames,
          Delivery: data.delivery,
          Comments: data.comments,
          'Date added': isoToday(),
          recaptcha_token: token,
        }),
      });
      const json = (await res.json()) as ApiResponse;
      if (!res.ok || !json.ok) {
        throw new Error(json.message || `Server returned ${res.status}`);
      }

      setData({ ...empty });
      setToast({ type: 'success', message: 'Application submitted successfully! We will contact you soon.' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setToast({ type: 'error', message: `Failed to submit application. Please try again later. (${msg})` });
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (!toast) return;
    if (liveRef.current) liveRef.current.textContent = toast.message;
    const t = setTimeout(() => setToast(null), 8000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <form class="volunteer-form" onSubmit={handleSubmit} noValidate>
      <div class="volunteer-form__row">
        <div class="field">
          <label class="field__label" for="vol-name">
            Name <span class="required" aria-hidden="true">*</span><span class="sr-only">required</span>
          </label>
          <input
            id="vol-name"
            class="field__control"
            type="text"
            name="name"
            value={data.name}
            maxLength={80}
            required
            autocomplete="name"
            aria-invalid={errors.name ? 'true' : undefined}
            aria-describedby={errors.name ? 'vol-name-err' : undefined}
            onInput={update('name')}
          />
          {errors.name && <p class="field__error" id="vol-name-err">{errors.name}</p>}
        </div>

        <div class="field">
          <label class="field__label" for="vol-email">
            Email <span class="required" aria-hidden="true">*</span><span class="sr-only">required</span>
          </label>
          <input
            id="vol-email"
            class="field__control"
            type="email"
            name="email"
            value={data.email}
            required
            autocomplete="email"
            aria-invalid={errors.email ? 'true' : undefined}
            aria-describedby={errors.email ? 'vol-email-err' : undefined}
            onInput={update('email')}
          />
          {errors.email && <p class="field__error" id="vol-email-err">{errors.email}</p>}
        </div>
      </div>

      <div class="field">
        <label class="field__label" for="vol-phone">
          Phone <span class="required" aria-hidden="true">*</span><span class="sr-only">required</span>
        </label>
        <input
          id="vol-phone"
          class="field__control"
          type="tel"
          name="phone"
          value={data.phone}
          minLength={10}
          maxLength={20}
          required
          autocomplete="tel"
          aria-invalid={errors.phone ? 'true' : undefined}
          aria-describedby={errors.phone ? 'vol-phone-err' : 'vol-phone-hint'}
          onInput={update('phone')}
        />
        <p class="field__hint" id="vol-phone-hint">We'll only use your phone for time-sensitive coordination on event day.</p>
        {errors.phone && <p class="field__error" id="vol-phone-err">{errors.phone}</p>}
      </div>

      <div class="field">
        <label class="field__label" for="vol-additional">
          Names of additional volunteers
          <span class="field__hint" style={{ marginInlineStart: 6 }}>(optional)</span>
        </label>
        <textarea
          id="vol-additional"
          ref={additionalRef}
          class="field__control"
          name="additionalNames"
          rows={2}
          value={data.additionalNames}
          aria-describedby="vol-additional-hint"
          onInput={update('additionalNames')}
        />
        <p class="field__hint" id="vol-additional-hint">
          If you are volunteering with others, please have them complete the form
          or list their names here.
        </p>
      </div>

      <div class="field">
        <label class="field__label" for="vol-delivery">
          Would you like to deliver? <span class="required" aria-hidden="true">*</span><span class="sr-only">required</span>
        </label>
        <select
          id="vol-delivery"
          class="field__control"
          name="delivery"
          value={data.delivery}
          required
          aria-invalid={errors.delivery ? 'true' : undefined}
          aria-describedby={errors.delivery ? 'vol-delivery-err' : 'vol-delivery-hint'}
          onChange={update('delivery')}
        >
          <option value="">Select an answer</option>
          <option value="Yes">Yes, please!</option>
          <option value="No">No, I won't be able to.</option>
          <option value="Maybe">Maybe, I'll let you know.</option>
        </select>
        <p class="field__hint" id="vol-delivery-hint">
          Delivery is our most popular task. If you choose to deliver, you'll be
          briefed on our protocol about an hour before the event.
        </p>
        {errors.delivery && <p class="field__error" id="vol-delivery-err">{errors.delivery}</p>}
      </div>

      <div class="field">
        <label class="field__label" for="vol-comments">
          Comments
          <span class="field__hint" style={{ marginInlineStart: 6 }}>(optional)</span>
        </label>
        <textarea
          id="vol-comments"
          class="field__control"
          name="comments"
          rows={4}
          value={data.comments}
          aria-describedby="vol-comments-hint"
          onInput={update('comments')}
        />
        <p class="field__hint" id="vol-comments-hint">
          Feel free to share any additional information or questions you may have.
        </p>
      </div>

      <div class="honeypot" aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name="honeypot" tabIndex={-1} autocomplete="off" value={data.honeypot} onInput={update('honeypot')} />
        </label>
      </div>

      <div class="volunteer-form__actions">
        <button type="submit" class="btn btn--primary btn--lg" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit Application'}
        </button>
        <p class="volunteer-form__legal">
          Protected by reCAPTCHA. Questions?{' '}
          <a href="mailto:info@rosettasangels.org">info@rosettasangels.org</a>
        </p>
      </div>

      <div ref={liveRef} class="sr-only" role="status" aria-live="polite" />

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
        .volunteer-form { display: flex; flex-direction: column; gap: 0; }
        .volunteer-form__row {
          display: grid;
          gap: var(--space-4);
          grid-template-columns: 1fr;
        }
        @media (min-width: 640px) { .volunteer-form__row { grid-template-columns: 1fr 1fr; } }
        .volunteer-form__actions {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: var(--space-3);
          margin-block-start: var(--space-4);
        }
        .volunteer-form__legal {
          font-size: var(--fs-xs);
          color: var(--color-ink-muted);
        }
      `}</style>
    </form>
  );
}
