import { studio } from './data';
import { startingPrice, type ServicePage } from './servicePages';

export type Faq = { question: string; answer: string };

const hoursSentence = () =>
  `We're open ${studio.hours.filter((row) => row.time !== 'Closed').map((row) => `${row.days} ${row.time}`).join(' and ')}, and closed on Sunday.`;

/** Minutes from facts like "60 min", "50 min sessions", or "15 min per session" (add-ons excluded). */
function durations(page: ServicePage) {
  return page.groups
    .filter((group) => !group.addOn)
    .flatMap((group) => group.items.flatMap((item) => item.meta ?? []))
    .map((fact) => /^(\d+)\s*min/.exec(fact)?.[1])
    .filter((value): value is string => Boolean(value))
    .map(Number);
}

function priceList(page: ServicePage) {
  return page.groups
    .filter((group) => !group.addOn)
    .flatMap((group) => group.items)
    .slice(0, 4)
    .map((item) =>
      item.packages
        ? `${item.name} (${item.packages.map((pkg) => `${pkg.label} ${pkg.price}`).join(' or ')})`
        : `${item.name} (${item.price})`
    )
    .join(', ');
}

/** Short, factual Q&A for a service page, built from the page's own menu and the studio details. */
export function serviceFaqs(page: ServicePage): Faq[] {
  const name = page.faqName;
  const from = startingPrice(page);
  const minutes = durations(page);
  const faqs: Faq[] = [];

  if (from !== undefined) {
    faqs.push({
      question: `How much does ${name} cost at Stacy's Esthetics?`,
      answer: `Prices start at $${from}. Popular options include ${priceList(page)}. See the full menu above for every treatment and package.`,
    });
  }
  if (minutes.length) {
    const low = Math.min(...minutes);
    const high = Math.max(...minutes);
    faqs.push({
      question: `How long does ${name} take?`,
      answer: low === high ? `Sessions take about ${low} minutes.` : `Sessions take between ${low} and ${high} minutes, depending on the treatment you choose.`,
    });
  }
  faqs.push({
    question: `Where can I get ${name} near Prospect, CT?`,
    answer: `Stacy's Esthetics is at ${studio.street.replace(/\.$/, '')}, ${studio.locality}. ${hoursSentence()}`,
  });
  faqs.push({
    question: `How do I book ${name}?`,
    answer: page.squareBooking
      ? `Book online any time with the "Book an appointment" button on this page, or call ${studio.phone}.`
      : `Use the "Book an appointment" button on this page to plan your visit, or call ${studio.phone}.`,
  });
  return faqs;
}
