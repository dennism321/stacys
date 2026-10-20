// Pre-render the home page and every service page into dist/ in English and Spanish (/es/), each with its
// own title, description, canonical URL, hreflang alternates, sharing tags, and structured data.
// Also writes a bilingual sitemap.xml and llms.txt.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

const { render, faqsFor, googleReviews, localizedPages, serviceFaqs, servicePages, startingPrice, studio, ui, SITE_URL } =
  await import("../dist-ssr/entry-server.js");
const dist = new URL("../dist/", import.meta.url);
const template = await readFile(new URL("index.html", dist), "utf8");
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error(`Could not find ${marker} in dist/index.html`);

const LANGS = ["en", "es"];
const urlFor = (lang, slug) => `${SITE_URL}${lang === "es" ? "es/" : ""}${slug ? `${slug}/` : ""}`;

const escapeAttr = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function setMeta(html, pattern, value) {
  if (!pattern.test(html)) throw new Error(`Missing tag for ${pattern}`);
  return html.replace(pattern, (_, start, end) => `${start}${escapeAttr(value)}${end}`);
}

function offerFor(item, label = item.name, amount = item.amount) {
  const offer = { "@type": "Offer", itemOffered: { "@type": "Service", name: label }, priceCurrency: "USD" };
  if (Array.isArray(amount)) {
    offer.priceSpecification = { "@type": "PriceSpecification", minPrice: amount[0], maxPrice: amount[1], priceCurrency: "USD" };
  } else if (typeof amount === "number" && item.priceFrom) {
    offer.priceSpecification = { "@type": "PriceSpecification", minPrice: amount, priceCurrency: "USD" };
  } else if (typeof amount === "number") {
    offer.price = String(amount);
  }
  return offer;
}

const faqPage = (items, url) => ({
  "@type": "FAQPage",
  "@id": `${url}#faq`,
  mainEntity: items.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
});

function structuredData(page, url, lang) {
  const t = ui[lang];
  const provider = {
    "@type": "BeautySalon",
    name: "Stacy's Esthetics",
    url: SITE_URL,
    telephone: "+1-914-310-4680",
    address: { "@type": "PostalAddress", streetAddress: studio.street, addressLocality: "Prospect", addressRegion: "CT", postalCode: "06712", addressCountry: "US" },
  };
  const offers = page.groups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.packages ? item.packages.map((pkg) => offerFor(item, `${item.name} (${pkg.label})`, pkg.amount)) : [offerFor(item)]
    )
  );
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t.home, item: urlFor(lang) },
          { "@type": "ListItem", position: 2, name: page.name, item: url },
        ],
      },
      {
        "@type": "Service",
        name: page.h1,
        serviceType: page.name,
        description: page.description,
        url,
        inLanguage: t.locale,
        areaServed: "Prospect, CT",
        provider,
        hasOfferCatalog: { "@type": "OfferCatalog", name: t.menuAndPrices(page.name), itemListElement: offers },
      },
      faqPage(serviceFaqs(page, lang), url),
    ],
  };
}

/** hreflang links so Google shows each searcher the page in their language. */
const alternates = (slug) =>
  [
    `    <link rel="alternate" hreflang="en" href="${urlFor("en", slug)}" />`,
    `    <link rel="alternate" hreflang="es" href="${urlFor("es", slug)}" />`,
    `    <link rel="alternate" hreflang="x-default" href="${urlFor("en", slug)}" />`,
  ].join("\n");

const jsonLdScript = (data) => `    <script type="application/ld+json">\n${JSON.stringify(data, null, 2).replace(/</g, "\\u003c")}\n    </script>`;

function pageHtml(page, lang) {
  const t = ui[lang];
  const slug = page?.slug;
  const url = urlFor(lang, slug);
  const title = page ? page.title : t.homeTitle;
  const description = page ? page.description : t.homeDescription;

  let html = template.replace(marker, `<div id="root">${render(slug, lang)}</div>`);
  html = html.replace('<html lang="en">', `<html lang="${t.htmlLang}">`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`);
  html = setMeta(html, /(<meta name="description" content=")[^"]*(")/, description);
  html = setMeta(html, /(<link rel="canonical" href=")[^"]*(")/, url);
  html = html.replace(/(<link rel="canonical" href="[^"]*" \/>)/, `$1\n${alternates(slug)}`);
  html = setMeta(html, /(<meta property="og:url" content=")[^"]*(")/, url);
  html = setMeta(html, /(<meta property="og:locale" content=")[^"]*(")/, t.ogLocale);
  html = setMeta(html, /(<meta property="og:title" content=")[^"]*(")/, title);
  html = setMeta(html, /(<meta property="og:description" content=")[^"]*(")/, description);
  html = setMeta(html, /(<meta name="twitter:title" content=")[^"]*(")/, title);
  html = setMeta(html, /(<meta name="twitter:description" content=")[^"]*(")/, description);

  if (page) {
    // Service pages: breadcrumbs, the service and its prices, and the FAQ (replaces the home BeautySalon block).
    return html.replace(/    <script type="application\/ld\+json">[\s\S]*?<\/script>/, jsonLdScript(structuredData(page, url, lang)));
  }
  // Home: keep the BeautySalon block from index.html and add WebSite + FAQPage.
  const homeLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${urlFor(lang)}#website`, name: "Stacy's Esthetics", url: urlFor(lang), inLanguage: t.locale },
      faqPage(faqsFor(lang), url),
    ],
  };
  return html.replace("</head>", `${jsonLdScript(homeLd)}\n  </head>`);
}

let count = 0;
for (const lang of LANGS) {
  const root = new URL(lang === "es" ? "es/" : "", dist);
  await mkdir(root, { recursive: true });
  await writeFile(new URL("index.html", root), pageHtml(undefined, lang));
  count++;
  for (const page of localizedPages(lang)) {
    const dir = new URL(`${page.slug}/`, root);
    await mkdir(dir, { recursive: true });
    await writeFile(new URL("index.html", dir), pageHtml(page, lang));
    count++;
  }
}

// Sitemap with hreflang alternates for every page in both languages.
const today = new Date().toISOString().slice(0, 10);
const slugs = [undefined, ...servicePages.map((page) => page.slug)];
const entries = slugs.flatMap((slug) =>
  LANGS.map(
    (lang) => `  <url>
    <loc>${urlFor(lang, slug)}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${urlFor("en", slug)}" />
    <xhtml:link rel="alternate" hreflang="es" href="${urlFor("es", slug)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${urlFor("en", slug)}" />
  </url>`
  )
);
await writeFile(
  new URL("sitemap.xml", dist),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join("\n")}\n</urlset>\n`
);

// llms.txt: a plain-language summary of the business for AI assistants and answer engines.
const hours = studio.hours.map((row) => `${row.days}: ${row.time}`).join("; ");
const llms = [
  "# Stacy's Esthetics",
  "",
  `> Women- and Latino-owned esthetics studio in Prospect, Connecticut offering Japanese-style head spa, facials and microneedling, massage therapy, body contouring, post-op lymphatic drainage, laser hair removal, and waxing. Rated ${googleReviews.rating.toFixed(1)} out of 5 from ${googleReviews.count} Google reviews. The full site is available in English and Spanish.`,
  "",
  "## Contact",
  `- Address: ${studio.street.replace(/\.$/, "")}, ${studio.locality}`,
  `- Phone: ${studio.phone}`,
  `- Hours: ${hours}`,
  `- Website: ${SITE_URL} (Spanish: ${urlFor("es")})`,
  `- Google Maps: ${googleReviews.url}`,
  "- Booking: online through each service page, or by phone",
  "",
  "## Services",
  ...servicePages.map((page) => {
    const from = startingPrice(page);
    return `- [${page.h1}](${urlFor("en", page.slug)}): ${page.tagline}${from !== undefined ? ` From $${from}.` : ""}`;
  }),
  "",
  "## Servicios en español",
  ...localizedPages("es").map((page) => `- [${page.h1}](${urlFor("es", page.slug)}): ${page.tagline}`),
  "",
  "## Optional",
  `- [Home page](${SITE_URL}): studio overview, reviews, and frequently asked questions`,
  `- [Página de inicio en español](${urlFor("es")})`,
  `- [Sitemap](${SITE_URL}sitemap.xml)`,
  "",
].join("\n");
await writeFile(new URL("llms.txt", dist), llms);

await rm(new URL("../dist-ssr", import.meta.url), { recursive: true, force: true });
console.log(`Pre-rendered ${count} pages (English and Spanish), sitemap.xml, and llms.txt`);
