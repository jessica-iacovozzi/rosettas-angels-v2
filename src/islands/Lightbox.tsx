import { useEffect, useRef, useState } from 'preact/hooks';
import type { ResolvedGalleryAsset } from '~/types';

interface Props {
  assets: ResolvedGalleryAsset[];
}

/**
 * Gallery lightbox. Trigger thumbnails are rendered server-side (Astro);
 * this island only mounts the modal & event listeners. Thumbnails carry a
 * `data-lightbox-index` attribute and a shared class `js-lightbox-trigger`.
 */
export default function Lightbox({ assets }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [imgLoaded, setImgLoaded] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const savedHeightRef = useRef<number>(0);

  /** Capture current media height then navigate to a new index with a fade transition. */
  function captureAndGo(updater: (i: number) => number) {
    if (mediaRef.current) {
      const h = mediaRef.current.offsetHeight;
      if (h > 0) savedHeightRef.current = h;
    }
    setImgLoaded(false);
    setOpenIndex((i) => (i == null ? 0 : updater(i)));
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const trigger = (e.target as HTMLElement).closest<HTMLElement>(
        '.js-lightbox-trigger'
      );
      if (!trigger) return;
      e.preventDefault();
      const idx = Number(trigger.dataset.lightboxIndex);
      if (Number.isNaN(idx)) return;
      lastTriggerRef.current = trigger;
      savedHeightRef.current = 0; // fresh open — no saved height
      setImgLoaded(true);
      setOpenIndex(idx);
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  useEffect(() => {
    if (openIndex == null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();

    function close() {
      setOpenIndex(null);
      lastTriggerRef.current?.focus();
    }
    function next() {
      captureAndGo((i) => (i + 1) % assets.length);
    }
    function prevImg() {
      captureAndGo((i) => (i - 1 + assets.length) % assets.length);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prevImg();
      else if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], video, [tabindex]:not([tabindex="-1"])'
        );
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [openIndex, assets.length]);

  if (openIndex == null) return null;
  const a = assets[openIndex];

  return (
    <div
      class="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={a.alt}
      ref={dialogRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setOpenIndex(null);
          lastTriggerRef.current?.focus();
        }
      }}
    >
      <div class="lightbox__panel">
        <button
          ref={closeBtnRef}
          type="button"
          class="lightbox__btn lightbox__btn--close"
          aria-label="Close gallery"
          onClick={() => {
            setOpenIndex(null);
            lastTriggerRef.current?.focus();
          }}
        >
          <CloseIcon />
        </button>

        <button
          type="button"
          class="lightbox__btn lightbox__btn--prev"
          aria-label="Previous item"
          onClick={() => captureAndGo((i) => (i - 1 + assets.length) % assets.length)}
        >
          <ChevronLeft />
        </button>

        <div
          class="lightbox__media"
          ref={mediaRef}
        >
          <div class="lightbox__media-img">
            {a.type === 'video' ? (
              <video
                src={a.url}
                poster={a.thumbnailUrl}
                controls
                autoPlay
                playsInline
                preload="metadata"
                key={a.id}
                onLoadedData={() => setImgLoaded(true)}
              >
                <track kind="captions" srcLang="en" label="English" />
                Sorry, your browser does not support embedded videos.
              </video>
            ) : (
              <img
                src={a.url}
                alt={a.alt}
                key={a.id}
                loading="eager"
                decoding="async"
                class={imgLoaded ? '' : 'is-loading'}
                onLoad={() => setImgLoaded(true)}
              />
            )}
            {!imgLoaded && (
              <div class="lightbox__spinner" aria-hidden="true">
                <SpinnerIcon />
              </div>
            )}
          </div>
          <p class="lightbox__caption">
            <span class="sr-only">Caption: </span>
            {a.alt}
            <span class="lightbox__index" aria-hidden="true">
              {openIndex + 1} / {assets.length}
            </span>
          </p>
        </div>

        <button
          type="button"
          class="lightbox__btn lightbox__btn--next"
          aria-label="Next item"
          onClick={() => captureAndGo((i) => (i + 1) % assets.length)}
        >
          <ChevronRight />
        </button>
      </div>

      <style>{`
        .lightbox {
          position: fixed;
          inset: 0;
          background: rgba(14,33,23,0.92);
          z-index: var(--z-modal);
          display: grid;
          place-items: center;
          padding: var(--space-16);
        }
        .lightbox__panel {
          position: relative;
          width: min(72rem, 100%);
          height: calc(100vh - 2 * var(--space-16));
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: var(--space-3);
        }
        .lightbox__media {
          height: 100%;
          background: #000;
          border-radius: var(--radius-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .lightbox__media-img {
          flex: 1;
          min-height: 0;
          position: relative;
          overflow: hidden;
          background: #000;
        }
        .lightbox__media img,
        .lightbox__media video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: opacity 200ms ease;
        }
        .lightbox__media img.is-loading {
          opacity: 0;
        }
        .lightbox__spinner {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-amber);
          pointer-events: none;
        }
        .lightbox__spinner svg {
          width: 40px;
          height: 40px;
          animation: lightbox-spin 0.8s linear infinite;
        }
        @keyframes lightbox-spin {
          to { transform: rotate(360deg); }
        }
        .lightbox__caption {
          background: var(--color-evergreen);
          color: var(--color-cream);
          font-size: var(--fs-sm);
          padding: var(--space-3) var(--space-4);
          display: flex;
          gap: var(--space-4);
          justify-content: space-between;
          align-items: center;
        }
        .lightbox__index {
          font-family: var(--font-display);
          font-weight: 700;
          color: var(--color-amber);
          letter-spacing: var(--tracking-wide);
        }
        .lightbox__btn {
          background: rgba(14,33,23,0.85);
          color: var(--color-cream);
          width: 48px;
          height: 48px;
          border-radius: var(--radius-pill);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .lightbox__btn:hover { background: var(--color-amber); color: var(--color-evergreen-900); }
        .lightbox__btn--close {
          position: absolute;
          top: -56px;
          right: 0;
        }
        @media (max-width: 767px) {
          .lightbox { padding: var(--space-2); }
          .lightbox__panel { grid-template-columns: 1fr; }
          .lightbox__btn--prev, .lightbox__btn--next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1;
          }
          .lightbox__btn--prev { left: 8px; }
          .lightbox__btn--next { right: 8px; }
        }
      `}</style>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <g stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
        <line x1="4" y1="4" x2="16" y2="16" />
        <line x1="16" y1="4" x2="4" y2="16" />
      </g>
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <polyline points="13 4 6 10 13 16" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <polyline points="7 4 14 10 7 16" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}
function SpinnerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="44 16" />
    </svg>
  );
}
