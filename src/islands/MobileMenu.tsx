import { useEffect, useRef, useState } from 'preact/hooks';
import type { Lang } from '~/i18n';

interface NavItem {
  label: string;
  href: string;
}

interface Props {
  items: NavItem[];
  currentPath: string;
  donateHref: string;
  donateLabel: string;
  lang: Lang;
  altHref: string;
}

/**
 * Mobile slide-in nav. Trapped focus, Esc closes, body-scroll lock.
 * Trigger button is rendered here so it lives next to the panel and can
 * coordinate aria-controls / aria-expanded without prop drilling.
 */
export default function MobileMenu({ items, currentPath, donateHref, donateLabel, lang, altHref }: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const openLabel  = lang === 'fr' ? 'Ouvrir le menu' : 'Open menu';
  const closeLabel = lang === 'fr' ? 'Fermer le menu' : 'Close menu';
  const siteNavLabel    = lang === 'fr' ? 'Navigation du site' : 'Site navigation';
  const mobilePrimLabel = lang === 'fr' ? 'Navigation mobile principale' : 'Mobile primary';

  // Alternate locale link shown in mobile panel
  const altLang  = lang === 'fr' ? 'en' : 'fr';
  const altLabel = lang === 'fr' ? 'English' : 'Français';

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
      if (e.key === 'Tab' && panelRef.current) {
        // Simple focus trap
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
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

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        class={`mobile-menu__trigger${open ? ' is-open' : ''}`}
        aria-controls="mobile-menu-panel"
        aria-expanded={open}
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          aria-hidden="true"
          focusable="false"
        >
          {open ? (
            <g stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
              <line x1="6" y1="6" x2="22" y2="22" />
              <line x1="22" y1="6" x2="6" y2="22" />
            </g>
          ) : (
            <g stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
              <line x1="4" y1="9" x2="24" y2="9" />
              <line x1="4" y1="14" x2="24" y2="14" />
              <line x1="4" y1="19" x2="24" y2="19" />
            </g>
          )}
        </svg>
      </button>

      {open && (
        <div
          class="mobile-menu__overlay"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        id="mobile-menu-panel"
        ref={panelRef}
        class={`mobile-menu__panel ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={siteNavLabel}
        data-theme="dark"
        tabIndex={-1}
      >
        <nav aria-label={mobilePrimLabel}>
          <ul class="mobile-menu__list">
            {items.map((item, idx) => {
              const active =
                item.href === '/' || item.href === '/fr/'
                  ? currentPath === item.href
                  : currentPath.startsWith(item.href);
              return (
                <li>
                  <a
                    ref={idx === 0 ? firstLinkRef : undefined}
                    href={item.href}
                    class={`mobile-menu__link ${active ? 'is-active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <a class="btn btn--primary btn--lg mobile-menu__cta" href={donateHref}>
          {donateLabel}
        </a>
        <a class="mobile-menu__lang" href={altHref} hreflang={altLang}>
          {altLabel}
        </a>
      </div>
    </>
  );
}
