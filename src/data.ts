export type ServiceId = 'facials' | 'massage' | 'lips' | 'head-spa';

export type Service = {
  id: ServiceId;
  name: string;
  eyebrow: string;
  caption: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  experience: string[];
  note: string;
};

export const services: Service[] = [
  {
    id: 'facials',
    name: 'Facials',
    eyebrow: 'SKIN, REIMAGINED',
    caption: 'Your skin, beautifully refreshed.',
    title: 'A fresh start for your skin.',
    description:
      'A moment to reset, with your skin at the center. Explore a facial ritual that pairs thoughtful skincare with the simple pleasure of being cared for.',
    image: 'images/facial.jpg',
    alt: 'A woman relaxing as a creamy facial mask is gently applied with a brush',
    experience: [
      'A conversation about your skin and goals',
      'Cleansing and care suited to your skin',
      'A soothing, nourishing finish',
    ],
    note: 'Your treatment, duration, and pricing are confirmed with the studio before your visit.',
  },
  {
    id: 'massage',
    name: 'Massage',
    eyebrow: 'BODY, AT EASE',
    caption: 'Release the day. Return to yourself.',
    title: 'Let the outside world wait.',
    description:
      'Trade the everyday rush for a slower rhythm. A restorative massage experience creates space to relax, unwind, and reconnect with your body.',
    image:
      'images/massage.jpg',
    alt: 'A therapist gently massaging a back in a warm, peaceful spa setting',
    experience: [
      'Time to discuss your comfort and preferences',
      'An approach tailored to your needs',
      'An unhurried moment of relaxation',
    ],
    note: 'Please discuss suitability with your provider. Treatment options, duration, and pricing are confirmed by the studio.',
  },
  {
    id: 'lips',
    name: 'Lip Injections',
    eyebrow: 'BEAUTY, IN BALANCE',
    caption: 'Subtle definition. Naturally you.',
    title: 'A little definition. Still you.',
    description:
      'A considered, consultation-first approach to lip enhancement. Explore your goals, natural proportions, and options with an appropriately licensed medical provider.',
    image: 'images/lips.jpg',
    alt: 'An editorial close-up of natural, softly defined lips in warm light',
    experience: [
      'A consultation before any treatment decision',
      'An assessment of suitability and expectations',
      'A discussion of risks, alternatives, and aftercare',
    ],
    note: 'Lip injections are a medical procedure with risks, including rare serious complications. A licensed medical provider must assess suitability and obtain informed consent. Results vary. A consultation does not guarantee treatment.',
  },
  {
    id: 'head-spa',
    name: 'Head Spa',
    eyebrow: 'A QUIETER STATE OF MIND',
    caption: 'A clear mind starts at the crown.',
    title: 'Clear your head. Find your calm.',
    description:
      'A little less noise. A little more stillness. Discover a sensory scalp-care ritual that invites you to switch off and enjoy a deeply relaxing pause.',
    image: 'images/head-spa.jpg',
    alt: 'A woman enjoying a gentle scalp massage and hair wash at a head spa',
    experience: [
      'A conversation about your scalp and hair',
      'Gentle cleansing and scalp-focused care',
      'A soothing massage and time to unwind',
    ],
    note: 'The studio will confirm the ritual, duration, pricing, and any preparation before your visit.',
  },
];

export const faqs = [
  {
    question: 'Which treatment is right for me?',
    answer:
      'Start with what you need most: skin-focused care, time to unwind, a lip consultation, or a soothing scalp ritual. Explore each treatment above, then use the appointment planner to note your preference. Your provider should help confirm the right fit before treatment.',
  },
  {
    question: 'What should I know before my first visit?',
    answer:
      'Ask your provider about preparation, timing, and aftercare for your chosen treatment. Share any relevant health concerns privately with your provider, rather than through the online planner. Treatment details and pricing should be confirmed before your visit.',
  },
  {
    question: 'Do lip injections require a consultation?',
    answer:
      'Yes. Lip injections are a medical procedure. An appropriately licensed medical provider must assess your suitability, discuss expected outcomes, risks and alternatives, and obtain informed consent before any treatment. An appointment preference is not medical clearance.',
  },
  {
    question: 'What are your booking and cancellation policies?',
    answer:
      'The studio\'s deposit, cancellation, rescheduling, and late-arrival policies are awaiting confirmation. Please request the final terms directly from the studio before booking. The appointment planner on this site saves a draft only; it sends no request and takes no payment.',
  },
  {
    question: 'Where is the studio located?',
    answer:
      'The studio address, contact details, and opening hours are being confirmed and are not yet published here. Please verify your location and appointment directly with the studio before making travel plans.',
  },
];

export type AppointmentDraft = {
  version: 1;
  serviceId: ServiceId;
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
    const textFields = ['date', 'time', 'name', 'email', 'phone', 'notes', 'savedAt'] as const;
    if (
      draft.version !== 1 ||
      !services.some((service) => service.id === draft.serviceId) ||
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

export function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}