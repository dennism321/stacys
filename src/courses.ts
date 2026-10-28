import type { Lang } from './i18n';
import { asset } from './paths';

/** URL slug of the certification courses page (/courses/ and /es/courses/). */
export const COURSES_SLUG = 'courses';

export type CourseIcon =
  | 'stethoscope' | 'pressure' | 'anatomy' | 'transfer' | 'terminology' | 'ekg' | 'syringe' | 'professional'
  | 'tubes' | 'venipuncture' | 'biohazard' | 'tube' | 'records' | 'care';

export type Course = {
  id: string;
  name: string;
  tagline: string;
  intro: string;
  image: { src: string; alt: string; width: number; height: number };
  /** Number of virtual and in-person classes, and when they meet. */
  virtual: { count: number; day: string; time: string };
  inPerson: { count: number; day: string; time: string };
  price: number;
  deposit: number;
  learn: { icon: CourseIcon; title: string; text: string }[];
  whatsappText: string;
};

type CoursesCopy = {
  name: string;
  menuBlurb: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: [string, string];
  intro: string;
  /** Note that the classes are taught in Spanish. */
  languageNote: { title: string; text: string };
  languageTag: string;
  highlights: { title: string; text: string }[];
  certificateLead: string;
  certificate: string;
  certificateNote: string;
  sealAlt: string;
  virtualClasses: (count: number) => string;
  inPersonClasses: (count: number) => string;
  virtualText: string;
  inPersonText: string;
  totalClasses: (count: number) => string;
  totalInvestment: string;
  depositLabel: string;
  limitedSpots: string;
  secureSpot: string;
  learnTitle: (course: string) => string;
  reserve: string;
  callUs: string;
  included: string[];
  enrollEyebrow: string;
  enrollTitle: [string, string];
  enrollText: string;
  whatsapp: string;
  whatsappText: string;
  followUs: string;
  viewCourse: string;
  courses: Course[];
};

const maImage = { src: asset('images/course-medical-assistant.webp'), width: 286, height: 436 };
const phImage = { src: asset('images/course-phlebotomy.webp'), width: 250, height: 370 };

const en: CoursesCopy = {
  name: 'Certification courses',
  menuBlurb: 'Medical Assistant and Phlebotomy',
  title: "Medical Assistant & Phlebotomy Courses in Prospect, CT | Stacy's Esthetics",
  description: 'State-approved Medical Assistant ($3,500, 6 classes) and Phlebotomy ($1,500, 5 classes) certification courses in Prospect, CT. Virtual and in-person classes, $500 deposit to enroll. Taught in Spanish.',
  eyebrow: "CERTIFICATION COURSES · STACY'S ESTHETICS",
  h1: ['Your future in healthcare', 'starts here.'],
  intro: 'Train as a Medical Assistant or Phlebotomist with a certified, experienced instructor. Study from home and practice in person, and take your first step toward a stable career with purpose.',
  languageNote: { title: 'Courses are taught in Spanish', text: 'All classes, virtual and in person, are given in Spanish.' },
  languageTag: 'Taught in Spanish',
  highlights: [
    { title: 'Quality training', text: 'A certified, experienced instructor.' },
    { title: 'Flexible schedule', text: 'Study from home and in person.' },
    { title: 'A career with purpose', text: 'Help, care, and make a difference.' },
  ],
  certificateLead: 'When you finish, you receive',
  certificate: 'A state-approved certificate / license',
  certificateNote: '100% genuine.',
  sealAlt: 'National Certification Excellence seal (NPCE, est. 2009)',
  virtualClasses: (count) => `${count} virtual classes`,
  inPersonClasses: (count) => `${count} in-person classes`,
  virtualText: 'Learn from the comfort of home.',
  inPersonText: 'Hands-on practice and training in person.',
  totalClasses: (count) => `Total: ${count} classes`,
  totalInvestment: 'Total investment',
  depositLabel: 'First deposit to enroll and secure your spot',
  limitedSpots: 'Limited spots',
  secureSpot: 'Secure your place today!',
  learnTitle: (course) => `What you'll learn in the ${course} course`,
  reserve: 'Reserve your spot',
  callUs: 'Call',
  included: ['State-approved certificate, 100% genuine', 'Study materials included', 'Certified, experienced instructor', 'Ongoing support and guidance'],
  enrollEyebrow: 'LIMITED SPOTS',
  enrollTitle: ['Ready to start', 'your new career?'],
  enrollText: 'Message or call us for dates and enrollment. A $500 deposit secures your spot in either course.',
  whatsapp: 'Message us on WhatsApp',
  whatsappText: "Hi! I'd like information about your certification courses.",
  followUs: 'Follow us',
  viewCourse: 'View course',
  courses: [
    {
      id: 'medical-assistant',
      name: 'Medical Assistant',
      tagline: 'Your future in healthcare starts here.',
      intro: 'Train as a Medical Assistant and take the first step toward a stable career with purpose.',
      image: { ...maImage, alt: 'Smiling medical assistant in gray scrubs' },
      virtual: { count: 3, day: 'Mondays', time: '7:00 – 9:00 PM' },
      inPerson: { count: 3, day: 'Saturdays', time: '12:00 – 4:00 PM' },
      price: 3500,
      deposit: 500,
      learn: [
        { icon: 'stethoscope', title: 'Taking vital signs', text: 'Measure and record vital signs correctly.' },
        { icon: 'pressure', title: 'Blood pressure, step by step', text: 'The correct procedure and accurate recording.' },
        { icon: 'anatomy', title: 'Anatomy and physiology', text: 'The human body and how it works.' },
        { icon: 'transfer', title: 'Patient care and transfer', text: 'Safe techniques to assist and move patients.' },
        { icon: 'terminology', title: 'Medical terminology', text: 'The medical language used in clinics and hospitals.' },
        { icon: 'ekg', title: 'EKG (theory)', text: 'Basic interpretation and principles of the electrocardiogram.' },
        { icon: 'syringe', title: 'Phlebotomy (theory)', text: 'Blood draw fundamentals and safe handling.' },
        { icon: 'professional', title: 'Professionalism in healthcare', text: 'Ethics, communication, and empathetic patient care.' },
      ],
      whatsappText: "Hi! I'm interested in the Medical Assistant course.",
    },
    {
      id: 'phlebotomy',
      name: 'Phlebotomy',
      tagline: 'Your first step toward a career in healthcare.',
      intro: 'Learn the essential skills to become a phlebotomy professional.',
      image: { ...phImage, alt: 'Phlebotomist in purple gloves drawing blood from an arm' },
      virtual: { count: 2, day: 'Tuesdays', time: '7:00 – 9:00 PM' },
      inPerson: { count: 3, day: 'Saturdays', time: '12:00 – 4:00 PM' },
      price: 1500,
      deposit: 500,
      learn: [
        { icon: 'tubes', title: 'Phlebotomy fundamentals', text: 'The phlebotomist’s role, professional ethics, and lab safety.' },
        { icon: 'tube', title: 'Specimen and tube types', text: 'Order of draw, anticoagulants, and proper specimen handling.' },
        { icon: 'venipuncture', title: 'Venipuncture techniques', text: 'Vein selection, patient preparation, and drawing blood.' },
        { icon: 'records', title: 'Documentation and records', text: 'Labeling, chain of custody, and accurate records.' },
        { icon: 'biohazard', title: 'Infection control and prevention', text: 'Infection control, biosafety, and disposal of materials.' },
        { icon: 'care', title: 'Patient communication and care', text: 'How to give empathetic, safe, professional service.' },
      ],
      whatsappText: "Hi! I'm interested in the Phlebotomy course.",
    },
  ],
};

const es: CoursesCopy = {
  name: 'Cursos de certificación',
  menuBlurb: 'Asistente Médico y Flebotomía',
  title: "Cursos de Asistente Médico y Flebotomía en Prospect, CT | Stacy's Esthetics",
  description: 'Cursos con certificado avalado por el estado: Asistente Médico ($3,500, 6 clases) y Flebotomía ($1,500, 5 clases) en Prospect, CT. Clases virtuales y presenciales, depósito de $500 para inscribirte. Clases en español.',
  eyebrow: "CURSOS DE CERTIFICACIÓN · STACY'S ESTHETICS",
  h1: ['Tu futuro en la salud', 'comienza aquí.'],
  intro: 'Fórmate como Asistente Médico o en Flebotomía con una instructora certificada y con experiencia. Estudia desde casa, practica en persona y da el primer paso hacia una carrera estable y con propósito.',
  languageNote: { title: 'Los cursos se imparten en español', text: 'Todas las clases, virtuales y presenciales, son en español.' },
  languageTag: 'Clases en español',
  highlights: [
    { title: 'Formación de calidad', text: 'Instructora certificada y con experiencia.' },
    { title: 'Horarios flexibles', text: 'Estudia desde casa y presencial.' },
    { title: 'Una carrera con propósito', text: 'Ayuda, cuida y marca la diferencia.' },
  ],
  certificateLead: 'Al finalizar recibirás',
  certificate: 'Certificado / licencia avalados por el estado',
  certificateNote: '100% real.',
  sealAlt: 'Sello National Certification Excellence (NPCE, est. 2009)',
  virtualClasses: (count) => `${count} clases virtuales`,
  inPersonClasses: (count) => `${count} clases presenciales`,
  virtualText: 'Aprende desde la comodidad de tu hogar.',
  inPersonText: 'Prácticas y entrenamiento en persona.',
  totalClasses: (count) => `Total: ${count} clases`,
  totalInvestment: 'Inversión total',
  depositLabel: 'Primer depósito para la inscripción y asegurar tu cupo',
  limitedSpots: 'Cupos limitados',
  secureSpot: '¡Asegura tu lugar hoy!',
  learnTitle: (course) => `¿Qué aprenderás en el curso de ${course}?`,
  reserve: 'Reserva tu cupo',
  callUs: 'Llamar',
  included: ['Certificado avalado por el estado, 100% real', 'Materiales de estudio incluidos', 'Instructora certificada y con experiencia', 'Apoyo continuo y orientación'],
  enrollEyebrow: 'CUPOS LIMITADOS',
  enrollTitle: ['¿Te animas a comenzar', 'tu nueva carrera?'],
  enrollText: 'Escríbenos o llámanos para fechas e inscripción. Un depósito de $500 asegura tu cupo en cualquiera de los cursos.',
  whatsapp: 'Escríbenos por WhatsApp',
  whatsappText: '¡Hola! Quisiera información sobre los cursos de certificación.',
  followUs: 'Síguenos',
  viewCourse: 'Ver curso',
  courses: [
    {
      id: 'medical-assistant',
      name: 'Asistente Médico',
      tagline: 'Tu futuro en la salud comienza aquí.',
      intro: 'Fórmate como Asistente Médico y da el primer paso hacia una carrera estable y con propósito.',
      image: { ...maImage, alt: 'Asistente médica sonriente con uniforme gris' },
      virtual: { count: 3, day: 'Lunes', time: '7:00 – 9:00 PM' },
      inPerson: { count: 3, day: 'Sábados', time: '12:00 – 4:00 PM' },
      price: 3500,
      deposit: 500,
      learn: [
        { icon: 'stethoscope', title: 'Toma de signos vitales', text: 'Aprende a medir y registrar signos vitales correctamente.' },
        { icon: 'pressure', title: 'Toma de presión arterial paso a paso', text: 'Procedimiento correcto y registro preciso.' },
        { icon: 'anatomy', title: 'Anatomía y fisiología', text: 'Conoce el cuerpo humano y su funcionamiento básico.' },
        { icon: 'transfer', title: 'Cuidado y traslado del paciente', text: 'Técnicas seguras para asistir y movilizar pacientes.' },
        { icon: 'terminology', title: 'Terminología médica', text: 'Aprende el lenguaje médico usado en clínicas y hospitales.' },
        { icon: 'ekg', title: 'EKG (teoría)', text: 'Interpretación básica y principios del electrocardiograma.' },
        { icon: 'syringe', title: 'Flebotomía (teoría)', text: 'Fundamentos de extracción de sangre y manejo seguro.' },
        { icon: 'professional', title: 'Profesionalismo en salud', text: 'Ética, comunicación y trato empático al paciente.' },
      ],
      whatsappText: '¡Hola! Me interesa el curso de Asistente Médico.',
    },
    {
      id: 'phlebotomy',
      name: 'Flebotomía',
      tagline: 'Tu primer paso hacia una carrera en la salud.',
      intro: 'Aprende las habilidades esenciales para convertirte en un profesional de la flebotomía.',
      image: { ...phImage, alt: 'Flebotomista con guantes morados extrayendo sangre de un brazo' },
      virtual: { count: 2, day: 'Martes', time: '7:00 – 9:00 PM' },
      inPerson: { count: 3, day: 'Sábados', time: '12:00 – 4:00 PM' },
      price: 1500,
      deposit: 500,
      learn: [
        { icon: 'tubes', title: 'Fundamentos de flebotomía', text: 'Rol del flebotomista, ética profesional y seguridad en el laboratorio.' },
        { icon: 'tube', title: 'Tipos de muestras y tubos', text: 'Orden de extracción, anticoagulantes y manejo adecuado de muestras.' },
        { icon: 'venipuncture', title: 'Técnicas de venopunción', text: 'Selección de venas, preparación del paciente y extracción de sangre.' },
        { icon: 'records', title: 'Documentación y registros', text: 'Etiquetado, cadena de custodia y registros precisos.' },
        { icon: 'biohazard', title: 'Manejo y prevención de infecciones', text: 'Control de infecciones, bioseguridad y desecho de materiales.' },
        { icon: 'care', title: 'Comunicación y atención al paciente', text: 'Cómo brindar un servicio empático, seguro y profesional.' },
      ],
      whatsappText: '¡Hola! Me interesa el curso de Flebotomía.',
    },
  ],
};

export const coursesCopy = (lang: Lang) => (lang === 'es' ? es : en);

export const whatsappHref = (text: string) => `https://wa.me/19143104680?text=${encodeURIComponent(text)}`;
export const instagramHref = 'https://www.instagram.com/stacysesthetics/';
