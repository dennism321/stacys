import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

/** Renders the page to HTML at build time so search engines see the full content. */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
