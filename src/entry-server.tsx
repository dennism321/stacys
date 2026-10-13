import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { studio } from "./data";
import { SITE_URL } from "./paths";
import { findServicePage, servicePages } from "./servicePages";

export { servicePages, studio, SITE_URL };

/** Renders a page to HTML at build time so search engines see the full content. */
export function render(slug?: string) {
  return renderToString(
    <StrictMode>
      <App page={slug ? findServicePage(slug) : undefined} />
    </StrictMode>
  );
}
