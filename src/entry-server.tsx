import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { faqsFor, googleReviews, studio, studioHours } from "./data";
import { LangContext, ui, type Lang } from "./i18n";
import { SITE_URL } from "./paths";
import { serviceFaqs } from "./serviceFaqs";
import { findLocalizedPage, localizedPages, servicePages, startingPrice } from "./servicePages";
import { COURSES_SLUG, coursesCopy } from "./courses";

export { COURSES_SLUG, coursesCopy, faqsFor, googleReviews, localizedPages, serviceFaqs, servicePages, startingPrice, studio, studioHours, ui, SITE_URL };

/** Renders a page to HTML at build time so search engines see the full content. */
export function render(slug: string | undefined, lang: Lang) {
  return renderToString(
    <StrictMode>
      <LangContext.Provider value={lang}>
        <App page={slug && slug !== COURSES_SLUG ? findLocalizedPage(slug, lang) : undefined} courses={slug === COURSES_SLUG} />
      </LangContext.Provider>
    </StrictMode>
  );
}
