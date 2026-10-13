import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { homeSection, servicePath } from '../paths';
import { servicePages } from '../servicePages';

/** Desktop "Our Services" dropdown: opens on hover or click, closes on Escape or outside click. */
export function ServicesMenu() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        wrapRef.current?.querySelector('button')?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const openNow = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 160);
  };

  return (
    <div
      ref={wrapRef}
      className={`services-menu ${open ? 'is-open' : ''}`}
      onPointerEnter={(event) => event.pointerType === 'mouse' && openNow()}
      onPointerLeave={(event) => event.pointerType === 'mouse' && closeSoon()}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget as Node) && setOpen(false)}
    >
      <button type="button" className="services-menu-trigger" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen(!open)}>
        Our Services<ChevronDown size={13} strokeWidth={1.6} aria-hidden="true" />
      </button>
      <div id={panelId} className="services-menu-panel" hidden={!open}>
        <ul>
          {servicePages.map((page) => (
            <li key={page.slug}>
              <a href={servicePath(page.slug)}>
                <span className="services-menu-name">{page.name}</span>
                <span className="services-menu-blurb">{page.blurb}</span>
              </a>
            </li>
          ))}
        </ul>
        <a className="services-menu-all" href={homeSection('services')} onClick={() => setOpen(false)}>
          View all services<ArrowRight size={13} strokeWidth={1.5} />
        </a>
      </div>
    </div>
  );
}

/** Mobile menu version: "Our Services" expands in place to list the service pages. */
export function MobileServicesMenu({ onNavigate }: { onNavigate: () => void }) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  return (
    <div className="mobile-services">
      <button type="button" className="mobile-services-trigger" aria-expanded={open} aria-controls={listId} onClick={() => setOpen(!open)}>
        Our Services<ChevronDown size={20} strokeWidth={1.4} aria-hidden="true" />
      </button>
      <ul id={listId} hidden={!open}>
        {servicePages.map((page) => (
          <li key={page.slug}>
            <a href={servicePath(page.slug)} onClick={onNavigate}>{page.name}</a>
          </li>
        ))}
        <li><a href={homeSection('services')} onClick={onNavigate}>View all services</a></li>
      </ul>
    </div>
  );
}
