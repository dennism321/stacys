import { ArrowRight } from 'lucide-react';
import { useT } from '../i18n';

/** Black Friday announcement, shown once per visit while the sale is on (see `promo` in data.ts). */
export default function PromoDialog({ onBook, onClose }: { onBook: () => void; onClose: () => void }) {
  const t = useT();
  return (
    <div className="promo-content">
      <p className="promo-headline">{t.promoEyebrow}</p>
      <p className="promo-dates">{t.promoDates}</p>
      <p className="promo-amount" aria-hidden="true">20<span>%</span><small>{t.promoOff}</small></p>
      <h2 id="promo-title" className="promo-title">{t.promoTitle}</h2>
      <div className="promo-eligible">
        <p className="promo-eligible-label">{t.promoEligibleLabel}</p>
        <ul>{t.promoEligible.map((name) => <li key={name}>{name}</li>)}</ul>
      </div>
      <div className="promo-actions">
        <button type="button" className="button button-primary" onClick={onBook}>{t.promoBook}<ArrowRight size={16} strokeWidth={1.5} /></button>
        <button type="button" className="promo-later" onClick={onClose}>{t.promoLater}</button>
      </div>
      <p className="promo-fine">{t.promoFine}</p>
    </div>
  );
}
