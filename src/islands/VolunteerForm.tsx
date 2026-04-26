import { useEffect, useRef, useState } from 'preact/hooks';
import type { VolunteerFormData, ApiResponse } from '~/types';
import { isEmail, isPhone } from '~/lib/validation';
import { executeRecaptcha } from '~/lib/recaptcha-client';
import { sendEmail, TEMPLATES } from '~/lib/emailjs-client';
import { useTranslations, t as fmt, type Lang } from '~/i18n';

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

interface Props {
  lang?: Lang;
}

export default function VolunteerForm({ lang = 'en' }: Props) {
  const strings = useTranslations(lang).forms.volunteer;

  const [data, setData] = useState<VolunteerFormData>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const additionalRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea for additionalNames
  useEffect(() => {
    const ta = additionalRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, 320)}px`;
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
    if (!data.name.trim()) e.name = strings.vNameRequired;
    if (!data.email.trim()) e.email = strings.vEmailRequired;
    else if (!isEmail(data.email)) e.email = strings.vEmailInvalid;
    if (!data.phone.trim()) e.phone = strings.vPhoneRequired;
    else if (!isPhone(data.phone)) e.phone = strings.vPhoneInvalid;
    if (!data.delivery) e.delivery = strings.vDeliveryRequired;
    return e;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (submitting) return;

    if (data.honeypot) {
      setData({ ...empty });
      setToast({ type: 'success', message: strings.successMsg });
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
      setToast({ type: 'success', message: strings.successMsg });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setToast({ type: 'error', message: fmt(strings.errorFail, { msg }) });
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
    if (!toast) return;
    if (liveRef.current) liveRef.current.textContent = toast.message;
    const timer = setTimeout(() => setToast(null), 8000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <form class="volunteer-form" onSubmit={handleSubmit} noValidate>
      <div class="volunteer-form__row">
        <div class="field">
          <label class="field__label" for="vol-name">
            {strings.labelName} <span class="required" aria-hidden="true">*</span>
            <span class="sr-only">{strings.required}</span>
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
            {strings.labelEmail} <span class="required" aria-hidden="true">*</span>
            <span class="sr-only">{strings.required}</span>
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
          {strings.labelPhone} <span class="required" aria-hidden="true">*</span>
          <span class="sr-only">{strings.required}</span>
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
        <p class="field__hint" id="vol-phone-hint">{strings.phoneHint}</p>
        {errors.phone && <p class="field__error" id="vol-phone-err">{errors.phone}</p>}
      </div>

      <div class="field">
        <label class="field__label" for="vol-additional">
          {strings.labelAdditional}
          <span class="field__hint" style={{ marginInlineStart: 6 }}>
            {strings.optional}
          </span>
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
        <p class="field__hint" id="vol-additional-hint">{strings.additionalHint}</p>
      </div>

      <div class="field">
        <label class="field__label" for="vol-delivery">
          {strings.labelDelivery} <span class="required" aria-hidden="true">*</span>
          <span class="sr-only">{strings.required}</span>
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
          <option value="">{strings.deliveryPlaceholder}</option>
          <option value="Yes">{strings.deliveryYes}</option>
          <option value="No">{strings.deliveryNo}</option>
          <option value="Maybe">{strings.deliveryMaybe}</option>
        </select>
        <p class="field__hint" id="vol-delivery-hint">{strings.deliveryHint}</p>
        {errors.delivery && <p class="field__error" id="vol-delivery-err">{errors.delivery}</p>}
      </div>

      <div class="field">
        <label class="field__label" for="vol-comments">
          {strings.labelComments}
          <span class="field__hint" style={{ marginInlineStart: 6 }}>
            {strings.optional}
          </span>
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
        <p class="field__hint" id="vol-comments-hint">{strings.commentsHint}</p>
      </div>

      <div class="honeypot" aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name="honeypot" tabIndex={-1} autocomplete="off" value={data.honeypot} onInput={update('honeypot')} />
        </label>
      </div>

      <div class="volunteer-form__actions">
        <button type="submit" class="btn btn--primary btn--lg" disabled={submitting}>
          {submitting ? strings.submitting : strings.submitButton}
        </button>
        <p class="volunteer-form__legal">
          {strings.legal}{' '}
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
            aria-label={strings.dismiss}
          >
            {strings.dismiss}
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
