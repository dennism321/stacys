import { ArrowUpRight } from 'lucide-react';
import { type ServicePage } from '../servicePages';

/** Square Appointments booking calendar, embedded the same way Square's own embed script does. */
export default function SquareBooking({ page }: { page: ServicePage & { squareBooking: NonNullable<ServicePage['squareBooking']> } }) {
  return (
    <div className="square-booking">
      <div className="square-booking-heading">
        <p className="eyebrow">BOOK ONLINE</p>
        <h2 id="square-booking-title" className="dialog-title">Book your <em>{page.name.toLowerCase()}.</em></h2>
        <p className="dialog-intro">Choose your treatment and a time that suits you. Booking is handled securely by Square.</p>
      </div>
      <iframe
        className="square-booking-frame"
        src={page.squareBooking.widgetUrl}
        title={`Book ${page.name} with Stacy's Esthetics on Square Appointments`}
        allow="payment app.squareup.com"
      />
      <p className="square-booking-fallback">
        Trouble seeing the calendar?{' '}
        <a href={page.squareBooking.bookUrl} target="_blank" rel="noopener noreferrer">Open booking in a new tab<ArrowUpRight size={14} strokeWidth={1.5} /></a>
      </p>
    </div>
  );
}
