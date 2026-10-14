import { useState, type KeyboardEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { studio } from '../data';
import { homeSection } from '../paths';

export function PolicyDetails({ initialTab, hasDraft, onDelete }: {
  initialTab: 'booking' | 'privacy';
  hasDraft: boolean;
  onDelete: () => boolean;
}) {
  const [tab, setTab] = useState(initialTab);
  const [deleteMessage, setDeleteMessage] = useState('');

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextTab = event.key === 'Home' ? 'booking' : event.key === 'End' ? 'privacy' : tab === 'booking' ? 'privacy' : 'booking';
    setTab(nextTab);
    document.getElementById(`policy-tab-${nextTab}`)?.focus();
  }

  return (
    <div className="info-dialog-content">
      <p className="eyebrow">CARE IN EVERY DETAIL</p>
      <h2 id="policies-title" className="dialog-title">A thoughtful <em>visit.</em></h2>
      <div className="info-tabs" role="tablist" aria-label="Studio policies">
        {(['booking', 'privacy'] as const).map((item) => (
          <button key={item} type="button" role="tab" id={`policy-tab-${item}`} aria-selected={tab === item} aria-controls={`policy-panel-${item}`} tabIndex={tab === item ? 0 : -1} onClick={() => setTab(item)} onKeyDown={handleTabKey} className={tab === item ? 'is-active' : ''}>
            {item === 'booking' ? 'Booking policies' : 'Your privacy'}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`policy-panel-${tab}`} aria-labelledby={`policy-tab-${tab}`} tabIndex={0} className="policy-panel">
        {tab === 'booking' ? (
          <>
            <h3>Before you book</h3>
            <p>The studio's business-specific policies have not yet been confirmed for this website. Please check the following directly with the studio before committing to an appointment:</p>
            <ul className="experience-list"><li>Deposits, pricing, and accepted payment methods</li><li>Cancellation and rescheduling notice periods</li><li>Late arrivals and missed appointments</li><li>Treatment eligibility and age requirements</li></ul>
            <h3>About the appointment planner</h3>
            <p>The planner creates a personal draft on your device. It does not contact the studio, reserve a time, or take a payment. All appointments, pricing, and treatment details require direct confirmation.</p>
            <h3>Medical consultations</h3>
            <p>Some treatments, such as PRP microneedling, mesotherapy, and post-op care, may need a consultation before your first session. A saved plan is not a medical consultation.</p>
          </>
        ) : (
          <>
            <h3>Your information stays with you</h3>
            <p>Your appointment details are stored in this browser's local storage only when you choose to save a plan. They are not sent to a server, emailed to the studio, or used for marketing by this website.</p>
            <p>A downloaded plan contains the details you entered. Keep it somewhere private, particularly if you use a shared device. Please do not add medical or sensitive information to the planner.</p>
            <h3>External content</h3>
            <p>Fonts load from Google Fonts. Google receives standard network information when the fonts load. This website does not add analytics or advertising cookies.</p>
            <h3>You're in control</h3>
            <p>You can remove your saved plan below or clear this site's data in your browser settings. Deleting it here will not remove a copy you have already downloaded.</p>
            <button type="button" className="button button-outline" disabled={!hasDraft} onClick={() => {
              setDeleteMessage(onDelete() ? 'Your appointment plan has been deleted from this device.' : 'Your browser could not remove the draft. Please clear this site\'s storage in your browser settings.');
            }}>{hasDraft ? 'Delete my saved appointment plan' : 'No appointment plan saved'}</button>
            {deleteMessage && <p className="privacy-status" role="status">{deleteMessage}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export function StudioDetails({ onClose }: { onClose: () => void }) {
  return (
    <div className="info-dialog-content studio-dialog-content">
      <p className="eyebrow">WE LOOK FORWARD TO WELCOMING YOU</p>
      <h2 id="studio-title" className="dialog-title">Your next place to <em>pause.</em></h2>
      <p className="dialog-intro">Find us in Prospect, Connecticut.</p>
      <dl className="studio-details">
        <div><dt>Studio address</dt><dd><a href={studio.mapsHref} target="_blank" rel="noopener noreferrer">{studio.street}<br />{studio.locality}</a></dd></div>
        <div><dt>Opening hours</dt><dd>{studio.hours.map((row) => <span key={row.days}>{row.days}: {row.time}</span>)}</dd></div>
        <div><dt>Phone</dt><dd><a href={studio.phoneHref}>{studio.phone}</a></dd></div>
      </dl>
      <p className="form-note">Please confirm your appointment with the studio before your visit. Photography on this website is illustrative.</p>
      <a className="button button-primary" href={homeSection('services')} onClick={onClose}>Find your ritual<ArrowUpRight size={16} /></a>
    </div>
  );
}