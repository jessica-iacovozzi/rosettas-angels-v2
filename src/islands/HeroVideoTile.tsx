import { useEffect, useRef, useState } from 'preact/hooks';

interface Props {
  /** Full-quality featured video URL (Cloudinary) */
  videoUrl: string;
  /** Poster image (Cloudinary frame extract) */
  posterUrl: string;
  /** Optional caption shown to assistive tech */
  label?: string;
}

/**
 * Picture-in-picture-style video tile sitting in the hero's bottom-right.
 * - Click/Enter opens a modal with the playable video (muted off, controls on).
 * - The tile itself shows a still poster + play badge + duration label.
 * - Modal: focus trap, ESC closes, body scroll lock, click-outside closes.
 */
export default function HeroVideoTile({
  videoUrl,
  posterUrl,
  label = "Watch the Rosetta's Angels story",
}: Props) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtnRef.current?.focus();
    // Auto-play the modal video (with sound) once opened
    videoRef.current?.play().catch(() => {/* user-gesture required — show controls */});

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        close();
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], video, input, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
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
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  function close() {
    videoRef.current?.pause();
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        class="hero-tile"
        onClick={() => setOpen(true)}
        aria-label={label}
      >
        <img src={posterUrl} alt="" loading="lazy" decoding="async" />
        <span class="hero-tile__badge" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M5 3 L19 11 L5 19 Z" fill="currentColor" />
          </svg>
        </span>
        <span class="hero-tile__caption">Watch our story</span>
      </button>

      {open && (
        <div
          class="video-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Story video"
          ref={dialogRef}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div class="video-modal__panel">
            <button
              ref={closeBtnRef}
              type="button"
              class="video-modal__close"
              aria-label="Close video"
              onClick={close}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <g stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
                  <line x1="4" y1="4" x2="16" y2="16" />
                  <line x1="16" y1="4" x2="4" y2="16" />
                </g>
              </svg>
            </button>
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterUrl}
              controls
              playsInline
              preload="metadata"
            >
              <track kind="captions" srcLang="en" label="English" />
              Sorry, your browser does not support embedded videos.
            </video>
          </div>
        </div>
      )}
    </>
  );
}
