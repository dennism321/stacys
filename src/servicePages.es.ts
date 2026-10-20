/**
 * Spanish text for each service page. Groups, items, and packages are listed in the same order as in
 * servicePages.ts; prices, booking links, and photos come from the English page. Signature treatment and
 * package names (Divine Facial, Hourglass…) are kept as brand names.
 */
type EsItem = { name: string; meta?: string[]; price?: string; description?: string; packages?: { label: string; note?: string }[] };
export type EsPage = {
  name: string;
  faqName: string;
  blurb: string;
  title: string;
  description: string;
  h1: string;
  tagline: string;
  intro: string[];
  imageAlt?: string;
  tile: { alt: string; caption: string };
  groups: { title: string; intro?: string; items: EsItem[] }[];
  notes?: string[];
};

export const servicePagesEs: Record<string, EsPage> = {
  massage: {
    name: 'Masajes',
    faqName: 'un masaje',
    blurb: 'Sueco, de tejido profundo y de alivio localizado',
    title: "Masajes en Prospect, CT | Stacy's Esthetics",
    description: 'Masaje sueco, de tejido profundo y de alivio localizado en Prospect, CT, desde $45. Añade piedras calientes, exfoliación corporal o un facial de espalda.',
    h1: 'Masajes',
    tagline: 'Relájate, libera la tensión y recupera el equilibrio.',
    intro: [
      "Ya sea que necesites una hora de calma o un trabajo firme y enfocado en las zonas donde acumulas estrés, cada masaje en Stacy's Esthetics empieza con una breve conversación sobre cómo te sientes y qué necesitas hoy.",
      'Elige una sesión completa de 60 minutos o un masaje de alivio localizado de 30 minutos, y personalízalo con piedras calientes, exfoliación corporal o un facial de espalda.',
    ],
    imageAlt: 'Una terapeuta masajeando suavemente una espalda en un ambiente de spa cálido y tranquilo',
    tile: { alt: 'Una terapeuta masajeando suavemente una espalda en un ambiente de spa cálido y tranquilo', caption: 'Suelta el día. Vuelve a ti.' },
    groups: [
      {
        title: 'Masajes',
        items: [
          { name: 'Masaje sueco', description: 'Tómate un descanso del estrés con una presión suave y relajante. Relaja tu cuerpo y recarga energía.' },
          { name: 'Masaje de tejido profundo', description: '¿Acumulas tensión en el cuello, los hombros o la espalda? Una presión firme y enfocada ayuda a liberar los nudos musculares profundos.' },
          { name: 'Masaje de alivio localizado', description: 'Regálate un momento para ti. Elige dos zonas: espalda, hombros, brazos, manos, cuello, piernas o pies.' },
        ],
      },
      {
        title: 'Complementos para tu masaje',
        intro: 'Añádelos a cualquier masaje.',
        items: [
          { name: 'Piedras calientes', meta: ['Añade 15 min'], description: 'Déjate llevar por la relajación con un calor reconfortante.' },
          { name: 'Exfoliación corporal completa', description: 'Una exfoliación suave elimina las células muertas para una piel más suave y tersa.' },
          { name: 'Facial de espalda completo', description: 'Exfoliación química, vapor y extracciones para destapar los poros y revelar una piel más lisa.' },
        ],
      },
    ],
  },
  facials: {
    name: 'Faciales',
    faqName: 'un facial',
    blurb: 'Faciales personalizados y microagujas',
    title: "Faciales y microagujas en Prospect, CT | Stacy's Esthetics",
    description: 'Faciales personalizados para piel seca, grasa, con acné y adolescente, además de faciales con microagujas con PRP y PDRN en Prospect, CT. Desde $85.',
    h1: 'Faciales',
    tagline: 'Cuidado de la piel personalizado para cada tipo de piel.',
    intro: [
      'Cada facial se adapta a tu piel tal como está hoy: hidratación profunda para la piel seca, una limpieza a fondo para la piel grasa o con acné, o primeros faciales suaves para adolescentes.',
      'Para una renovación más profunda, nuestros faciales avanzados con microagujas combinan la inducción de colágeno con PRP o PDRN. Termina cualquier facial con una mascarilla hidratante o un peeling químico específico.',
    ],
    imageAlt: 'Una mujer relajada mientras le aplican con brocha una mascarilla facial cremosa',
    tile: { alt: 'Una mujer relajada mientras le aplican con brocha una mascarilla facial cremosa', caption: 'Tu piel, bellamente renovada.' },
    groups: [
      {
        title: 'Faciales',
        items: [
          { name: 'Divine Facial', meta: ['60 min', 'Piel normal a seca'], description: 'Exfoliación, vapor, extracciones solo en la zona de la nariz (si es necesario), hidratación y un relajante masaje facial para una piel suave y luminosa.' },
          { name: 'Be Kind to Yourself Facial', meta: ['75 min', 'Piel grasa o con tendencia al acné'], description: 'Limpieza profunda, doble exfoliación, extracciones en todo el rostro y tratamiento de alta frecuencia.' },
          { name: 'Facial para adolescentes', meta: ['45 min', 'De 13 a 17 años'], description: 'Cuidado suave para piel grasa, poros obstruidos o brotes leves. Incluye limpieza, exfoliación suave, extracciones si es necesario y una mascarilla hidratante calmante.' },
        ],
      },
      {
        title: 'Faciales avanzados con microagujas',
        items: [
          { name: 'Facial con PRP y microagujas', description: 'Usa tu propio plasma rico en plaquetas para ayudar a estimular el colágeno y mejorar la firmeza, la textura y las líneas finas. Incluye limpieza facial y mascarillas de hidratación profunda.' },
          { name: 'Facial con PDRN y microagujas', description: 'El PDRN derivado del salmón ayuda a mejorar el aspecto de las manchas oscuras y el tono desigual. Incluye limpieza e hidratación para un cutis renovado y radiante.' },
        ],
      },
      {
        title: 'Complementos faciales',
        items: [
          { name: 'Mascarilla hidroplástica hidratante personalizada', meta: ['Añade 15 min'] },
          { name: 'Peeling químico para refinar la textura', meta: ['Añade 15 min'] },
          { name: 'Peeling químico para el acné', meta: ['Añade 15 min'] },
          { name: 'Peeling químico iluminador para manchas', meta: ['Añade 20 min'] },
        ],
      },
    ],
  },
  'head-spa': {
    name: 'Head Spa y Detox',
    faqName: 'un head spa',
    blurb: 'Rituales de head spa, sauna y detox',
    title: "Head spa en Prospect, CT | Stacy's Esthetics",
    description: 'Head spa estilo japonés en Prospect, CT: un ritual de 50 minutos desde $99 o 70 minutos con hidratación profunda. Además, un paquete detox con manta sauna.',
    h1: 'Head Spa y Detox',
    tagline: 'Reinicia, relájate y renuévate de pies a cabeza.',
    intro: [
      'Nuestro head spa es un ritual lento y sensorial para el cuero cabelludo: el agua tibia fluye por tu cabello bajo el halo mientras unas manos suaves limpian, masajean y liberan la tensión que ni sabías que tenías.',
      'Elige el head spa de 50 minutos o amplíalo con hidratación profunda para un cabello tan renovado como tú. Para un reinicio completo, el paquete detox combina sesiones de manta sauna, masaje linfático y exfoliación.',
    ],
    imageAlt: "Un ritual de head spa con agua en Stacy's Esthetics: el agua fluye por el cabello bajo un halo",
    tile: { alt: 'Una mujer disfrutando de un suave masaje del cuero cabelludo y un lavado de cabello en un head spa', caption: 'Una mente clara empieza por la cabeza.' },
    groups: [
      {
        title: 'Head spa',
        items: [
          { name: 'Head Spa' },
          { name: 'Head Spa con hidratación profunda' },
        ],
      },
      {
        title: 'Detox',
        items: [
          { name: 'Paquete Detox', meta: ['9 sesiones', '30–60 min cada una'], description: '5 sesiones de manta sauna, 3 masajes linfáticos manuales de cuerpo completo y 1 exfoliación corporal completa.' },
        ],
      },
    ],
  },
  'body-contouring': {
    name: 'Moldeo corporal',
    faqName: 'el moldeo corporal',
    blurb: 'Paquetes de moldeo y mesoterapia',
    title: "Moldeo corporal en Prospect, CT | Stacy's Esthetics",
    description: 'Moldeo corporal no invasivo en Prospect, CT: paquetes de maderoterapia, cavitación, radiofrecuencia y lipoláser para cintura, glúteos, brazos y papada.',
    h1: 'Moldeo y escultura corporal',
    tagline: 'Tratamientos no invasivos para moldear, tonificar y definir.',
    intro: [
      'Nuestros paquetes de moldeo combinan tecnología de contorno corporal con técnicas manuales como la maderoterapia, para que cada sesión trabaje en tus objetivos para el abdomen y la cintura, las piernas y los glúteos, los brazos o la papada y la línea de la mandíbula.',
      'Los resultados se logran a lo largo de varias sesiones, por eso cada tratamiento se ofrece como paquete. En tu primera visita hablaremos de tus objetivos y del paquete que mejor te va.',
    ],
    imageAlt: 'Una terapeuta moldeando la pierna con un rodillo de madera durante una sesión de maderoterapia',
    tile: { alt: 'Una terapeuta moldeando la pierna con un rodillo de madera durante una sesión de maderoterapia', caption: 'Moldea, tonifica y define.' },
    groups: [
      {
        title: 'Paquetes de moldeo',
        items: [
          {
            name: 'Paquete Hourglass', meta: ['Sesiones de 50 min'],
            description: 'Moldea tu silueta y realza tus curvas naturales con un moldeo enfocado en el abdomen, los costados y la espalda. Combina maderoterapia, cavitación, radiofrecuencia, lipoláser y terapia de luz roja.',
            packages: [{ label: '6 sesiones' }, { label: '10 sesiones', note: 'Incluye 1 sesión de manta sauna gratis' }],
          },
          {
            name: 'Paquete Perfect Peach', meta: ['Sesiones de 45 min'],
            description: 'Moldea tus piernas, realza tus glúteos y reduce el aspecto de la celulitis con aparatología corporal, masaje manual y maderoterapia.',
            packages: [{ label: '6 sesiones' }, { label: '10 sesiones' }],
          },
          {
            name: 'Brazos estilizados', meta: ['Sesiones de 35 min'],
            description: 'Moldeo enfocado para unos brazos de aspecto más esculpido, con aparatología y maderoterapia.',
            packages: [{ label: '6 sesiones' }, { label: '10 sesiones' }],
          },
          { name: 'Paquete de papada', meta: ['Sesiones de 30 min', '7 sesiones'], description: 'Define la papada y la línea de la mandíbula con 5 sesiones de radiofrecuencia y maderoterapia, más 2 sesiones de mesoterapia que actúan sobre la grasa localizada y mejoran la firmeza de la piel.' },
        ],
      },
      {
        title: 'Mesoterapia',
        items: [
          { name: 'Quemagrasa', price: 'Desde $70' },
          { name: 'Reafirmante', price: 'Desde $70' },
          { name: 'Hidrolipoclasia' },
        ],
      },
    ],
  },
  'post-op-recovery': {
    name: 'Recuperación postoperatoria',
    faqName: 'el drenaje linfático postoperatorio',
    blurb: 'Drenaje linfático después de la cirugía',
    title: "Drenaje linfático postoperatorio en Prospect, CT | Stacy's Esthetics",
    description: 'Recuperación postoperatoria en Prospect, CT: masaje de drenaje linfático manual después de la cirugía, con ultrasonido y terapia de luz LED. Sesiones individuales y paquetes.',
    h1: 'Recuperación postoperatoria',
    tagline: 'Cuidado suave y especializado para apoyar tu recuperación después de la cirugía.',
    intro: [
      'Después de una cirugía estética, como una liposucción o una abdominoplastia, el drenaje linfático manual suave ayuda a reducir la inflamación y la acumulación de líquido mientras tu cuerpo sana.',
      'Elige un paquete de recuperación de 10 sesiones para las primeras semanas después de la cirugía, una sesión individual o un paquete enfocado en los brazos. Sigue siempre las indicaciones de tu cirujano y, al reservar, cuéntanos la fecha de tu procedimiento y cualquier instrucción.',
    ],
    imageAlt: 'Una terapeuta masajeando suavemente el brazo de una clienta sobre sábanas color crema',
    tile: { alt: 'Una terapeuta masajeando suavemente el brazo de una clienta sobre sábanas color crema', caption: 'Cuidado suave para tu recuperación.' },
    groups: [
      {
        title: 'Cuidados de recuperación',
        items: [
          { name: 'Paquete de recuperación postoperatoria', meta: ['10 sesiones', '60 min cada una'], description: 'Para pacientes dentro de las primeras 6 semanas después de la cirugía. El drenaje linfático manual suave reduce la inflamación y la acumulación de líquido, combinado con ultrasonido y terapia de luz LED. La limpieza de heridas y el retiro de drenajes se realizan cuando es necesario, con autorización del cirujano y atención médica calificada.' },
          { name: 'Drenaje linfático postoperatorio individual', description: 'Masaje de drenaje linfático manual, además de extracción de líquido y limpieza de heridas si es necesario.' },
          {
            name: 'Masaje postoperatorio de brazos', meta: ['Sesiones de 35 min'],
            description: 'Masaje linfático manual con ultrasonido, además de extracción de líquido si es necesario.',
            packages: [{ label: '6 sesiones' }, { label: '10 sesiones' }],
          },
        ],
      },
    ],
    notes: ['La limpieza de heridas, la extracción de líquido y el retiro de drenajes solo se realizan cuando es necesario, con autorización de tu cirujano y atención médica calificada.'],
  },
  'laser-hair-removal': {
    name: 'Depilación láser',
    faqName: 'la depilación láser',
    blurb: 'Resultados suaves y duraderos',
    title: "Depilación láser en Prospect, CT | Stacy's Esthetics",
    description: 'Paquetes de depilación láser en Prospect, CT para labio superior, rostro completo, abdomen, bikini y piernas completas.',
    h1: 'Depilación láser',
    tagline: 'Resultados suaves y duraderos.',
    intro: [
      'La depilación láser funciona de forma gradual, tratando el vello en su fase de crecimiento a lo largo de varias sesiones; por eso la mayoría de las zonas tienen precio de paquete, con el número de sesiones incluido.',
      'En tu primera cita revisaremos tu tipo de piel y de vello y te explicaremos cómo prepararte.',
    ],
    imageAlt: 'Una cosmetóloga realizando depilación láser en la pierna de una clienta en un spa cálido',
    tile: { alt: 'Una cosmetóloga realizando depilación láser en la pierna de una clienta en un spa cálido', caption: 'Una piel suave que perdura.' },
    groups: [
      {
        title: 'Paquetes de tratamiento',
        items: [
          { name: 'Labio superior', meta: ['7 sesiones', '15 min por sesión'] },
          { name: 'Rostro completo', meta: ['7 sesiones', '15 min por sesión'] },
          { name: 'Abdomen completo', meta: ['30 min por sesión'] },
          { name: 'Bikini', meta: ['12 sesiones', '30 min por sesión'] },
          { name: 'Piernas completas', meta: ['12 sesiones', '45 min por sesión'] },
        ],
      },
    ],
  },
  waxing: {
    name: 'Depilación con cera',
    faqName: 'la depilación con cera',
    blurb: 'Cejas, axilas, brasileño y piernas',
    title: "Depilación con cera en Prospect, CT | Stacy's Esthetics",
    description: 'Depilación con cera en Prospect, CT: cejas $10, axilas $20, brasileño completo $60 y pierna completa $75. Rápida, cómoda y minuciosa.',
    h1: 'Depilación con cera',
    tagline: 'Rápida, cómoda y minuciosa.',
    intro: ['Desde un arreglo de cejas de 10 minutos hasta un brasileño completo, cada servicio de depilación con cera se hace cuidando tu comodidad y tu piel.'],
    imageAlt: 'Una banda de cera alisada sobre una pierna con luz natural suave',
    tile: { alt: 'Una banda de cera alisada sobre una pierna con luz natural suave', caption: 'Piel suave en solo minutos.' },
    groups: [
      {
        title: 'Servicios de depilación con cera',
        items: [{ name: 'Cejas' }, { name: 'Axilas' }, { name: 'Brasileño completo' }, { name: 'Pierna completa' }],
      },
    ],
  },
};
