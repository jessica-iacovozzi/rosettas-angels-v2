// Pure validation rules. Used both client-side (Preact form) and server-side
// (API route) so the rule set can't drift between layers.

// RFC 5322-compatible (simplified); matches spec.
export const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// North American leaning phone; matches spec.
export const PHONE_RE =
  /^(\+?1[-\s]?)?(\(?[0-9]{3}\)?[-\s]?)?[0-9]{3}[-\s]?[0-9]{4}$/;

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

export function isPhone(value: string): boolean {
  return PHONE_RE.test(value.trim());
}

export interface FieldRule {
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  type?: 'email' | 'phone' | 'text';
}

export function validateField(
  value: string,
  label: string,
  rule: FieldRule,
): string | null {
  const v = value.trim();
  if (rule.required && !v) return `${label} is required`;
  if (!v) return null; // optional + empty = ok
  if (rule.maxLength != null && v.length > rule.maxLength)
    return `${label} must be less than ${rule.maxLength} characters`;
  if (rule.minLength != null && v.length < rule.minLength)
    return `${label} must be at least ${rule.minLength} characters`;
  if (rule.type === 'email' && !isEmail(v)) return 'Please enter a valid email';
  if (rule.type === 'phone' && !isPhone(v))
    return 'Please enter a valid phone number';
  return null;
}
