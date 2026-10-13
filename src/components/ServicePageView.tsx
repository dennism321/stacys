import { ArrowRight, ArrowUpRight, Phone } from 'lucide-react';
import { studio } from '../data';
import { BASE, homeSection, servicePath } from '../paths';
import { findServicePage, type MenuItem, type ServicePage } from '../servicePages';

function MenuItemRow({ item }: { item: MenuItem }) {
  return (
    <li className="sp-item">
      <div className={`sp-item-head ${item.price ? "" : "sp-no-price"}`}>
        <h3>{item.name}</h3>
        {item.price && <span className="sp-price">{item.price}</span>}
      </div>
      {item.meta && <p className="sp-meta">{item.meta.join(' · ')}</p>}
      {item.description && <p className="sp-description">{item.description}</p>}
      {item.packages && (
        <ul className="sp-packages" aria-label={`${item.name} packages`}>
          {item.packages.map((pkg) => (
            <li key={pkg.label}>
              <span>{pkg.label}{pkg.note && <small>{pkg.note}</small>}</span>
              <span className="sp-price">{pkg.price}</span>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/** A full service page: intro, price menu, booking prompt, and related services. */
export default function ServicePageView({ page, onBook }: { page: ServicePage; onBook: () => void }) {
  const related = page.related.map(findServicePage).filter((item): item is ServicePage => Boolean(item));

  return (
    <article className="service-page" aria-labelledby="service-title">
      <section className="sp-hero">
        <div className={`page-width sp-hero-grid ${page.image ? '' : 'sp-hero-text-only'}`}>
          <div className="sp-hero-copy">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <ol>
                <li><a href={BASE}>Home</a></li>
                <li><a href={homeSection('services')}>Services</a></li>
                <li aria-current="page">{page.name}</li>
              </ol>
            </nav>
            <p className="eyebrow">STACY'S ESTHETICS · PROSPECT, CT</p>
            <h1 id="service-title">{page.h1}</h1>
            <p className="sp-tagline">{page.tagline}</p>
            {page.intro.map((paragraph) => <p className="sp-intro" key={paragraph.slice(0, 24)}>{paragraph}</p>)}
            <div className="sp-actions">
              <button type="button" className="button button-primary" onClick={onBook}>Book an appointment<ArrowUpRight size={16} strokeWidth={1.5} /></button>
              <a className="sp-call" href={studio.phoneHref}><Phone size={15} strokeWidth={1.5} />{studio.phone}</a>
            </div>
          </div>
          {page.image && (
            <div className="sp-hero-image">
              <img src={page.image.src} alt={page.image.alt} width="640" height="760" fetchPriority="high" />
            </div>
          )}
        </div>
      </section>

      <section className="sp-menu" aria-label={`${page.name} menu and prices`}>
        <div className="page-width sp-menu-inner">
          {page.groups.map((group) => (
            <section className="sp-group" key={group.title} aria-labelledby={`group-${group.title.replace(/\W+/g, '-').toLowerCase()}`}>
              <div className="sp-group-heading">
                <h2 id={`group-${group.title.replace(/\W+/g, '-').toLowerCase()}`}>{group.title}</h2>
                {group.intro && <p>{group.intro}</p>}
              </div>
              <ul className={`sp-items ${group.compact ? 'sp-items-compact' : ''}`}>
                {group.items.map((item) => <MenuItemRow key={item.name} item={item} />)}
              </ul>
            </section>
          ))}
          {page.notes && (
            <aside className="sp-notes" aria-label="Good to know">
              <p className="eyebrow">GOOD TO KNOW</p>
              {page.notes.map((note) => <p key={note}>{note}</p>)}
            </aside>
          )}
        </div>
      </section>

      <section className="sp-cta" aria-labelledby="sp-cta-title">
        <div className="page-width sp-cta-inner">
          <div>
            <p className="eyebrow">READY WHEN YOU ARE</p>
            <h2 id="sp-cta-title" className="section-title">Make time for <em>you.</em></h2>
            <p>Plan your appointment online, or call us at <a href={studio.phoneHref}>{studio.phone}</a>.</p>
            <button type="button" className="button button-primary" onClick={onBook}>Plan your visit<ArrowUpRight size={16} strokeWidth={1.5} /></button>
          </div>
          <address className="sp-visit">
            <p className="sp-visit-label">Visit us</p>
            <a href={studio.mapsHref} target="_blank" rel="noopener noreferrer">{studio.street}<br />{studio.locality}</a>
            <dl>{studio.hours.map((row) => <div key={row.days}><dt>{row.days}</dt><dd>{row.time}</dd></div>)}</dl>
          </address>
        </div>
      </section>

      {related.length > 0 && (
        <section className="sp-related section-space" aria-labelledby="sp-related-title">
          <div className="page-width">
            <h2 id="sp-related-title" className="section-title centered-title">You may also <em>love</em></h2>
            <ul className="sp-related-grid">
              {related.map((item) => (
                <li key={item.slug}>
                  <a href={servicePath(item.slug)}>
                    <span className="sp-related-name">{item.name}<ArrowRight size={18} strokeWidth={1.3} /></span>
                    <span className="sp-related-blurb">{item.tagline}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
