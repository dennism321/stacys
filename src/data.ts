import { findServicePage } from './servicePages';
import type { Lang } from './i18n';

/** Studio contact details, as published on the studio's Wix site. Keep index.html's JSON-LD in sync. */
export const studio = {
  street: '26 Union City Rd.',
  locality: 'Prospect, CT 06712',
  phone: '914-310-4680',
  phoneHref: 'tel:+19143104680',
  giftCardHref: 'https://app.squareup.com/gift/ML0E36V8C7E1E/order',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=26+Union+City+Rd%2C+Prospect%2C+CT+06712',
  hours: [
    { days: 'Monday – Friday', time: '9:30 am – 6:00 pm' },
    { days: 'Saturday', time: '9:30 am – 4:00 pm' },
    { days: 'Sunday', time: 'Closed' },
  ],
};

const hoursEs = [
  { days: 'Lunes a viernes', time: '9:30 am – 6:00 pm' },
  { days: 'Sábado', time: '9:30 am – 4:00 pm' },
  { days: 'Domingo', time: 'Cerrado' },
];

/** Opening hours with day names in the given language. */
export const studioHours = (lang: Lang) => (lang === 'es' ? hoursEs : studio.hours);

/**
 * Google rating and highlights from the studio's Google reviews. The highlights are short summaries
 * in our own words, not quotes; reviewers are shown by first name only. Update the count as reviews grow.
 */
export const googleReviews = {
  rating: 5.0,
  count: 33,
  url: 'https://maps.google.com/?cid=1480761830549486181',
  highlights: [
    { name: 'Edili', service: 'Treatments with Stacy', summary: "The best place ever visited: Stacy's professionalism and attention went beyond every expectation, at very affordable prices." },
    { name: 'Yasmin', service: 'Esthetician care', summary: 'Exceptional, attentive service that left her relaxed and fully informed, and in her view the best in Connecticut.' },
    { name: 'Virginia', service: 'Facials & massage', summary: 'Facials that renewed her skin and wonderfully relaxing massages. She highly recommends the studio.' },
    { name: 'Yajaira', service: 'Returning client', summary: 'A favorite place she keeps coming back to, for consistently excellent service and real expertise.' },
    { name: 'Toan', service: 'Studio visit', summary: 'An amazing studio that is spotless and thoroughly professional.' },
  ],
};

const highlightsEs = [
  { name: 'Edili', service: 'Tratamientos con Stacy', summary: 'El mejor lugar que ha visitado: el profesionalismo y la atención de Stacy superaron todas sus expectativas, con precios muy accesibles.' },
  { name: 'Yasmin', service: 'Atención de la esteticista', summary: 'Un servicio excepcional y atento que la dejó relajada y bien informada; en su opinión, el mejor de Connecticut.' },
  { name: 'Virginia', service: 'Faciales y masajes', summary: 'Faciales que renovaron su piel y masajes maravillosamente relajantes. Recomienda el estudio sin dudar.' },
  { name: 'Yajaira', service: 'Clienta habitual', summary: 'Un lugar favorito al que siempre vuelve, por un servicio excelente y constante y una verdadera experiencia profesional.' },
  { name: 'Toan', service: 'Visita al estudio', summary: 'Un estudio increíble, impecable y totalmente profesional.' },
];

/** Review highlights in the given language. */
export const reviewHighlights = (lang: Lang) => (lang === 'es' ? highlightsEs : googleReviews.highlights);

export const faqsEn = [
  {
    question: 'Which treatment is right for me?',
    answer:
      'Start with what you need most: skin-focused care, time to unwind, body sculpting, or a soothing scalp ritual. Explore each treatment above, then book online or call us, and your provider will help confirm the right fit before treatment.',
  },
  {
    question: 'What should I know before my first visit?',
    answer:
      'Ask your provider about preparation, timing, and aftercare for your chosen treatment. Share any relevant health concerns privately with your provider, rather than through the online planner. Treatment details and pricing should be confirmed before your visit.',
  },
  {
    question: 'What are your booking and cancellation policies?',
    answer:
      'The studio\'s deposit, cancellation, rescheduling, and late-arrival policies are awaiting confirmation. Please request the final terms directly from the studio before booking. The appointment planner on this site saves a draft only; it sends no request and takes no payment.',
  },
  {
    question: 'Where is the studio located?',
    answer:
      "You'll find the studio at 26 Union City Rd. in Prospect, CT 06712. We're open Monday to Friday from 9:30 am to 6:00 pm and Saturday from 9:30 am to 4:00 pm, and closed on Sunday. Call 914-310-4680 with any questions before your visit.",
  },
];

const faqsEs = [
  {
    question: '¿Qué tratamiento es el adecuado para mí?',
    answer:
      'Empieza por lo que más necesitas: cuidado de la piel, tiempo para relajarte, moldeo corporal o un ritual calmante para el cuero cabelludo. Explora cada tratamiento arriba y luego reserva en línea o llámanos; tu especialista te ayudará a confirmar la mejor opción antes del tratamiento.',
  },
  {
    question: '¿Qué debo saber antes de mi primera visita?',
    answer:
      'Pregunta a tu especialista sobre la preparación, los tiempos y los cuidados posteriores del tratamiento que elegiste. Comparte cualquier tema de salud relevante en privado con tu especialista, no a través del planificador en línea. Confirma los detalles y precios del tratamiento antes de tu visita.',
  },
  {
    question: '¿Cuáles son sus políticas de reserva y cancelación?',
    answer:
      'Las políticas de depósito, cancelación, reprogramación y llegadas tarde del estudio están pendientes de confirmación. Solicita las condiciones finales directamente al estudio antes de reservar. El planificador de citas de este sitio solo guarda un borrador: no envía ninguna solicitud ni cobra nada.',
  },
  {
    question: '¿Dónde está el estudio?',
    answer:
      'El estudio está en 26 Union City Rd., Prospect, CT 06712. Abrimos de lunes a viernes de 9:30 am a 6:00 pm y los sábados de 9:30 am a 4:00 pm; los domingos estamos cerrados. Llama al 914-310-4680 si tienes preguntas antes de tu visita.',
  },
];

/** Home page FAQs in the given language. */
export const faqsFor = (lang: Lang) => (lang === 'es' ? faqsEs : faqsEn);

/** English FAQs, kept under the old name for the build script and structured data. */
export const faqs = faqsEn;

export type AppointmentDraft = {
  version: 1;
  /** A service page slug, e.g. "facials". */
  serviceId: string;
  /** The specific treatment chosen, or "" when not decided yet. */
  treatment: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  savedAt: string;
};

export const DRAFT_KEY = 'stacys-esthetics-appointment-v1';

export function readDraft(): AppointmentDraft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw) as Partial<AppointmentDraft>;
    draft.treatment ??= ''; // Drafts saved before the treatment field existed.
    const textFields = ['treatment', 'date', 'time', 'name', 'email', 'phone', 'notes', 'savedAt'] as const;
    if (
      draft.version !== 1 ||
      !findServicePage(draft.serviceId || '') ||
      !textFields.every((field) => typeof draft[field] === 'string') ||
      !/^\d{4}-\d{2}-\d{2}$/.test(draft.date || '') ||
      !['Morning', 'Afternoon', 'No preference'].includes(draft.time || '')
    ) {
      return null;
    }
    const parsedDate = new Date(`${draft.date}T12:00:00`);
    if (
      Number.isNaN(parsedDate.getTime()) ||
      localDateString(parsedDate) !== draft.date ||
      !draft.name?.trim() ||
      !draft.email?.trim()
    ) {
      return null;
    }
    return draft as AppointmentDraft;
  } catch {
    return null;
  }
}

export function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDate(date: string, locale = 'en-US') {
  return new Date(`${date}T12:00:00`).toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}