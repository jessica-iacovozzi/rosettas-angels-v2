/** Event date config — drives volunteer-form availability UI per spec. */
export const EVENT_DATES = ['2025-12-06'] as const;

export const isSingleDayEvent = EVENT_DATES.length <= 1;

export function formatEventDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`); // anchor at noon to avoid TZ flips
  return d.toLocaleDateString('en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
