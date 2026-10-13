/** The site's base path ("/stacys/" on GitHub Pages). Every page shares it, so links and assets stay absolute. */
export const BASE = import.meta.env.BASE_URL;

export const SITE_URL = 'https://dennism321.github.io' + BASE;

export const asset = (path: string) => `${BASE}${path}`;

/** Link to a section of the home page that works from any page. */
export const homeSection = (id: string) => `${BASE}#${id}`;

export const servicePath = (slug: string) => `${BASE}${slug}/`;
