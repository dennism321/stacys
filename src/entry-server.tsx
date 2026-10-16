import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { faqs, googleReviews, studio } from "./data";
import { serviceFaqs } from "./serviceFaqs";
import { SITE_URL } from "./paths";
import { findServicePage, servicePages, startingPrice } from "./servicePages";

export { faqs, googleReviews, serviceFaqs, servicePages, startingPrice, studio, SITE_URL };

/** Renders a page to HTML at build time so search engines see the full content. */
export function render(slug?: string) {
  return renderToString(
    <StrictMode>
      <App page={slug ? findServicePage(slug) : undefined} />
    </StrictMode>
  );
}
