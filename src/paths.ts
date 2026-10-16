/** The site's base path ("/" on stacyesthetics.com). Every page shares it, so links and assets stay absolute. */
export const BASE = import.meta.env.BASE_URL;

export const SITE_URL = 'https://stacyesthetics.com' + BASE;

export const asset = (path: string) => `${BASE}${path}`;

/** Link to a section of the home page that works from any page. */
export const homeSection = (id: string) => `${BASE}#${id}`;

export const servicePath = (slug: string) => `${BASE}${slug}/`;

/** srcset for a photo that also has a 640px "-640.webp" version next to it. */
export const photoSrcSet = (src: string, fullWidth = 800) => `${src.replace(/\.webp$/, '-640.webp')} 640w, ${src} ${fullWidth}w`;
