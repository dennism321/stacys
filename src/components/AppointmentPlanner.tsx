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
import { findLocalizedPage, localizedPages, startingPrice, treatmentOptions } from '../servicePages';
import { useLang, useT } from '../i18n';
import { SquareFrame, booksOnSquare } from './SquareBooking';

type PlannerProps = {
  /** A service page slug to pre-select. Ignored if it isn't a bookable service. */
  initialService?: string;
  savedDraft: AppointmentDraft | null;
  onSave: (draft: AppointmentDraft) => void;
  onDelete: () => boolean;
};

export default function AppointmentPlanner({ initialService: requestedService, savedDraft, onSave, onDelete }: PlannerProps) {
  const lang = useLang();
  const t = useT();
  const servicePages = localizedPages(lang);
  const initialService = requestedService && findLocalizedPage(requestedService, lang) ? requestedService : undefined;
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
  // Services with a Square Appointments code book on Square instead of continuing through the planner.
  const [onSquare, setOnSquare] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();
  const selectedService = findLocalizedPage(serviceId, lang);

  function goToStep(next: number) {
    setError('');
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!serviceId) {
      setError(t.errChoose);
      setStep(0);
      return;
    }
    if (step === 0 && booksOnSquare(selectedService)) {
      setError('');
      setOnSquare(true);
      requestAnimationFrame(() => headingRef.current?.focus());
      return;
    }
    if (step === 0) {
      goToStep(1);
      return;
    }
    if (!date || date < localDateString()) {
      setError(t.errDate);
      setStep(1);
      return;
    }
    if (step === 1) {
      goToStep(2);
      return;
    }
    if (!name.trim() || !email.trim() || !consent) {
      setError(t.errDetails);
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
    const f = t.planFile;
    const text = [
      "STACY'S ESTHETICS",
      f.title,
      '',
      f.draft,
      '',
      `${f.service}: ${selectedService?.name || ''}`,
      `${f.treatment}: ${treatment || f.notDecided}`,
      `${f.date}: ${formatDate(date, t.locale)}`,
      `${f.time}: ${t.times[time] ?? time}`,
      `${f.name}: ${name.trim()}`,
      `${f.email}: ${email.trim()}`,
      ...(phone.trim() ? [`${f.phone}: ${phone.trim()}`] : []),
      ...(notes.trim() ? [`${f.notes}: ${notes.trim()}`] : []),
      '',
      f.confirm,
      f.noPayment,
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
      setError(t.errDelete);
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
        <p className="eyebrow">{t.completeEyebrow}</p>
        <h2 id="planner-title" className="dialog-title" tabIndex={-1} ref={headingRef}>{t.completeTitle[0]} <em>{t.completeTitle[1]}</em></h2>
        <p className="dialog-intro">
          {persisted ? t.savedOnDevice : t.couldNotSave}
          {' '}{t.notSent}
        </p>
        <dl className="plan-summary">
          <div><dt>{t.yourRitual}</dt><dd>{selectedService?.name}{treatment && <span>{treatment}</span>}</dd></div>
          <div><dt>{t.preferredDate}</dt><dd>{formatDate(date, t.locale)}</dd></div>
          <div><dt>{t.preferredTime}</dt><dd>{t.times[time] ?? time}</dd></div>
          <div><dt>{t.yourDetails}</dt><dd>{name}<span>{email}</span>{phone && <span>{phone}</span>}</dd></div>
          {notes && <div><dt>{t.yourNotes}</dt><dd className="summary-notes">{notes}</dd></div>}
        </dl>
        <p className="form-note">{t.nextConfirm}</p>
        <button type="button" className="button button-primary w-full" onClick={downloadPlan}>
          {downloaded ? t.downloadAgain : t.download}<Download size={16} />
        </button>
        {downloaded && <p className="download-status" role="status">{t.downloadReady}</p>}
        <div className="summary-actions">
          <button type="button" className="text-button" onClick={() => { setComplete(false); setConsent(false); setDownloaded(false); goToStep(0); }}>{t.editPlan}</button>
          <button type="button" className="text-button muted" onClick={() => setConfirmDelete(true)}>{t.deleteDraft}</button>
        </div>
        {confirmDelete && (
          <div className="delete-confirmation" role="alert">
            <p>{t.confirmDelete}</p>
            <div><button type="button" className="text-button" onClick={deletePlan}>{t.yesDelete}</button><button type="button" className="text-button" onClick={() => setConfirmDelete(false)}>{t.keepPlan}</button></div>
          </div>
        )}
        {error && <p className="form-error" role="alert">{error}</p>}
      </div>
    );
  }

  if (onSquare && booksOnSquare(selectedService)) {
    return (
      <div className="planner-content planner-square">
        <p className="eyebrow">{t.bookOnline}</p>
        <h2 id="planner-title" className="dialog-title" tabIndex={-1} ref={headingRef}>{t.bookYour} <em>{selectedService.name.toLowerCase()}.</em></h2>
        <p className="dialog-intro">{t.squareIntro}</p>
        <div className="selected-treatment-line"><span>{t.yourRitual}</span><strong>{selectedService.name}</strong><button type="button" className="text-button" onClick={() => { setOnSquare(false); goToStep(0); }}>{t.change}</button></div>
        <SquareFrame page={selectedService} />
      </div>
    );
  }

  return (
    <div className="planner-content">
      <p className="eyebrow">{t.plannerEyebrow}</p>
      <h2 id="planner-title" className="dialog-title" tabIndex={-1} ref={headingRef}>{t.plannerTitle[0]} <em>{t.plannerTitle[1]}</em></h2>
      <p className="dialog-intro">{t.plannerIntro}</p>
      <ol className="planner-progress" aria-label={t.plannerProgress}>
        {t.steps.map((label, index) => (
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
                <legend className="form-section-title">{t.whatFeelsGood}</legend>
                {servicePages.map((page) => {
                  const from = startingPrice(page);
                  return (
                    <label key={page.slug} className={`treatment-option treatment-option-text ${serviceId === page.slug ? 'is-selected' : ''}`}>
                      <input type="radio" name="treatment" value={page.slug} checked={serviceId === page.slug} onChange={() => { if (serviceId !== page.slug) setTreatment(''); setServiceId(page.slug); setError(''); }} required />
                      <span className="option-copy"><strong>{page.name}</strong><span>{page.blurb}</span></span>
                      {from !== undefined && <span className="option-price">{t.from} ${from}</span>}
                      <span className="radio-indicator" aria-hidden="true">{serviceId === page.slug && <span />}</span>
                    </label>
                  );
                })}
              </fieldset>
            )}
            {step === 1 && (
              <div className="planner-fields">
                <p className="form-section-title">{t.whenPause}</p>
                <div className="selected-treatment-line"><span>{t.yourRitual}</span><strong>{selectedService?.name}</strong><button type="button" className="text-button" onClick={() => goToStep(0)}>{t.change}</button></div>
                {selectedService && (
                  <label className="field-label" htmlFor="appointment-treatment">{t.treatmentLabel} <span className="optional">{t.optional}</span>
                    <select id="appointment-treatment" value={treatment} onChange={(event) => setTreatment(event.target.value)}>
                      <option value="">{t.notSure}</option>
                      {treatmentOptions(selectedService).map((option) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </label>
                )}
                <label className="field-label" htmlFor="appointment-date">{t.preferredDate}<input id="appointment-date" type="date" value={date} min={localDateString()} required onChange={(event) => { setDate(event.target.value); setError(''); }} /></label>
                <label className="field-label" htmlFor="appointment-time">{t.preferredTime}<select id="appointment-time" value={time} onChange={(event) => setTime(event.target.value)}>{['No preference', 'Morning', 'Afternoon'].map((value) => <option key={value} value={value}>{t.times[value]}</option>)}</select></label>
                <p className="form-note">{t.preferencesNote}</p>
              </div>
            )}
            {step === 2 && (
              <div className="planner-fields">
                <p className="form-section-title">{t.makeItYours}</p>
                <div className="field-grid">
                  <label className="field-label" htmlFor="appointment-name">{t.fullName}<input id="appointment-name" autoComplete="name" value={name} minLength={2} maxLength={100} required onChange={(event) => setName(event.target.value)} placeholder={t.yourName} /></label>
                  <label className="field-label" htmlFor="appointment-email">{t.emailAddress}<input id="appointment-email" type="email" autoComplete="email" value={email} maxLength={200} required onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
                </div>
                <label className="field-label" htmlFor="appointment-phone">{t.phoneNumber} <span className="optional">{t.optional}</span><input id="appointment-phone" type="tel" autoComplete="tel" value={phone} maxLength={35} onChange={(event) => setPhone(event.target.value)} placeholder={t.yourPhone} /></label>
                <label className="field-label" htmlFor="appointment-notes">{t.anythingToAdd} <span className="optional">{t.optional}</span><textarea id="appointment-notes" value={notes} maxLength={500} rows={2} onChange={(event) => setNotes(event.target.value)} placeholder={t.notesPlaceholder} /></label>
                <p className="form-note notes-note">{t.noMedical}</p>
                <label className="consent-label"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required /><span>{t.consent}</span></label>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="planner-navigation">
          {step > 0 && <button type="button" className="text-button planner-back" onClick={() => goToStep(step - 1)}><ArrowLeft size={15} />{t.back}</button>}
          <button type="submit" className="button button-primary">{step === 2 ? t.savePlan : step === 0 && booksOnSquare(selectedService) ? t.continueToBooking : t.continue}<ArrowRight size={16} /></button>
        </div>
        <p className="planner-disclaimer">{t.plannerDisclaimer}</p>
      </form>
    </div>
  );
}