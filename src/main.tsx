import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { LangContext, type Lang } from "./i18n";
import { BASE } from "./paths";
import { findLocalizedPage } from "./servicePages";

// "/facials/" -> English facials; "/es/facials/" -> Spanish facials; "/es/" -> Spanish home.
const parts = window.location.pathname.slice(BASE.length).split("/").filter(Boolean);
const lang: Lang = parts[0] === "es" ? "es" : "en";
const slug = (lang === "es" ? parts[1] : parts[0]) ?? "";
const page = slug ? findLocalizedPage(slug, lang) : undefined;

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <LangContext.Provider value={lang}>
      <App page={page} />
    </LangContext.Provider>
  </StrictMode>
);

// The build pre-renders each page into #root; hydrate that markup instead of replacing it.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
