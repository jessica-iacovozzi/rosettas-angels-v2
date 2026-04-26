import { useEffect, useRef, useState } from 'preact/hooks';

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

interface Props {
  testimonials: Testimonial[];
}

/**
 * Testimonials carousel. Spec: prev/next arrows, dot indicators, keyboard
 * arrows, side-peek on desktop (prev & next visible faded), modulo wrap.
 */
export default function TestimonialsCarousel({ testimonials }: Props) {
  const [active, setActive] = useState(0);
  const regionRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const total = testimonials.length;

  function go(delta: number) {
    setActive((i) => (i + delta + total) % total);
  }

  // Keyboard: arrows when carousel has focus inside it
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!regionRef.current) return;
      if (!regionRef.current.contains(document.activeElement)) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        go(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        go(-1);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [total]);

  useEffect(() => {
    if (liveRef.current) {
      const t = testimonials[active];
      liveRef.current.textContent = `Showing testimonial ${active + 1} of ${total}: ${t.name}, ${t.role}.`;
    }
  }, [active, total, testimonials]);

  const prevIdx = (active - 1 + total) % total;
  const nextIdx = (active + 1) % total;

  return (
    <div
      class="testimonials"
      ref={regionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Volunteer testimonials"
    >
      <div class="testimonials__viewport">
        {/* Side peek (desktop only) */}
        <article class="testimonial-card testimonial-card--side" aria-hidden="true">
          <Quote text={testimonials[prevIdx].quote} />
          <Cite name={testimonials[prevIdx].name} role={testimonials[prevIdx].role} />
        </article>

        {/* All active cards stacked so the slot height equals the tallest card */}
        <div class="testimonials__active-slot">
          {testimonials.map((t, i) => (
            <article
              key={i}
              class={`testimonial-card testimonial-card--active${i !== active ? ' testimonial-card--inactive' : ''}`}
              aria-hidden={i !== active ? 'true' : undefined}
            >
              <Quote text={t.quote} />
              <Cite name={t.name} role={t.role} />
            </article>
          ))}
        </div>

        <article class="testimonial-card testimonial-card--side" aria-hidden="true">
          <Quote text={testimonials[nextIdx].quote} />
          <Cite name={testimonials[nextIdx].name} role={testimonials[nextIdx].role} />
        </article>
      </div>

      <div class="testimonials__controls">
        <button
          type="button"
          class="testimonials__arrow"
          aria-label="Previous testimonial"
          onClick={() => go(-1)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <polyline points="14 4 6 11 14 18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <ul class="testimonials__dots" role="tablist" aria-label="Choose a testimonial">
          {testimonials.map((t, i) => (
            <li>
              <button
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`${t.name} — testimonial ${i + 1} of ${total}`}
                class={`testimonials__dot ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              />
            </li>
          ))}
        </ul>
        <button
          type="button"
          class="testimonials__arrow"
          aria-label="Next testimonial"
          onClick={() => go(1)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <polyline points="8 4 16 11 8 18" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <div ref={liveRef} class="sr-only" aria-live="polite" />

      <style>{`
        .testimonials {
          position: relative;
          padding-block: var(--space-8);
        }
        .testimonials__viewport {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-4);
          align-items: stretch;
        }
        @media (min-width: 1024px) {
          .testimonials__viewport {
            grid-template-columns: 0.7fr 1.6fr 0.7fr;
            align-items: center;
          }
        }
        .testimonial-card {
          background: var(--color-cream);
          color: var(--color-ink);
          padding: var(--space-8) var(--space-8);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .testimonial-card--side {
          display: none;
          opacity: 0.45;
          transform: scale(0.92);
          transition: opacity var(--duration-base), transform var(--duration-base);
        }
        @media (min-width: 1024px) {
          .testimonial-card--side { display: flex; }
        }
        .testimonials__active-slot {
          display: grid;
        }
        .testimonials__active-slot > * {
          grid-column: 1;
          grid-row: 1;
        }
        .testimonial-card--active {
          background: var(--color-cream);
          box-shadow: var(--shadow-md);
          border-color: var(--color-amber);
          border-width: 2px;
        }
        .testimonial-card--inactive {
          opacity: 0;
          pointer-events: none;
          user-select: none;
        }
        .testimonials__controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-4);
          margin-block-start: var(--space-6);
        }
        .testimonials__arrow {
          width: 44px; height: 44px;
          border-radius: var(--radius-pill);
          background: var(--color-evergreen);
          color: var(--color-cream);
          display: inline-flex;
          align-items: center; justify-content: center;
          transition: background-color var(--duration-fast), transform var(--duration-fast);
        }
        .testimonials__arrow:hover { background: var(--color-amber); color: var(--color-evergreen-900); }
        .testimonials__dots { list-style: none; display: flex; gap: var(--space-2); }
        .testimonials__dot {
          width: 12px; height: 12px;
          border-radius: var(--radius-pill);
          background: var(--color-border);
        }
        .testimonials__dot.is-active { background: var(--color-amber); transform: scale(1.2); }

        .testimonial-card__quote {
          font-family: var(--font-italic);
          font-style: italic;
          font-size: var(--fs-lg);
          line-height: 1.5;
          color: var(--color-evergreen);
        }
        .testimonial-card__quote::before {
          content: "\\201C";
          font-family: var(--font-display);
          color: var(--color-amber);
          font-size: 2em;
          line-height: 0.5;
          vertical-align: -0.25em;
          margin-inline-end: 0.3em;
        }
        .testimonial-card__cite {
          font-style: normal;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: var(--fs-xs);
          letter-spacing: var(--tracking-wide);
          text-transform: uppercase;
          color: var(--color-ink-muted);
        }
      `}</style>
    </div>
  );
}

function Quote({ text }: { text: string }) {
  return <p class="testimonial-card__quote">{text}</p>;
}
function Cite({ name, role }: { name: string; role: string }) {
  return (
    <cite class="testimonial-card__cite">
      <span class="testimonial-card__cite-name">{name}</span> · {role}
    </cite>
  );
}
