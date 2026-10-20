import { useState, type KeyboardEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { studio, studioHours } from '../data';
import { useLang, useT } from '../i18n';
import { homeSection } from '../paths';

export function PolicyDetails({ initialTab, hasDraft, onDelete }: {
  initialTab: 'booking' | 'privacy';
  hasDraft: boolean;
  onDelete: () => boolean;
}) {
  const t = useT();
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
      <p className="eyebrow">{t.policiesEyebrow}</p>
      <h2 id="policies-title" className="dialog-title">{t.policiesTitle[0]} <em>{t.policiesTitle[1]}</em></h2>
      <div className="info-tabs" role="tablist" aria-label={t.policiesTabs}>
        {(['booking', 'privacy'] as const).map((item) => (
          <button key={item} type="button" role="tab" id={`policy-tab-${item}`} aria-selected={tab === item} aria-controls={`policy-panel-${item}`} tabIndex={tab === item ? 0 : -1} onClick={() => setTab(item)} onKeyDown={handleTabKey} className={tab === item ? 'is-active' : ''}>
            {item === 'booking' ? t.tabBooking : t.tabPrivacy}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`policy-panel-${tab}`} aria-labelledby={`policy-tab-${tab}`} tabIndex={0} className="policy-panel">
        {tab === 'booking' ? (
          <>
            <h3>{t.beforeYouBook}</h3>
            <p>{t.beforeYouBookText}</p>
            <ul className="experience-list">{t.policyList.map((item) => <li key={item}>{item}</li>)}</ul>
            <h3>{t.aboutPlanner}</h3>
            <p>{t.aboutPlannerText}</p>
            <h3>{t.medical}</h3>
            <p>{t.medicalText}</p>
          </>
        ) : (
          <>
            <h3>{t.infoStays}</h3>
            <p>{t.infoStaysText}</p>
            <p>{t.downloadedText}</p>
            <h3>{t.external}</h3>
            <p>{t.externalText}</p>
            <h3>{t.inControl}</h3>
            <p>{t.inControlText}</p>
            <button type="button" className="button button-outline" disabled={!hasDraft} onClick={() => {
              setDeleteMessage(onDelete() ? t.deletedOk : t.deletedFail);
            }}>{hasDraft ? t.deleteSaved : t.noneSaved}</button>
            {deleteMessage && <p className="privacy-status" role="status">{deleteMessage}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export function StudioDetails({ onClose }: { onClose: () => void }) {
  const lang = useLang();
  const t = useT();
  return (
    <div className="info-dialog-content studio-dialog-content">
      <p className="eyebrow">{t.studioEyebrow}</p>
      <h2 id="studio-title" className="dialog-title">{t.studioTitle[0]} <em>{t.studioTitle[1]}</em></h2>
      <p className="dialog-intro">{t.studioIntro}</p>
      <dl className="studio-details">
        <div><dt>{t.studioAddress}</dt><dd><a href={studio.mapsHref} target="_blank" rel="noopener noreferrer">{studio.street}<br />{studio.locality}</a></dd></div>
        <div><dt>{t.openingHours}</dt><dd>{studioHours(lang).map((row) => <span key={row.days}>{row.days}: {row.time}</span>)}</dd></div>
        <div><dt>{t.phone}</dt><dd><a href={studio.phoneHref}>{studio.phone}</a></dd></div>
      </dl>
      <p className="form-note">{t.studioNote}</p>
      <a className="button button-primary" href={homeSection('services', lang)} onClick={onClose}>{t.findRitual}<ArrowUpRight size={16} /></a>
    </div>
  );
}