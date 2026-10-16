import { asset } from './paths';

/** A single price, a [min, max] range, or nothing when the menu gives no price. */
export type Amount = number | [number, number];

export type MenuItem = {
  name: string;
  /** Short facts shown under the name, e.g. "60 min" or "Normal to dry skin". Durations marked "estimated" were not on the studio's list; confirm with Stacy. */
  meta?: string[];
  price?: string;
  amount?: Amount;
  /** The amount is a starting price ("From $70"). */
  priceFrom?: boolean;
  description?: string;
  packages?: { label: string; price: string; amount: number; note?: string }[];
};

/** `addOn` groups can only be added to another treatment, so they're left out of starting prices and the booking list. */
export type MenuGroup = { title: string; intro?: string; items: MenuItem[]; compact?: boolean; addOn?: boolean };

export type ServicePage = {
  slug: string;
  /** Name in menus and breadcrumbs. */
  name: string;
  /** One line for the header dropdown. */
  blurb: string;
  /** Search result title and description. */
  title: string;
  description: string;
  h1: string;
  tagline: string;
  intro: string[];
  image?: { src: string; alt: string };
  /** Book through the studio's Square Appointments page instead of the on-site planner. */
  squareBooking?: { widgetUrl: string; bookUrl: string };
  /** The home page tile: photo, alt text, and a one-line caption. */
  tile: { src: string; alt: string; caption: string };
  groups: MenuGroup[];
  notes?: string[];
  related: string[];
};

export const servicePages: ServicePage[] = [
  {
    slug: 'massage',
    squareBooking: {
      // From the studio's Square Appointments embed code (widget ilht6vhelju99k, location L2A59ABR9VW2A).
      widgetUrl: 'https://app.squareup.com/appointments/buyer/widget/ilht6vhelju99k/L2A59ABR9VW2A',
      bookUrl: 'https://app.squareup.com/appointments/book/ilht6vhelju99k/L2A59ABR9VW2A/start',
    },
    tile: { src: asset('images/massage.webp'), alt: "A therapist gently massaging a back in a warm, peaceful spa setting", caption: 'Release the day. Return to yourself.' },
    name: 'Massage Therapy',
    blurb: 'Swedish, deep tissue, and focused relief',
    title: "Massage Therapy in Prospect, CT | Stacy's Esthetics",
    description: 'Swedish, deep tissue, and focused relief massage in Prospect, CT, from $45. Add hot stones, a full body scrub, or a back facial.',
    h1: 'Massage Therapy',
    tagline: 'Unwind, release tension, and restore balance.',
    intro: [
      'Whether you need an hour of gentle stillness or firm, focused work on the places you carry stress, every massage at Stacy\'s Esthetics starts with a short conversation about how you feel and what you need today.',
      'Choose a full 60-minute session or a 30-minute focused relief massage, then make it your own with warm stones, a full body scrub, or a back facial.',
    ],
    image: { src: asset('images/massage.webp'), alt: 'A therapist gently massaging a back in a warm, peaceful spa setting' },
    groups: [
      {
        title: 'Massages',
        items: [
          { name: 'Swedish Massage', meta: ['60 min'], price: '$85', amount: 85, description: 'Take a break from stress with gentle, soothing pressure. Relax your body and recharge.' },
          { name: 'Deep Tissue Massage', meta: ['60 min'], price: '$85', amount: 85, description: 'Carrying tension in your neck, shoulders, or back? Firm, focused pressure helps release deep muscle knots.' },
          { name: 'Focused Relief Massage', meta: ['30 min'], price: '$45', amount: 45, description: 'Take a moment for yourself. Choose two areas: back, shoulders, arms, hands, neck, legs, or feet.' },
        ],
      },
      {
        title: 'Massage enhancements',
        addOn: true,
        intro: 'Add to any massage.',
        items: [
          { name: 'Hot Stones', meta: ['Adds 15 min'] /* estimated */, price: '$20', amount: 20, description: 'Melt into relaxation with comforting warmth.' },
          { name: 'Full Body Scrub', meta: ['60 min'], price: '$25', amount: 25, description: 'Gentle exfoliation removes dead skin cells for softer, smoother skin.' },
          { name: 'Full Back Facial', meta: ['45 min'], price: '$75', amount: 75, description: 'Chemical exfoliation, steam, and extractions to unclog pores and reveal smoother skin.' },
        ],
      },
    ],
    related: ['head-spa', 'post-op-recovery', 'body-contouring'],
  },
  {
    slug: 'facials',
    squareBooking: {
      // From the studio's Square Appointments embed code (widget ru24helt2qhr6e, location L2A59ABR9VW2A).
      widgetUrl: 'https://app.squareup.com/appointments/buyer/widget/ru24helt2qhr6e/L2A59ABR9VW2A',
      bookUrl: 'https://app.squareup.com/appointments/book/ru24helt2qhr6e/L2A59ABR9VW2A/start',
    },
    tile: { src: asset('images/facial.webp'), alt: "A woman relaxing as a creamy facial mask is gently applied with a brush", caption: 'Your skin, beautifully refreshed.' },
    name: 'Facials',
    blurb: 'Custom facials and microneedling',
    title: "Facials & Microneedling in Prospect, CT | Stacy's Esthetics",
    description: 'Custom facials for dry, oily, acne-prone, and teen skin, plus PRP and PDRN microneedling facials in Prospect, CT. From $85.',
    h1: 'Facials',
    tagline: 'Customised skin care for every skin type.',
    intro: [
      'Every facial is matched to your skin as it is today, whether that means deep hydration for dry skin, a thorough cleanse for oily or acne-prone skin, or gentle first facials for teens.',
      'For a deeper renewal, our advanced microneedling facials pair collagen induction with PRP or PDRN. Finish any facial with a hydrating mask or a targeted chemical peel.',
    ],
    image: { src: asset('images/facial.webp'), alt: 'A woman relaxing as a creamy facial mask is gently applied with a brush' },
    groups: [
      {
        title: 'Facials',
        items: [
          { name: 'Divine Facial', meta: ['60 min' /* estimated */, 'Normal to dry skin'], price: '$95', amount: 95, description: 'Exfoliation, steam, extractions in the nose area only (if needed), hydration, and a relaxing facial massage for soft, glowing skin.' },
          { name: 'Be Kind to Yourself Facial', meta: ['75 min' /* estimated */, 'Oily or acne-prone skin'], price: '$120', amount: 120, description: 'Deep cleansing, double exfoliation, extractions across the whole face, and high-frequency treatment.' },
          { name: 'Teen Facial', meta: ['45 min' /* estimated */, 'Ages 13–17'], price: '$85', amount: 85, description: 'Gentle care for oily skin, clogged pores, or mild breakouts. Includes cleansing, gentle exfoliation, extractions if needed, and a soothing hydrating mask.' },
        ],
      },
      {
        title: 'Advanced microneedling facials',
        items: [
          { name: 'PRP Facial with Microneedling', meta: ['90 min'], price: '$250', amount: 250, description: 'Uses your own platelet-rich plasma to help stimulate collagen and improve firmness, texture, and fine lines. Includes facial cleansing and deeply hydrating masks.' },
          { name: 'PDRN Facial with Microneedling', meta: ['70 min'], price: '$175', amount: 175, description: 'Salmon-derived PDRN helps improve the look of dark spots and uneven skin tone. Includes cleansing and hydration for a refreshed, radiant complexion.' },
        ],
      },
      {
        title: 'Facial add-ons',
        addOn: true,
        compact: true,
        items: [
          { name: 'Customized Hydrating Hydroplastic Mask', meta: ['Adds 15 min'] /* estimated */, price: '$20', amount: 20 },
          { name: 'Texture Refining Chemical Peel', meta: ['Adds 15 min'] /* estimated */, price: '$35', amount: 35 },
          { name: 'Acne Chemical Peel', meta: ['Adds 15 min'] /* estimated */, price: '$40', amount: 40 },
          { name: 'Dark Spot Brightening Chemical Peel', meta: ['Adds 20 min'] /* estimated */, price: '$60', amount: 60 },
        ],
      },
    ],
    related: ['head-spa', 'laser-hair-removal', 'waxing'],
  },
  {
    slug: 'head-spa',
    squareBooking: {
      // From the studio's Square Appointments embed code (widget r26e6n8laza8xu, location L2A59ABR9VW2A).
      widgetUrl: 'https://app.squareup.com/appointments/buyer/widget/r26e6n8laza8xu/L2A59ABR9VW2A',
      bookUrl: 'https://app.squareup.com/appointments/book/r26e6n8laza8xu/L2A59ABR9VW2A/start',
    },
    tile: { src: asset('images/head-spa.webp'), alt: "A woman enjoying a gentle scalp massage and hair wash at a head spa", caption: 'A clear mind starts at the crown.' },
    name: 'Head Spa & Detox',
    blurb: 'Head spa rituals, sauna, and detox',
    title: "Head Spa in Prospect, CT | Stacy's Esthetics",
    description: 'Japanese-style head spa in Prospect, CT: a 50-minute ritual from $99 or 70 minutes with deep hydration. Plus a sauna blanket detox package.',
    h1: 'Head Spa & Detox',
    tagline: 'Reset, relax, and renew from head to toe.',
    intro: [
      'Our head spa is a slow, sensory ritual for the scalp: warm water streams through your hair beneath the halo while gentle hands cleanse, massage, and release the tension you did not know you were holding.',
      'Choose the 50-minute head spa, or extend it with deep hydration for hair that feels as renewed as you do. For a fuller reset, the detox package combines sauna blanket sessions, lymphatic massage, and exfoliation.',
    ],
    image: { src: asset('images/headspa2-desktop-poster.webp'), alt: 'A head spa water ritual at Stacy\'s Esthetics, with water streaming through the hair beneath a halo' },
    groups: [
      {
        title: 'Head spa',
        items: [
          { name: 'Head Spa', meta: ['50 min'], price: '$99', amount: 99 },
          { name: 'Head Spa & Deep Hydration', meta: ['70 min'], price: '$145', amount: 145 },
        ],
      },
      {
        title: 'Detox',
        items: [
          { name: 'Detox Package', meta: ['9 sessions', '30–60 min each'] /* estimated */, price: '$499', amount: 499, description: '5 sauna blanket sessions, 3 full-body manual lymphatic massages, and 1 full-body exfoliation.' },
        ],
      },
    ],
    related: ['facials', 'massage', 'body-contouring'],
  },
  {
    slug: 'body-contouring',
    squareBooking: {
      // From the studio's Square Appointments embed code (widget 06pu25laattt97, location L2A59ABR9VW2A).
      widgetUrl: 'https://app.squareup.com/appointments/buyer/widget/06pu25laattt97/L2A59ABR9VW2A',
      bookUrl: 'https://app.squareup.com/appointments/book/06pu25laattt97/L2A59ABR9VW2A/start',
    },
    tile: { src: asset('images/body-contouring.webp'), alt: "A therapist sculpting the leg with a wooden roller during a wood therapy session", caption: 'Shape, tone, and define.' },
    image: { src: asset('images/body-contouring.webp'), alt: "A therapist sculpting the leg with a wooden roller during a wood therapy session" },
    name: 'Body Contouring',
    blurb: 'Sculpting packages and mesotherapy',
    title: "Body Contouring in Prospect, CT | Stacy's Esthetics",
    description: 'Non-invasive body contouring in Prospect, CT: wood therapy, cavitation, radiofrequency, and laser lipo packages for waist, glutes, arms, and chin.',
    h1: 'Body Contouring & Sculpting',
    tagline: 'Non-invasive treatments to shape, tone, and define.',
    intro: [
      'Our contouring packages combine body contouring technology with hands-on techniques like wood therapy, so each session works on your goals for the abdomen and waist, legs and glutes, arms, or chin and jawline.',
      'Results build over a series of sessions, so each treatment is offered as a package. We will talk through your goals and which package suits you at your first visit.',
    ],
    groups: [
      {
        title: 'Contouring packages',
        items: [
          {
            name: 'Hourglass Package', meta: ['50 min sessions'],
            description: 'Shape your silhouette and enhance your natural curves with targeted contouring for the abdomen, sides, and back. Combines wood therapy, cavitation, radiofrequency, laser lipo, and red light therapy.',
            packages: [
              { label: '6 sessions', price: '$570', amount: 570 },
              { label: '10 sessions', price: '$900', amount: 900, note: 'Includes 1 free sauna blanket session' },
            ],
          },
          {
            name: 'Perfect Peach Package', meta: ['45 min sessions'],
            description: 'Contour your legs, enhance your glutes, and reduce the look of cellulite with body contouring machines, manual massage, and wood therapy.',
            packages: [
              { label: '6 sessions', price: '$450', amount: 450 },
              { label: '10 sessions', price: '$650', amount: 650 },
            ],
          },
          {
            name: 'Arm Slimming', meta: ['35 min sessions'],
            description: 'Targeted contouring for more sculpted-looking arms, using machines and wood therapy.',
            packages: [
              { label: '6 sessions', price: '$330', amount: 330 },
              { label: '10 sessions', price: '$499', amount: 499 },
            ],
          },
          { name: 'Chin Sculpt Package', meta: ['30 min sessions', '7 sessions'], price: '$325', amount: 325, description: 'Define your chin and jawline with 5 sessions of radiofrequency and wood therapy plus 2 mesotherapy sessions that target localized fat and improve skin firmness.' },
        ],
      },
      {
        title: 'Mesotherapy',
        compact: true,
        items: [
          { name: 'Fat Burner', meta: ['20 min'] /* estimated */, price: 'From $70', amount: 70, priceFrom: true },
          { name: 'Skin Tightening', meta: ['20 min'] /* estimated */, price: 'From $70', amount: 70, priceFrom: true },
          { name: 'Hydrolipoclasia', meta: ['45 min'] /* estimated */, price: '$350', amount: 350 },
        ],
      },
    ],
    related: ['post-op-recovery', 'head-spa', 'massage'],
  },
  {
    slug: 'post-op-recovery',
    squareBooking: {
      // From the studio's Square Appointments embed code (widget rnxycw76cn27wi, location L2A59ABR9VW2A).
      widgetUrl: 'https://app.squareup.com/appointments/buyer/widget/rnxycw76cn27wi/L2A59ABR9VW2A',
      bookUrl: 'https://app.squareup.com/appointments/book/rnxycw76cn27wi/L2A59ABR9VW2A/start',
    },
    tile: { src: asset('images/post-op-recovery.webp'), alt: "A therapist gently massaging a client's arm on soft cream linens", caption: 'Gentle care for your recovery.' },
    image: { src: asset('images/post-op-recovery.webp'), alt: "A therapist gently massaging a client's arm on soft cream linens" },
    name: 'Post-Op Recovery',
    blurb: 'Lymphatic drainage after surgery',
    title: "Post-Op Lymphatic Drainage in Prospect, CT | Stacy's Esthetics",
    description: 'Post-op recovery in Prospect, CT: manual lymphatic drainage massage after surgery, with ultrasound and LED light therapy. Single sessions and packages.',
    h1: 'Post-Op Recovery',
    tagline: 'Gentle, specialized care to support your healing after surgery.',
    intro: [
      'After cosmetic surgery such as liposuction or a tummy tuck, gentle manual lymphatic drainage helps reduce swelling and fluid buildup as your body heals.',
      'Choose a 10-session recovery package for the first weeks after surgery, an individual session, or a package focused on the arms. Please follow your surgeon\'s guidance, and let us know your procedure date and any instructions when you book.',
    ],
    groups: [
      {
        title: 'Recovery care',
        items: [
          { name: 'Post-Op Recovery Package', meta: ['10 sessions', '60 min each'], price: '$950', amount: 950, description: 'For patients within the first 6 weeks after surgery. Gentle manual lymphatic drainage reduces swelling and fluid buildup, combined with ultrasound and LED light therapy. Wound cleaning and drain removal are done when needed, with surgeon authorization and qualified medical care.' },
          { name: 'Individual Post-Op Lymphatic Drainage', meta: ['60 min'], price: '$110', amount: 110, description: 'Manual lymphatic drainage massage, plus fluid extraction and wound cleaning if needed.' },
          {
            name: 'Arm Post-Op Massage', meta: ['35 min sessions'],
            description: 'Manual lymphatic massage with ultrasound, plus fluid extraction if needed.',
            packages: [
              { label: '6 sessions', price: '$330', amount: 330 },
              { label: '10 sessions', price: '$500', amount: 500 },
            ],
          },
        ],
      },
    ],
    notes: ['Wound cleaning, fluid extraction, and drain removal are only done when needed, with your surgeon\'s authorization and qualified medical care.'],
    related: ['body-contouring', 'massage', 'head-spa'],
  },
  {
    slug: 'laser-hair-removal',
    squareBooking: {
      // From the studio's Square Appointments embed code (widget ppli9gbumj2lnc, location L2A59ABR9VW2A).
      widgetUrl: 'https://app.squareup.com/appointments/buyer/widget/ppli9gbumj2lnc/L2A59ABR9VW2A',
      bookUrl: 'https://app.squareup.com/appointments/book/ppli9gbumj2lnc/L2A59ABR9VW2A/start',
    },
    tile: { src: asset('images/laser-hair-removal.webp'), alt: "A cosmetologist performing laser hair removal on a client's leg in a warm spa", caption: 'Smooth skin that lasts.' },
    image: { src: asset('images/laser-hair-removal.webp'), alt: "A cosmetologist performing laser hair removal on a client's leg in a warm spa" },
    name: 'Laser Hair Removal',
    blurb: 'Smooth, long-lasting results',
    title: "Laser Hair Removal in Prospect, CT | Stacy's Esthetics",
    description: 'Laser hair removal packages in Prospect, CT for the upper lip, full face, abdomen, bikini, and full legs.',
    h1: 'Laser Hair Removal',
    tagline: 'Smooth, long-lasting results.',
    intro: [
      'Laser hair removal works gradually, treating hair in its growth phase over a series of sessions, so most areas below are priced as a package with the number of sessions included.',
      'We will check your skin and hair type and talk through how to prepare at your first appointment.',
    ],
    groups: [
      {
        title: 'Treatment packages',
        items: [
          { name: 'Upper Lip', meta: ['7 sessions', '15 min per session'], price: '$350', amount: 350 },
          { name: 'Full Face', meta: ['7 sessions', '15 min per session'], price: '$550', amount: 550 },
          { name: 'Full Abdomen', meta: ['30 min per session'], price: '$660', amount: 660 },
          { name: 'Bikini', meta: ['12 sessions', '30 min per session'], price: '$1,000', amount: 1000 },
          { name: 'Full Legs', meta: ['12 sessions', '45 min per session'], price: '$1,200', amount: 1200 },
        ],
      },
    ],
    related: ['waxing', 'facials', 'body-contouring'],
  },
  {
    slug: 'waxing',
    tile: { src: asset('images/waxing.webp'), alt: "A wax strip being smoothed onto a leg in soft natural light", caption: 'Smooth, in just minutes.' },
    image: { src: asset('images/waxing.webp'), alt: "A wax strip being smoothed onto a leg in soft natural light" },
    name: 'Waxing',
    blurb: 'Brows, underarms, Brazilian, and legs',
    title: "Waxing in Prospect, CT | Stacy's Esthetics",
    description: 'Waxing in Prospect, CT: eyebrow $10, underarm $20, full Brazilian $60, and full leg $75. Quick, comfortable, and thorough.',
    h1: 'Waxing',
    tagline: 'Quick, comfortable, and thorough.',
    intro: [
      'From a 10-minute brow tidy to a full Brazilian, every waxing service is done with care for your comfort and your skin.',
    ],
    groups: [
      {
        title: 'Waxing services',
        items: [
          { name: 'Eyebrow', meta: ['10 min'], price: '$10', amount: 10 },
          { name: 'Underarm', meta: ['15 min'], price: '$20', amount: 20 },
          { name: 'Full Brazilian', meta: ['30 min'], price: '$60', amount: 60 },
          { name: 'Full Leg', meta: ['40 min'], price: '$75', amount: 75 },
        ],
      },
    ],
    related: ['laser-hair-removal', 'facials', 'massage'],
  },
];

export const findServicePage = (slug: string) => servicePages.find((page) => page.slug === slug);

const lowest = (amount?: Amount) => (Array.isArray(amount) ? amount[0] : amount);

/** The lowest price on a page's menu, for "from $X" labels. */
export function startingPrice(page: ServicePage) {
  const amounts = page.groups.filter((group) => !group.addOn).flatMap((group) => group.items.flatMap((item) => [lowest(item.amount), ...(item.packages ?? []).map((pkg) => pkg.amount)]));
  const values = amounts.filter((value): value is number => typeof value === 'number');
  return values.length ? Math.min(...values) : undefined;
}

/** Every bookable treatment on a page, one per package, as "Name · details · price" labels. */
export function treatmentOptions(page: ServicePage) {
  return page.groups.filter((group) => !group.addOn).flatMap((group) =>
    group.items.flatMap((item) => {
      const meta = item.meta?.filter((fact) => !fact.startsWith('Adds')) ?? [];
      if (item.packages) return item.packages.map((pkg) => [item.name, pkg.label, ...meta, pkg.price].join(' · '));
      return [[item.name, ...meta, item.price].filter(Boolean).join(' · ')];
    })
  );
}
