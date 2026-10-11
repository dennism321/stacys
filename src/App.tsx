import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUp, ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import Dialog from './components/Dialog';
import AppointmentPlanner from './components/AppointmentPlanner';
import BrandLogo from './components/BrandLogo';
import SocialLinks from './components/SocialLinks';
import { PolicyDetails, StudioDetails, TreatmentDetails } from './components/StudioDialogs';
import { DRAFT_KEY, faqs, readDraft, services, type AppointmentDraft, type ServiceId } from './data';

type OpenDialog =
  | { type: 'treatment'; serviceId: ServiceId }
  | { type: 'planner'; serviceId?: ServiceId }
  | { type: 'policies'; tab: 'booking' | 'privacy' }
  | { type: 'studio' }
  | null;

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: reduceMotion ? 0 : 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener('change', update);
    return () => list.removeEventListener('change', update);
  }, [query]);
  return matches;
}

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

export default function App() {
  const [dialog, setDialog] = useState<OpenDialog>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [savedDraft, setSavedDraft] = useState<AppointmentDraft | null>(readDraft);
  const dialogTriggerRef = useRef<HTMLElement | null>(null);
  const reduceMotion = useReducedMotion();
  const isPhone = useMediaQuery('(max-width: 767px)');
  // Phones get the full portrait clip; wider screens get a squarer crop on the right.
  const heroMedia = isPhone ? 'images/headspa-mobile' : 'images/headspa-desktop';
  const closeDialog = useCallback(() => setDialog(null), []);
  const showDialog = useCallback((next: Exclude<OpenDialog, null>) => {
    if (!dialog) dialogTriggerRef.current = document.activeElement as HTMLElement | null;
    setMenuOpen(false);
    setDialog(next);
  }, [dialog]);
  const openPlanner = useCallback((serviceId?: ServiceId) => {
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
    const syncDraft = (event: StorageEvent) => {
      if (event.key === DRAFT_KEY || event.key === null) setSavedDraft(readDraft());
    };
    window.addEventListener('storage', syncDraft);
    return () => window.removeEventListener('storage', syncDraft);
  }, []);

  const heroItem = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

  return (
    <>
      <div inert={dialog ? true : undefined}>
        <a className="skip-link" href="#main">Skip to content</a>
        <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
          <div className="header-inner">
            <div className="header-side header-left">
              <button type="button" id="mobile-menu-toggle" className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={23} strokeWidth={1.5} /> : <Menu size={23} strokeWidth={1.5} />}
              </button>
              <nav className="desktop-nav" aria-label="Main navigation">
                <a href="#services">Our Services</a>
                <a href="#philosophy">Our Philosophy</a>
                <a href="#visit">Your Visit</a>
              </nav>
            </div>
            <a href="#home" className="brand-pendant" aria-label="Stacy's Esthetics, fall in love with yourself. Back to top" onClick={() => setMenuOpen(false)}>
              <BrandLogo />
            </a>
            <div className="header-side header-right">
              <button type="button" className="button button-primary header-booking" onClick={() => openPlanner()}>
                <span className="desktop-book-label">{savedDraft ? 'View your appointment plan' : 'Book an appointment'}</span>
                <span className="mobile-book-label">{savedDraft ? 'Your plan' : 'Book'}</span>
                <ArrowUpRight size={15} strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <AnimatePresence>
            {menuOpen && (
              <motion.nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.25 }}>
                <a href="#services" onClick={() => setMenuOpen(false)}>Our Services<ArrowUpRight size={18} /></a>
                <a href="#philosophy" onClick={() => setMenuOpen(false)}>Our Philosophy<ArrowUpRight size={18} /></a>
                <a href="#visit" onClick={() => setMenuOpen(false)}>Your Visit<ArrowUpRight size={18} /></a>
              </motion.nav>
            )}
          </AnimatePresence>
        </header>

        <main id="main">
          <section id="home" className="hero" aria-labelledby="hero-title">
            {reduceMotion ? (
              <img className="hero-image hero-video" src={`${heroMedia}-poster.jpg`} alt="A head spa water ritual at Stacy's Esthetics, with warm water streaming through the hair" fetchPriority="high" />
            ) : (
              <motion.video key={heroMedia} className="hero-image hero-video" src={`${heroMedia}.mp4`} poster={`${heroMedia}-poster.jpg`} autoPlay muted loop playsInline preload="auto" aria-hidden="true" initial={{ scale: 1.045 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }} />
            )}
            <div className="page-width hero-inner">
              <motion.div className="hero-copy" initial={reduceMotion ? 'visible' : 'hidden'} animate="visible" variants={{ visible: { transition: { staggerChildren: 0.11, delayChildren: 0.12 } } }}>
                <motion.p className="eyebrow hero-eyebrow" variants={heroItem} transition={{ duration: 0.65 }}>WELCOME TO STACY'S ESTHETICS</motion.p>
                <motion.h1 id="hero-title" variants={heroItem} transition={{ duration: 0.75 }}>Beauty,<br /><em>in balance.</em></motion.h1>
                <motion.p className="hero-mantra" variants={heroItem} transition={{ duration: 0.7 }}>Care that feels like coming home to yourself.</motion.p>
                <motion.p className="hero-description" variants={heroItem} transition={{ duration: 0.7 }}>Facials, massage, lip enhancements, and head spa<br className="desktop-break" /> rituals. Thoughtfully designed around you.</motion.p>
                <motion.div className="hero-actions" variants={heroItem} transition={{ duration: 0.7 }}>
                  <button type="button" className="button button-primary" onClick={() => openPlanner()}>Book your moment<ArrowUpRight size={16} strokeWidth={1.5} /></button>
                  <a href="#services" className="hero-explore">Explore treatments<ArrowRight size={16} strokeWidth={1.5} /></a>
                </motion.div>
              </motion.div>
            </div>
          </section>

          <section id="services" className="services-section section-space" aria-labelledby="services-title">
            <div className="page-width">
              <Reveal className="section-heading centered">
                <p className="eyebrow">THE ART OF FEELING GOOD</p>
                <h2 id="services-title" className="section-title">Beautiful care. <em>Just for you.</em></h2>
                <span className="heading-rule" aria-hidden="true" />
              </Reveal>
              <div className="services-grid">
                {services.map((service, index) => (
                  <Reveal key={service.id} delay={index * 0.07}>
                    <button type="button" className="service-link" aria-label={`Explore ${service.name}`} onClick={() => showDialog({ type: 'treatment', serviceId: service.id })}>
                      <span className={`service-image-wrap service-image-${service.id}`}><img src={service.image} alt={service.alt} loading="lazy" width="600" height="700" /></span>
                      <span className="service-name-row"><span className="service-name">{service.name}</span><ArrowUpRight size={22} strokeWidth={1.1} /></span>
                      <span className="service-caption">{service.caption}</span>
                    </button>
                  </Reveal>
                ))}
              </div>
              <Reveal className="services-footnote"><p>Every face, every body, every story is different. Your care should be, too.</p></Reveal>
            </div>
          </section>

          <section id="philosophy" className="philosophy-section" aria-labelledby="philosophy-title">
            <div className="page-width philosophy-grid">
              <Reveal className="philosophy-image-wrap"><img src="images/our-space.jpg" alt="Warm sunlight falling across a linen-covered treatment bed in a serene beige spa" loading="lazy" width="640" height="800" /></Reveal>
              <Reveal className="philosophy-copy" delay={0.12}>
                <p className="eyebrow">A THOUGHTFUL APPROACH TO YOU</p>
                <h2 id="philosophy-title" className="section-title">More than a treatment.<br />A moment to <em>come<br className="philosophy-break" /> back to you.</em></h2>
                <span className="small-rule" aria-hidden="true" />
                <p className="section-description">We believe that beauty and wellbeing belong together. That feeling good in your skin starts with feeling truly cared for.</p>
                <p className="section-description">Here, you can slow down, let go, and enjoy care that's as individual as you are. No rush. Just a little space to feel like yourself again.</p>
                <p className="signature">With care, Stacy</p>
                <a className="underlined-link" href="#services">Find your own kind of renewal<ArrowRight size={16} strokeWidth={1.4} /></a>
              </Reveal>
            </div>
          </section>

          <section id="visit" className="visit-section section-space" aria-labelledby="visit-title">
            <div className="page-width visit-grid">
              <Reveal className="visit-copy">
                <p className="eyebrow">BEFORE YOU UNWIND</p>
                <h2 id="visit-title" className="section-title">A little clarity.<br /><em>A lot more calm.</em></h2>
                <p className="section-description">A few things to know, so you can focus on what matters. You.</p>
                <button type="button" className="underlined-link" onClick={() => openPlanner()}>Let's plan your visit<ArrowRight size={16} strokeWidth={1.4} /></button>
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

          <section className="closing-section" aria-labelledby="closing-title">
            <Reveal className="closing-content">
              <Botanical className="closing-botanical" />
              <p className="eyebrow">YOUR WELLBEING, BEAUTIFULLY PERSONAL</p>
              <h2 id="closing-title" className="section-title">You deserve a moment<br />that's <em>only yours.</em></h2>
              <p>Let the rest of the world wait a little.</p>
              <button type="button" className="button button-primary" onClick={() => openPlanner()}>Let's make time for you<ArrowUpRight size={16} strokeWidth={1.5} /></button>
            </Reveal>
          </section>
        </main>

        <footer className="site-footer">
          <div className="page-width">
            <div className="footer-top">
              <div className="footer-brand"><a href="#home" aria-label="Stacy's Esthetics, back to top"><BrandLogo variant="footer" /></a><p>Beauty in balance. Care without hurry.</p><SocialLinks /></div>
              <nav className="footer-nav" aria-label="Explore"><p className="footer-label">EXPLORE</p><a href="#services">Our services</a><a href="#philosophy">Our philosophy</a><a href="#visit">Your visit</a></nav>
              <nav className="footer-nav" aria-label="Studio information"><p className="footer-label">A LITTLE MORE</p><button type="button" onClick={() => showDialog({ type: 'studio' })}>Studio & contact<ArrowUpRight size={13} /></button><button type="button" onClick={() => showDialog({ type: 'policies', tab: 'booking' })}>Booking policies</button><button type="button" onClick={() => openPlanner()}>Your appointment plan</button></nav>
            </div>
            <div className="footer-bottom"><p>&copy; {new Date().getFullYear()} Stacy's Esthetics. All rights reserved.</p><button type="button" onClick={() => showDialog({ type: 'policies', tab: 'privacy' })}>Privacy & your data</button><a href="#home" className="back-to-top">Back to the slow life<ArrowUp size={14} strokeWidth={1.4} /></a></div>
          </div>
        </footer>
      </div>

      <AnimatePresence mode="wait" onExitComplete={() => {
        if (!dialog) dialogTriggerRef.current?.focus({ preventScroll: true });
      }}>
        {dialog?.type === 'treatment' && <Dialog key="treatment" onClose={closeDialog} labelledBy="treatment-title" className="treatment-dialog"><TreatmentDetails service={services.find((service) => service.id === dialog.serviceId)!} onChoose={openPlanner} /></Dialog>}
        {dialog?.type === 'planner' && <Dialog key="planner" onClose={closeDialog} labelledBy="planner-title" className="planner-dialog"><AppointmentPlanner initialService={dialog.serviceId} savedDraft={savedDraft} onSave={setSavedDraft} onDelete={deleteDraft} /></Dialog>}
        {dialog?.type === 'policies' && <Dialog key="policies" onClose={closeDialog} labelledBy="policies-title" className="info-dialog"><PolicyDetails initialTab={dialog.tab} hasDraft={Boolean(savedDraft)} onDelete={deleteDraft} /></Dialog>}
        {dialog?.type === 'studio' && <Dialog key="studio" onClose={closeDialog} labelledBy="studio-title" className="info-dialog"><StudioDetails onClose={closeDialog} /></Dialog>}
      </AnimatePresence>
    </>
  );
}
