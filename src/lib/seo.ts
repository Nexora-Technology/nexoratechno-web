import type { Metadata } from 'next';

/** Canonical origin. VI and EN content are both served under an explicit locale
 *  prefix (/vi, /en); the bare domain redirects to /vi, so canonical URLs must
 *  always include the locale segment to point at a 200 response, never a redirect. */
export const SITE_URL = 'https://nexoratechno.com';

/** Default social-share image. Replace with a dedicated 1200x630 banner when
 *  available — this logo is a functional stopgap so shares are not blank. */
export const OG_IMAGE = `${SITE_URL}/images/logo-nex.png`;

/**
 * Build self-referential canonical + hreflang alternates for a page.
 * @param locale current locale being rendered (canonical must match it)
 * @param path route WITHOUT locale prefix, e.g. '' | '/blog' | '/blog/my-post'
 */
export function buildAlternates(locale: string, path: string): NonNullable<Metadata['alternates']> {
  const clean = path === '/' ? '' : path;
  return {
    canonical: `${SITE_URL}/${locale}${clean}`,
    languages: {
      vi: `${SITE_URL}/vi${clean}`,
      en: `${SITE_URL}/en${clean}`,
      'x-default': `${SITE_URL}/vi${clean}`,
    },
  };
}

/** Default Open Graph image block shared across pages. */
export const OG_IMAGES = [
  {
    url: OG_IMAGE,
    width: 1200,
    height: 630,
    alt: 'Nexora Technology',
  },
];
