import { useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Download } from 'lucide-react';
import {
  DRAFT_KEY,
  formatDate,
  localDateString,
  readDraft,
  type AppointmentDraft,
} from '../data';
import { findServicePage, servicePages, startingPrice, treatmentOptions } from '../servicePages';

type PlannerProps = {
  /** A service page slug to pre-select. Ignored if it isn't a bookable service. */
  initialService?: string;
  savedDraft: AppointmentDraft | null;
  onSave: (draft: AppointmentDraft) => void;
  onDelete: () => boolean;
};

export default function AppointmentPlanner({ initialService: requestedService, savedDraft, onSave, onDelete }: PlannerProps) {
  const initialService = requestedService && findServicePage(requestedService) ? requestedService : undefined;
  const [step, setStep] = useState(initialService ? 1 : 0);
  const [complete, setComplete] = useState(Boolean(savedDraft && !initialService));
  const [serviceId, setServiceId] = useState(initialService || savedDraft?.serviceId || '');
  const [treatment, setTreatment] = useState(initialService && initialService !== savedDraft?.serviceId ? '' : savedDraft?.treatment || '');
  const [date, setDate] = useState(savedDraft?.date || '');
  const [time, setTime] = useState(savedDraft?.time || 'No preference');
  const [name, setName] = useState(savedDraft?.name || '');
  const [email, setEmail] = useState(savedDraft?.email || '');
  const [phone, setPhone] = useState(savedDraft?.phone || '');
  const [notes, setNotes] = useState(savedDraft?.notes || '');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [persisted, setPersisted] = useState(() => Boolean(savedDraft && readDraft()?.savedAt === savedDraft.savedAt));
  const [downloaded, setDownloaded] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();
  const selectedService = findServicePage(serviceId);

  function goToStep(next: number) {
    setError('');
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!serviceId) {
      setError('Choose a treatment to start planning your visit.');
      setStep(0);
      return;
    }
    if (step === 0) {
      goToStep(1);
      return;
    }
    if (!date || date < localDateString()) {
      setError('Please choose today or a future date.');
      setStep(1);
      return;
    }
    if (step === 1) {
      goToStep(2);
      return;
    }
    if (!name.trim() || !email.trim() || !consent) {
      setError('Please complete your name, email, and acknowledgement.');
      return;
    }

    const draft: AppointmentDraft = {
      version: 1,
      serviceId,
      treatment,
      date,
      time,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      notes: notes.trim(),
      savedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      setPersisted(true);
    } catch {
      setPersisted(false);
    }
    onSave(draft);
    setError('');
    setComplete(true);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function downloadPlan() {
    const text = [
      "STACY'S ESTHETICS",
      'YOUR PERSONAL APPOINTMENT PLAN',
      '',
      'DRAFT ONLY: This is not a confirmed appointment and has not been sent to the studio.',
      '',
      `Service: ${selectedService?.name || ''}`,
      `Treatment: ${treatment || 'Not decided yet'}`,
      `Preferred date: ${formatDate(date)}`,
      `Preferred time: ${time}`,
      `Name: ${name.trim()}`,
      `Email: ${email.trim()}`,
      ...(phone.trim() ? [`Phone: ${phone.trim()}`] : []),
      ...(notes.trim() ? [`Notes: ${notes.trim()}`] : []),
      '',
      'Confirm availability, pricing, location, and policies directly with the studio before your visit.',
      'No payment has been collected.',
    ].join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'stacys-esthetics-appointment-plan.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  }

  function deletePlan() {
    if (!onDelete()) {
      setError('Your browser could not remove the saved draft. Please clear this site\'s storage in your browser settings.');
      return;
    }
    setComplete(false);
    setConfirmDelete(false);
    setServiceId('');
    setDate('');
    setTime('No preference');
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setConsent(false);
    setDownloaded(false);
    goToStep(0);
  }

  if (complete) {
    return (
      <div className="planner-content planner-complete">
        <span className="completion-symbol" aria-hidden="true"><Check size={25} strokeWidth={1.2} /></span>
        <p className="eyebrow">A LITTLE TIME, JUST FOR YOU</p>
        <h2 id="planner-title" className="dialog-title" tabIndex={-1} ref={headingRef}>Your moment, <em>planned.</em></h2>
        <p className="dialog-intro">
          {persisted ? 'Your appointment draft is saved on this device.' : 'Your plan is ready, but your browser could not save it. Download a copy to keep it.'}
          {' '}It has not been sent to the studio and is not a confirmed appointment.
        </p>
        <dl className="plan-summary">
          <div><dt>Your ritual</dt><dd>{selectedService?.name}{treatment && <span>{treatment}</span>}</dd></div>
          <div><dt>Preferred date</dt><dd>{formatDate(date)}</dd></div>
          <div><dt>Preferred time</dt><dd>{time}</dd></div>
          <div><dt>Your details</dt><dd>{name}<span>{email}</span>{phone && <span>{phone}</span>}</dd></div>
          {notes && <div><dt>Your notes</dt><dd className="summary-notes">{notes}</dd></div>}
        </dl>
        <p className="form-note">Next, confirm availability, pricing, location, and booking policies directly with the studio.</p>
        <button type="button" className="button button-primary w-full" onClick={downloadPlan}>
          {downloaded ? 'Download your plan again' : 'Download your appointment plan'}<Download size={16} />
        </button>
        {downloaded && <p className="download-status" role="status">Your plan is ready to keep or share with the studio.</p>}
        <div className="summary-actions">
          <button type="button" className="text-button" onClick={() => { setComplete(false); setConsent(false); setDownloaded(false); goToStep(0); }}>Edit your plan</button>
          <button type="button" className="text-button muted" onClick={() => setConfirmDelete(true)}>Delete draft</button>
        </div>
        {confirmDelete && (
          <div className="delete-confirmation" role="alert">
            <p>Delete your saved appointment plan from this device?</p>
            <div><button type="button" className="text-button" onClick={deletePlan}>Yes, delete it</button><button type="button" className="text-button" onClick={() => setConfirmDelete(false)}>Keep my plan</button></div>
          </div>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
      </div>
    );
  }

  return (
    <div className="planner-content">
      <p className="eyebrow">YOUR MOMENT OF CARE</p>
      <h2 id="planner-title" className="dialog-title" tabIndex={-1} ref={headingRef}>Make space for <em>yourself.</em></h2>
      <p className="dialog-intro">A little planning. A little closer to feeling good.</p>
      <ol className="planner-progress" aria-label="Appointment planning progress">
        {['Your ritual', 'Your preferences', 'Your details'].map((label, index) => (
          <li key={label} className={index <= step ? 'is-active' : ''} aria-current={index === step ? 'step' : undefined}>
            <span>{index < step ? <Check size={13} /> : `0${index + 1}`}</span>{label}
          </li>
        ))}
      </ol>
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: reduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduceMotion ? 0 : -10 }}
            transition={{ duration: reduceMotion ? 0 : 0.16 }}
          >
            {step === 0 && (
              <fieldset className="treatment-options">
                <legend className="form-section-title">What would feel good today?</legend>
                {servicePages.map((page) => {
                  const from = startingPrice(page);
                  return (
                    <label key={page.slug} className={`treatment-option treatment-option-text ${serviceId === page.slug ? 'is-selected' : ''}`}>
                      <input type="radio" name="treatment" value={page.slug} checked={serviceId === page.slug} onChange={() => { if (serviceId !== page.slug) setTreatment(''); setServiceId(page.slug); setError(''); }} required />
                      <span className="option-copy"><strong>{page.name}</strong><span>{page.blurb}</span></span>
                      {from !== undefined && <span className="option-price">from ${from}</span>}
                      <span className="radio-indicator" aria-hidden="true">{serviceId === page.slug && <span />}</span>
                    </label>
                  );
                })}
              </fieldset>
            )}
            {step === 1 && (
              <div className="planner-fields">
                <p className="form-section-title">When could you use a little pause?</p>
                <div className="selected-treatment-line"><span>Your ritual</span><strong>{selectedService?.name}</strong><button type="button" className="text-button" onClick={() => goToStep(0)}>Change</button></div>
                {selectedService && (
                  <label className="field-label" htmlFor="appointment-treatment">Treatment <span className="optional">(optional)</span>
                    <select id="appointment-treatment" value={treatment} onChange={(event) => setTreatment(event.target.value)}>
                      <option value="">Not sure yet, help me choose</option>
                      {treatmentOptions(selectedService).map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>
                )}
                <label className="field-label" htmlFor="appointment-date">Preferred date<input id="appointment-date" type="date" value={date} min={localDateString()} required onChange={(event) => { setDate(event.target.value); setError(''); }} /></label>
                <label className="field-label" htmlFor="appointment-time">Preferred time of day<select id="appointment-time" value={time} onChange={(event) => setTime(event.target.value)}><option>No preference</option><option>Morning</option><option>Afternoon</option></select></label>
                <p className="form-note">These are your preferences, not available appointment slots. The studio must confirm all dates and times.</p>
              </div>
            )}
            {step === 2 && (
              <div className="planner-fields">
                <p className="form-section-title">Let's make this moment yours.</p>
                <div className="field-grid">
                  <label className="field-label" htmlFor="appointment-name">Full name<input id="appointment-name" autoComplete="name" value={name} minLength={2} maxLength={100} required onChange={(event) => setName(event.target.value)} placeholder="Your name" /></label>
                  <label className="field-label" htmlFor="appointment-email">Email address<input id="appointment-email" type="email" autoComplete="email" value={email} maxLength={200} required onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
                </div>
                <label className="field-label" htmlFor="appointment-phone">Phone number <span className="optional">(optional)</span><input id="appointment-phone" type="tel" autoComplete="tel" value={phone} maxLength={35} onChange={(event) => setPhone(event.target.value)} placeholder="Your phone number" /></label>
                <label className="field-label" htmlFor="appointment-notes">Anything you'd like to add? <span className="optional">(optional)</span><textarea id="appointment-notes" value={notes} maxLength={500} rows={2} onChange={(event) => setNotes(event.target.value)} placeholder="A preference or a question for your visit" /></label>
                <p className="form-note notes-note">Please don't include medical or sensitive information.</p>
                <label className="consent-label"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required /><span>I understand this saves a draft on my device. It does not send a request or confirm an appointment.</span></label>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="planner-navigation">
          {step > 0 && <button type="button" className="text-button planner-back" onClick={() => goToStep(step - 1)}><ArrowLeft size={15} />Back</button>}
          <button type="submit" className="button button-primary">{step === 2 ? 'Save my appointment plan' : 'Continue'}<ArrowRight size={16} /></button>
        </div>
        <p className="planner-disclaimer">A personal planner, not a live booking service. No request is sent and no payment is taken.</p>
      </form>
    </div>
  );
}