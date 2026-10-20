import type { Lang } from './i18n';

/** The site's base path ("/" on stacyesthetics.com). Every page shares it, so links and assets stay absolute. */
export const BASE = import.meta.env.BASE_URL;

export const SITE_URL = 'https://stacyesthetics.com' + BASE;

export const asset = (path: string) => `${BASE}${path}`;

/** Home page for a language: "/" for English, "/es/" for Spanish. */
export const homePath = (lang: Lang = 'en') => (lang === 'es' ? `${BASE}es/` : BASE);

/** Link to a section of the home page that works from any page. */
export const homeSection = (id: string, lang: Lang = 'en') => `${homePath(lang)}#${id}`;

export const servicePath = (slug: string, lang: Lang = 'en') => `${homePath(lang)}${slug}/`;

/** The same page in a language: the home page, or a service page when `slug` is set. */
export const pagePath = (lang: Lang, slug?: string) => (slug ? servicePath(slug, lang) : homePath(lang));

/** srcset for a photo that also has a 640px "-640.webp" version next to it. */
export const photoSrcSet = (src: string, fullWidth = 800) => `${src.replace(/\.webp$/, '-640.webp')} 640w, ${src} ${fullWidth}w`;
