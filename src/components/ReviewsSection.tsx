import { ArrowUpRight, Star } from 'lucide-react';
import { googleReviews } from '../data';
import Reveal from './Reveal';

function Stars({ size = 15 }: { size?: number }) {
  return (
    <span className="review-stars" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => <Star key={index} size={size} strokeWidth={0} fill="currentColor" />)}
    </span>
  );
}

/** "What our customers say": the Google rating plus short summaries of standout reviews. */
export default function ReviewsSection() {
  const { rating, count, url, highlights } = googleReviews;

  return (
    <section id="reviews" className="reviews-section section-space" aria-labelledby="reviews-title">
      <div className="page-width">
        <Reveal className="section-heading centered">
          <p className="eyebrow">KIND WORDS</p>
          <h2 id="reviews-title" className="section-title">What our customers <em>say about us</em></h2>
          <span className="heading-rule" aria-hidden="true" />
        </Reveal>

        <Reveal className="reviews-summary">
          <span className="reviews-score">{rating.toFixed(1)}</span>
          <span className="reviews-summary-copy">
            <Stars size={18} />
            <span>Rated {rating.toFixed(1)} out of 5 from {count} Google reviews</span>
          </span>
        </Reveal>

        <ul className="reviews-grid">
          {highlights.map((review, index) => (
            <li key={review.name} className="review-card-wrap">
              <Reveal className="review-card" delay={(index % 3) * 0.07}>
                <Stars />
                <p className="review-summary">{review.summary}</p>
                <p className="review-byline"><span className="review-name">{review.name}</span><span className="review-service">{review.service}</span></p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="reviews-footer">
          <a className="button button-outline" href={url} target="_blank" rel="noopener noreferrer">Read all {count} reviews on Google<ArrowUpRight size={16} strokeWidth={1.5} /></a>
          <p className="reviews-note">Highlights are short summaries of verified Google reviews. Reviewers are shown by first name.</p>
        </Reveal>
      </div>
    </section>
  );
}
