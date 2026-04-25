// Thin EmailJS facade. Loaded lazily so the SDK never blocks initial render.
// All keys are VITE_ — EmailJS public keys are designed to be exposed.

import emailjs from '@emailjs/browser';

let inited = false;

function ensureInit() {
  if (inited) return;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error('EmailJS not configured: missing VITE_EMAILJS_PUBLIC_KEY');
  }
  emailjs.init({ publicKey });
  inited = true;
}

export interface SendArgs {
  templateId: string;
  params: Record<string, string>;
}

export async function sendEmail({ templateId, params }: SendArgs) {
  ensureInit();
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  if (!serviceId) throw new Error('EmailJS not configured: missing VITE_EMAILJS_SERVICE_ID');
  return emailjs.send(serviceId, templateId, params);
}

export const TEMPLATES = {
  volunteer: import.meta.env.VITE_EMAILJS_VOLUNTEER_TEMPLATE_ID ?? '',
  contact: import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID ?? '',
};
