import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { BASE } from "./paths";
import { findServicePage } from "./servicePages";

// "/facials/" -> "facials"; the home page has no slug.
const slug = window.location.pathname.slice(BASE.length).replace(/\/+$/, "");
const page = slug ? findServicePage(slug) : undefined;

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App page={page} />
  </StrictMode>
);

// The build pre-renders each page into #root; hydrate that markup instead of replacing it.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
