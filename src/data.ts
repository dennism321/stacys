import { findServicePage } from './servicePages';

/** Studio contact details, as published on the studio's Wix site. Keep index.html's JSON-LD in sync. */
export const studio = {
  street: '26 Union City Rd.',
  locality: 'Prospect, CT 06712',
  phone: '914-310-4680',
  phoneHref: 'tel:+19143104680',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=26+Union+City+Rd%2C+Prospect%2C+CT+06712',
  hours: [
    { days: 'Monday – Friday', time: '9:30 am – 6:00 pm' },
    { days: 'Saturday', time: '9:30 am – 4:00 pm' },
    { days: 'Sunday', time: 'Closed' },
  ],
};

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
      "You'll find the studio at 26 Union City Rd. in Prospect, CT 06712. We're open Monday to Friday from 9:30 am to 6:00 pm and Saturday from 9:30 am to 4:00 pm, and closed on Sunday. Call 914-310-4680 with any questions before your visit.",
  },
];

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

export function formatDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}