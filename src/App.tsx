import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUp, ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import Dialog from './components/Dialog';
import Reveal from './components/Reveal';
import ReviewsSection from './components/ReviewsSection';
import AppointmentPlanner from './components/AppointmentPlanner';
import BrandLogo from './components/BrandLogo';
import SocialLinks from './components/SocialLinks';
import { MobileServicesMenu, ServicesMenu } from './components/ServicesMenu';
import ServicePageView from './components/ServicePageView';
import SquareBooking from './components/SquareBooking';
import LangSwitch from './components/LangSwitch';
import { asset, homePath, homeSection, photoSrcSet, servicePath } from './paths';
import { localizedPages, type ServicePage } from './servicePages';
import { useLang, useT } from './i18n';
import { PolicyDetails, StudioDetails } from './components/StudioDialogs';
import { DRAFT_KEY, faqsFor, readDraft, studio, studioHours, type AppointmentDraft } from './data';

type OpenDialog =
  | { type: 'planner'; serviceId?: string }
  | { type: 'square' }
  | { type: 'policies'; tab: 'booking' | 'privacy' }
  | { type: 'studio' }
  | null;

function Botanical({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 92 116" fill="none" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M45 109c1-26 10-49 9-76M49 78C32 69 23 56 17 37M52 58C66 48 75 36 80 19M46 94C29 90 18 83 9 71" />
        <path d="M54 43C39 31 37 17 45 6c12 11 16 23 9 37ZM54 43 45 6M42 69C26 69 13 57 12 42c17 2 28 11 30 27ZM42 69 12 42M55 61c-2-17 8-34 25-42 3 17-8 34-25 42ZM55 61 80 19M49 91c1-15 14-27 30-29-2 15-14 26-30 29ZM49 91 79 62M40 94C23 96 9 85 5 71c18-1 31 7 35 23ZM40 94 5 71" />
      </g>
    </svg>
  );
}

/** One shell for every page: the home page, or a service page when `page` is set (already localized). */
export default function App({ page }: { page?: ServicePage }) {
  const lang = useLang();
  const t = useT();
  const pages = localizedPages(lang);
  const faqs = faqsFor(lang);
  const home = homePath(lang);
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  // Read on mount, not during render, so the pre-rendered HTML matches the first client render.
  const [savedDraft, setSavedDraft] = useState<AppointmentDraft | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const dialogTriggerRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const closeDialog = useCallback(() => setDialog(null), []);
  const showDialog = useCallback((next: Exclude<OpenDialog, null>) => {
    if (!dialog) dialogTriggerRef.current = document.activeElement as HTMLElement | null;
    setMenuOpen(false);
    setDialog(next);
  }, [dialog]);
  const openPlanner = useCallback((serviceId?: string) => {
    showDialog({ type: 'planner', serviceId });
  }, [showDialog]);

  const deleteDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      setSavedDraft(null);
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        document.getElementById('mobile-menu-toggle')?.focus();
      }
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (reduceMotion) heroVideoRef.current?.pause();
  }, [reduceMotion]);

  useEffect(() => {
    setSavedDraft(readDraft());
    const syncDraft = (event: StorageEvent) => {
      if (event.key === DRAFT_KEY || event.key === null) setSavedDraft(readDraft());
    };
    window.addEventListener('storage', syncDraft);
    return () => window.removeEventListener('storage', syncDraft);
  }, []);

  const heroItem = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
  // Section links point at the home page when we're on a service page.
  const section = (id: string) => (page ? homeSection(id, lang) : `#${id}`);

  return (
    <>
      <div inert={dialog ? true : undefined}>
        <a className="skip-link" href="#main">{t.skipToContent}</a>
        <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
          <div className="header-inner">
            <div className="header-side header-left">
              <button type="button" id="mobile-menu-toggle" className="menu-toggle" aria-label={menuOpen ? t.closeNav : t.openNav} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={23} strokeWidth={1.5} /> : <Menu size={23} strokeWidth={1.5} />}
              </button>
              <LangSwitch slug={page?.slug} className="lang-switch-mobile" />
              <nav className="desktop-nav" aria-label={t.mainNav}>
                <ServicesMenu />
                <a href={section('philosophy')}>{t.ourPhilosophy}</a>
                <a href={section('visit')}>{t.yourVisit}</a>
              </nav>
            </div>
            <a href={page ? home : '#home'} className="brand-pendant" onClick={() => setMenuOpen(false)}>
              <BrandLogo />
            </a>
            <div className="header-side header-right">
              <SocialLinks className="header-social" />
              <LangSwitch slug={page?.slug} className="lang-switch-desktop" />
              <button type="button" className="button button-primary header-booking" onClick={() => openPlanner()}>
                <span className="desktop-book-label">{savedDraft ? t.viewPlan : t.bookAppointment}</span>
                <span className="mobile-book-label">{savedDraft ? t.yourPlan : t.book}</span>
                <ArrowUpRight size={15} strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <AnimatePresence>
            {menuOpen && (
              <motion.nav id="mobile-navigation" className="mobile-nav" aria-label={t.mobileNav} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.25 }}>
                <MobileServicesMenu onNavigate={() => setMenuOpen(false)} />
                <a href={section('philosophy')} onClick={() => setMenuOpen(false)}>{t.ourPhilosophy}<ArrowUpRight size={18} /></a>
                <a href={section('visit')} onClick={() => setMenuOpen(false)}>{t.yourVisit}<ArrowUpRight size={18} /></a>
                <SocialLinks className="mobile-nav-social" />
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        <main id="main">
          {page ? (
            <ServicePageView page={page} onBook={() => (page.squareBooking ? showDialog({ type: 'square' }) : openPlanner(page.slug))} />
          ) : (
            <>
            <section id="home" className="hero" aria-labelledby="hero-title">
              {/* Phones get the full portrait clip; wider screens get a squarer crop shown on the right. */}
              <motion.video ref={heroVideoRef} className="hero-image hero-video" poster={asset('images/headspa2-desktop-poster.webp')} autoPlay muted loop playsInline preload="auto" aria-hidden="true" initial={{ scale: reduceMotion ? 1 : 1.045 }} animate={{ scale: 1 }} transition={{ duration: reduceMotion ? 0 : 2.2, ease: [0.22, 1, 0.36, 1] }}>
                <source media="(max-width: 767px)" src={asset('images/headspa2-phone.mp4')} type="video/mp4" />
                <source src={asset('images/headspa2-desktop.mp4')} type="video/mp4" />
              </motion.video>
              <div className="page-width hero-inner">
                <motion.div className="hero-copy" initial={reduceMotion ? 'visible' : 'hidden'} animate="visible" variants={{ visible: { transition: { staggerChildren: 0.11, delayChildren: 0.12 } } }}>
                  <motion.p className="eyebrow hero-eyebrow" variants={heroItem} transition={{ duration: 0.65 }}>{t.heroEyebrow}</motion.p>
                  <motion.h1 id="hero-title" variants={heroItem} transition={{ duration: 0.75 }}>{t.heroTitle[0]}<br /><em>{t.heroTitle[1]}</em></motion.h1>
                  <motion.p className="hero-mantra" variants={heroItem} transition={{ duration: 0.7 }}>{t.heroMantra}</motion.p>
                  <motion.p className="hero-description" variants={heroItem} transition={{ duration: 0.7 }}>{t.heroDescription[0]}<br className="desktop-break" /> {t.heroDescription[1]}</motion.p>
                  <motion.div className="hero-actions" variants={heroItem} transition={{ duration: 0.7 }}>
                    <button type="button" className="button button-primary" onClick={() => openPlanner()}>{t.bookYourMoment}<ArrowUpRight size={16} strokeWidth={1.5} /></button>
                    <a href="#services" className="hero-explore">{t.exploreTreatments}<ArrowRight size={16} strokeWidth={1.5} /></a>
                  </motion.div>
                </motion.div>
              </div>
            </section>

            <section id="services" className="services-section section-space" aria-labelledby="services-title">
              <div className="page-width">
                <Reveal className="section-heading centered">
                  <p className="eyebrow">{t.servicesEyebrow}</p>
                  <h2 id="services-title" className="section-title">{t.servicesTitle[0]} <em>{t.servicesTitle[1]}</em></h2>
                  <span className="heading-rule" aria-hidden="true" />
                </Reveal>
                <div className="services-grid">
                  {pages.map((item, index) => (
                    <Reveal key={item.slug} className="service-tile" delay={(index % 4) * 0.07}>
                      <a className="service-link" href={servicePath(item.slug, lang)}>
                        <span className={`service-image-wrap service-image-${item.slug}`}><img src={item.tile.src} srcSet={photoSrcSet(item.tile.src)} sizes="(max-width: 1100px) 50vw, 25vw" alt={item.tile.alt} loading="lazy" width="600" height="700" /></span>
                        <span className="service-name-row"><span className="service-name">{item.name}</span><ArrowUpRight size={22} strokeWidth={1.1} aria-hidden="true" /></span>
                        <span className="service-caption">{item.tile.caption}</span>
                      </a>
                    </Reveal>
                  ))}
                </div>
                <Reveal className="services-footnote"><p>{t.servicesFootnote}</p></Reveal>
              </div>
            </section>

            <ReviewsSection />

            <section id="philosophy" className="philosophy-section" aria-labelledby="philosophy-title">
              <div className="page-width philosophy-grid">
                <Reveal className="philosophy-image-wrap"><img src={asset('images/our-space.webp')} srcSet={photoSrcSet(asset('images/our-space.webp'), 912)} sizes="(max-width: 767px) 100vw, 45vw" alt={t.philosophyAlt} loading="lazy" width="640" height="800" /></Reveal>
                <Reveal className="philosophy-copy" delay={0.12}>
                  <p className="eyebrow">{t.philosophyEyebrow}</p>
                  <h2 id="philosophy-title" className="section-title">{t.philosophyTitle[0]}<br />{t.philosophyTitle[1]} <em>{t.philosophyTitle[2]}<br className="philosophy-break" /> {t.philosophyTitle[3]}</em></h2>
                  <span className="small-rule" aria-hidden="true" />
                  <p className="section-description">{t.philosophyP1}</p>
                  <p className="section-description">{t.philosophyP2}</p>
                  <p className="signature">{t.signature}</p>
                  <a className="underlined-link" href="#services">{t.findRenewal}<ArrowRight size={16} strokeWidth={1.4} /></a>
                </Reveal>
              </div>
            </section>

            <section id="visit" className="visit-section section-space" aria-labelledby="visit-title">
              <div className="page-width visit-grid">
                <Reveal className="visit-copy">
                  <p className="eyebrow">{t.visitEyebrow}</p>
                  <h2 id="visit-title" className="section-title">{t.visitTitle[0]}<br /><em>{t.visitTitle[1]}</em></h2>
                  <p className="section-description">{t.visitDescription}</p>
                  <button type="button" className="underlined-link" onClick={() => openPlanner()}>{t.planVisit}<ArrowRight size={16} strokeWidth={1.4} /></button>
                </Reveal>
                <Reveal className="faq-list" delay={0.1}>
                  {faqs.map((faq, index) => (
                    <div className={`faq-item ${openFaq === index ? 'is-open' : ''}`} key={faq.question}>
                      <h3><button type="button" id={`faq-question-${index}`} aria-expanded={openFaq === index} aria-controls={`faq-answer-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}><span>{faq.question}</span><ChevronDown size={18} strokeWidth={1.4} /></button></h3>
                      <AnimatePresence initial={false}>
                        {openFaq === index && <motion.div className="faq-answer-wrap" id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.28 }}><p>{faq.answer}</p></motion.div>}
                      </AnimatePresence>
                    </div>
                  ))}
                </Reveal>
              </div>
            </section>

            <section id="gift-cards" className="gift-section section-space" aria-labelledby="gift-title">
              <div className="page-width gift-grid">
                <Reveal className="gift-visual">
                  <div className="gift-card" aria-hidden="true">
                    <img src={asset('images/logo-mark-light-360.webp')} alt="" width="120" height="120" loading="lazy" />
                    <span className="gift-card-name">Stacy's Esthetics</span>
                    <span className="gift-card-label">{t.giftCardLabel}</span>
                  </div>
                </Reveal>
                <Reveal className="gift-copy" delay={0.1}>
                  <p className="eyebrow">{t.giftEyebrow}</p>
                  <h2 id="gift-title" className="section-title">{t.giftTitle[0]} <em>{t.giftTitle[1]}</em></h2>
                  <p className="section-description">{t.giftDescription}</p>
                  <a className="button button-primary" href={studio.giftCardHref} target="_blank" rel="noopener noreferrer">{t.giftButton}<ArrowUpRight size={16} strokeWidth={1.5} /></a>
                  <p className="gift-note">{t.giftNote}</p>
                </Reveal>
              </div>
            </section>

            <section className="closing-section" aria-labelledby="closing-title">
              <Reveal className="closing-content">
                <Botanical className="closing-botanical" />
                <p className="eyebrow">{t.closingEyebrow}</p>
                <h2 id="closing-title" className="section-title">{t.closingTitle[0]}<br />{t.closingTitle[1]} <em>{t.closingTitle[2]}</em></h2>
                <p>{t.closingText}</p>
                <button type="button" className="button button-primary" onClick={() => openPlanner()}>{t.closingButton}<ArrowUpRight size={16} strokeWidth={1.5} /></button>
              </Reveal>
            </section>
            </>
          )}
        </main>

        <footer className="site-footer">
          <div className="page-width">
            <div className="footer-top">
              <div className="footer-brand"><a href={page ? home : '#home'}><BrandLogo variant="footer" /></a><p>{t.footerTagline}</p><SocialLinks /></div>
              <nav className="footer-nav" aria-label={t.services}><p className="footer-label">{t.footerServices}</p>{pages.map((item) => <a key={item.slug} href={servicePath(item.slug, lang)}>{item.name}</a>)}</nav>
              <nav className="footer-nav" aria-label={t.studioContact}><p className="footer-label">{t.footerMore}</p><button type="button" onClick={() => showDialog({ type: 'studio' })}>{t.studioContact}<ArrowUpRight size={13} /></button><button type="button" onClick={() => showDialog({ type: 'policies', tab: 'booking' })}>{t.bookingPolicies}</button><button type="button" onClick={() => openPlanner()}>{t.yourAppointmentPlan}</button><a href={studio.giftCardHref} target="_blank" rel="noopener noreferrer">{t.footerGiftCards}<ArrowUpRight size={13} /></a></nav>
              <address className="footer-visit"><p className="footer-label">{t.footerVisit}</p><a href={studio.mapsHref} target="_blank" rel="noopener noreferrer">{studio.street}<br />{studio.locality}</a><a href={studio.phoneHref}>{studio.phone}</a><dl className="footer-hours">{studioHours(lang).map((row) => <div key={row.days} style={{ display: 'contents' }}><dt>{row.days}</dt><dd>{row.time}</dd></div>)}</dl></address>
            </div>
            <div className="footer-bottom"><p>&copy; {new Date().getFullYear()} {t.rights}</p><a className="footer-credit" href="https://techathos.com" target="_blank" rel="noopener noreferrer">{t.poweredBy}<img src={asset('images/techathos-helmet.svg')} alt="" width="18" height="18" />TechAthos</a><a href="#main" className="back-to-top">{t.backToTop}<ArrowUp size={14} strokeWidth={1.4} /></a></div>
          </div>
        </footer>
      </div>

      <AnimatePresence mode="wait" onExitComplete={() => {
        if (!dialog) dialogTriggerRef.current?.focus({ preventScroll: true });
      }}>
        {dialog?.type === 'square' && page?.squareBooking && <Dialog key="square" onClose={closeDialog} labelledBy="square-booking-title" className="square-dialog"><SquareBooking page={{ ...page, squareBooking: page.squareBooking }} /></Dialog>}
        {dialog?.type === 'planner' && <Dialog key="planner" onClose={closeDialog} labelledBy="planner-title" className="planner-dialog"><AppointmentPlanner initialService={dialog.serviceId} savedDraft={savedDraft} onSave={setSavedDraft} onDelete={deleteDraft} /></Dialog>}
        {dialog?.type === 'policies' && <Dialog key="policies" onClose={closeDialog} labelledBy="policies-title" className="info-dialog"><PolicyDetails initialTab={dialog.tab} hasDraft={Boolean(savedDraft)} onDelete={deleteDraft} /></Dialog>}
        {dialog?.type === 'studio' && <Dialog key="studio" onClose={closeDialog} labelledBy="studio-title" className="info-dialog"><StudioDetails onClose={closeDialog} /></Dialog>}
      </AnimatePresence>
    </>
  );
}
