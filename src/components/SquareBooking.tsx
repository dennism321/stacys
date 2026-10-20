import { ArrowUpRight } from 'lucide-react';
import { type ServicePage } from '../servicePages';
import { useT } from '../i18n';

type SquareService = ServicePage & { squareBooking: NonNullable<ServicePage['squareBooking']> };

/** Narrows a service page to one that books through Square. */
export const booksOnSquare = (page?: ServicePage): page is SquareService => Boolean(page?.squareBooking);

/** The Square Appointments calendar, embedded the same way Square's own embed script does, plus a new-tab fallback. */
export function SquareFrame({ page }: { page: SquareService }) {
  const t = useT();
  return (
    <>
      <iframe
        className="square-booking-frame"
        src={page.squareBooking.widgetUrl}
        title={t.squareFrameTitle(page.name)}
        allow="payment app.squareup.com"
      />
      <p className="square-booking-fallback">
        {t.squareTrouble}{' '}
        <a href={page.squareBooking.bookUrl} target="_blank" rel="noopener noreferrer">{t.squareNewTab}<ArrowUpRight size={14} strokeWidth={1.5} /></a>
      </p>
    </>
  );
}

/** Booking dialog content for a service page that books through Square. */
export default function SquareBooking({ page }: { page: SquareService }) {
  const t = useT();
  return (
    <div className="square-booking">
      <div className="square-booking-heading">
        <p className="eyebrow">{t.bookOnline}</p>
        <h2 id="square-booking-title" className="dialog-title">{t.bookYour} <em>{page.name.toLowerCase()}.</em></h2>
        <p className="dialog-intro">{t.squareIntro}</p>
      </div>
      <SquareFrame page={page} />
    </div>
  );
}
