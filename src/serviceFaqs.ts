import { studio, studioHours } from './data';
import type { Lang } from './i18n';
import { startingPrice, type ServicePage } from './servicePages';

export type Faq = { question: string; answer: string };

const hoursSentence = (lang: Lang) => {
  const open = studioHours(lang).filter((row) => !/^(Closed|Cerrado)$/.test(row.time));
  return lang === 'es'
    ? `Abrimos ${open.map((row) => `${row.days.toLowerCase()} de ${row.time.replace(' – ', ' a ')}`).join(' y ')}; los domingos estamos cerrados.`
    : `We're open ${open.map((row) => `${row.days} ${row.time}`).join(' and ')}, and closed on Sunday.`;
};

/** Minutes from facts like "60 min", "Sesiones de 50 min", or "15 min per session" (add-ons excluded). */
function durations(page: ServicePage) {
  return page.groups
    .filter((group) => !group.addOn)
    .flatMap((group) => group.items.flatMap((item) => item.meta ?? []))
    .map((fact) => /(\d+)\s*min/.exec(fact)?.[1])
    .filter((value): value is string => Boolean(value))
    .map(Number);
}

function priceList(page: ServicePage, lang: Lang) {
  const or = lang === 'es' ? ' o ' : ' or ';
  return page.groups
    .filter((group) => !group.addOn)
    .flatMap((group) => group.items)
    .slice(0, 4)
    .map((item) => (item.packages ? `${item.name} (${item.packages.map((pkg) => `${pkg.label} ${pkg.price}`).join(or)})` : `${item.name} (${item.price})`))
    .join(', ');
}

/**
 * Short, factual Q&A for a service page, built from the page's own menu and the studio details.
 * Pass a page already localized for `lang`.
 */
export function serviceFaqs(page: ServicePage, lang: Lang = 'en'): Faq[] {
  const name = page.faqName;
  const from = startingPrice(page);
  const minutes = durations(page);
  const address = `${studio.street.replace(/\.$/, '')}, ${studio.locality}`;
  const faqs: Faq[] = [];

  if (from !== undefined) {
    faqs.push(lang === 'es'
      ? { question: `¿Cuánto cuesta ${name} en Stacy's Esthetics?`, answer: `Los precios empiezan en $${from}. Algunas opciones populares: ${priceList(page, lang)}. Consulta el menú completo arriba para ver todos los tratamientos y paquetes.` }
      : { question: `How much does ${name} cost at Stacy's Esthetics?`, answer: `Prices start at $${from}. Popular options include ${priceList(page, lang)}. See the full menu above for every treatment and package.` });
  }
  if (minutes.length) {
    const low = Math.min(...minutes);
    const high = Math.max(...minutes);
    faqs.push(lang === 'es'
      ? { question: `¿Cuánto dura ${name}?`, answer: low === high ? `Las sesiones duran unos ${low} minutos.` : `Las sesiones duran entre ${low} y ${high} minutos, según el tratamiento que elijas.` }
      : { question: `How long does ${name} take?`, answer: low === high ? `Sessions take about ${low} minutes.` : `Sessions take between ${low} and ${high} minutes, depending on the treatment you choose.` });
  }
  faqs.push(lang === 'es'
    ? { question: `¿Dónde puedo hacerme ${name} cerca de Prospect, CT?`, answer: `Stacy's Esthetics está en ${address}. ${hoursSentence(lang)}` }
    : { question: `Where can I get ${name} near Prospect, CT?`, answer: `Stacy's Esthetics is at ${address}. ${hoursSentence(lang)}` });
  faqs.push(lang === 'es'
    ? { question: `¿Cómo reservo ${name}?`, answer: page.squareBooking ? `Reserva en línea en cualquier momento con el botón "Reservar una cita" de esta página, o llama al ${studio.phone}.` : `Usa el botón "Reservar una cita" de esta página para planificar tu visita, o llama al ${studio.phone}.` }
    : { question: `How do I book ${name}?`, answer: page.squareBooking ? `Book online any time with the "Book an appointment" button on this page, or call ${studio.phone}.` : `Use the "Book an appointment" button on this page to plan your visit, or call ${studio.phone}.` });
  return faqs;
}
