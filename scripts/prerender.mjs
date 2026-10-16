// Pre-render the home page and every service page into dist/, each with its own
// title, description, canonical URL, sharing tags, and structured data. Also writes sitemap.xml and llms.txt.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

const { render, faqs, googleReviews, serviceFaqs, servicePages, startingPrice, studio, SITE_URL } = await import("../dist-ssr/entry-server.js");
const dist = new URL("../dist/", import.meta.url);
const template = await readFile(new URL("index.html", dist), "utf8");
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error(`Could not find ${marker} in dist/index.html`);

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

function structuredData(page, url) {
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
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: page.name, item: url },
        ],
      },
      {
        "@type": "Service",
        name: page.h1,
        serviceType: page.name,
        description: page.description,
        url,
        areaServed: "Prospect, CT",
        provider,
        hasOfferCatalog: { "@type": "OfferCatalog", name: `${page.name} menu`, itemListElement: offers },
      },
      faqPage(serviceFaqs(page), url),
    ],
  };
}

function pageHtml(page) {
  let html = template.replace(marker, `<div id="root">${render(page?.slug)}</div>`);
  if (!page) {
    const homeLd = {
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "WebSite", "@id": `${SITE_URL}#website`, name: "Stacy's Esthetics", url: SITE_URL, inLanguage: "en-US" },
        faqPage(faqs, SITE_URL),
      ],
    };
    const script = `    <script type="application/ld+json">\n${JSON.stringify(homeLd, null, 2).replace(/</g, "\\u003c")}\n    </script>\n  </head>`;
    return html.replace("</head>", script);
  }
  const url = `${SITE_URL}${page.slug}/`;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(page.title)}</title>`);
  html = setMeta(html, /(<meta name="description" content=")[^"]*(")/, page.description);
  html = setMeta(html, /(<link rel="canonical" href=")[^"]*(")/, url);
  html = setMeta(html, /(<meta property="og:url" content=")[^"]*(")/, url);
  html = setMeta(html, /(<meta property="og:title" content=")[^"]*(")/, page.title);
  html = setMeta(html, /(<meta property="og:description" content=")[^"]*(")/, page.description);
  html = setMeta(html, /(<meta name="twitter:title" content=")[^"]*(")/, page.title);
  html = setMeta(html, /(<meta name="twitter:description" content=")[^"]*(")/, page.description);
  const ld = JSON.stringify(structuredData(page, url), null, 2).replace(/</g, "\\u003c");
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${ld}\n    </script>`);
  return html;
}

await writeFile(new URL("index.html", dist), pageHtml());
for (const page of servicePages) {
  const dir = new URL(`${page.slug}/`, dist);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL("index.html", dir), pageHtml(page));
}

const today = new Date().toISOString().slice(0, 10);
const urls = [SITE_URL, ...servicePages.map((page) => `${SITE_URL}${page.slug}/`)];
await writeFile(
  new URL("sitemap.xml", dist),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((loc) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join("\n")}\n</urlset>\n`
);

// llms.txt: a plain-language summary of the business for AI assistants and answer engines.
const hours = studio.hours.map((row) => `${row.days}: ${row.time}`).join("; ");
const llms = [
  "# Stacy's Esthetics",
  "",
  `> Women- and Latino-owned esthetics studio in Prospect, Connecticut offering Japanese-style head spa, facials and microneedling, massage therapy, body contouring, post-op lymphatic drainage, laser hair removal, and waxing. Rated ${googleReviews.rating.toFixed(1)} out of 5 from ${googleReviews.count} Google reviews.`,
  "",
  "## Contact",
  `- Address: ${studio.street.replace(/\.$/, "")}, ${studio.locality}`,
  `- Phone: ${studio.phone}`,
  `- Hours: ${hours}`,
  `- Website: ${SITE_URL}`,
  `- Google Maps: ${googleReviews.url}`,
  "- Booking: online through each service page, or by phone",
  "",
  "## Services",
  ...servicePages.map((page) => {
    const from = startingPrice(page);
    return `- [${page.h1}](${SITE_URL}${page.slug}/): ${page.tagline}${from !== undefined ? ` From $${from}.` : ""}`;
  }),
  "",
  "## Optional",
  `- [Home page](${SITE_URL}): studio overview, reviews, and frequently asked questions`,
  `- [Sitemap](${SITE_URL}sitemap.xml)`,
  "",
].join("\n");
await writeFile(new URL("llms.txt", dist), llms);

await rm(new URL("../dist-ssr", import.meta.url), { recursive: true, force: true });
console.log(`Pre-rendered ${servicePages.length + 1} pages, sitemap.xml, and llms.txt`);
