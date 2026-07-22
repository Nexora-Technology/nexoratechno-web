import type { Metadata } from 'next';

/** Canonical origin. English (default locale) is served UNPREFIXED at the bare
 *  domain; Vietnamese lives under /vi. /en/* URLs 301 to their unprefixed
 *  counterparts, so canonicals for EN must never include the /en segment. */
export const SITE_URL = 'https://nexoratechno.com';

/** Locale-aware relative href: EN (default) is unprefixed, VI keeps /vi. */
export function localeHref(locale: string, path = ''): string {
  const clean = path === '/' ? '' : path;
  return locale === 'en' ? clean || '/' : `/${locale}${clean}`;
}

/** Locale-aware absolute URL for canonicals/OG — same prefix rules as localeHref. */
export function localePath(locale: string, path: string): string {
  const href = localeHref(locale, path);
  return href === '/' ? SITE_URL : `${SITE_URL}${href}`;
}

/** Default social-share image: dedicated 1200x630 brand banner (dark ink
 *  background, gold wordmark at native aspect ratio, English tagline). */
export const OG_IMAGE = `${SITE_URL}/images/og-banner.png`;

/** Actual brand logo (wordmark) — for schema.org Organization.logo, which
 *  expects the logo itself, not the social-share banner. */
export const LOGO_URL = `${SITE_URL}/images/logo-nex.png`;

/**
 * Build self-referential canonical + hreflang alternates for a page.
 * @param locale current locale being rendered (canonical must match it)
 * @param path route WITHOUT locale prefix, e.g. '' | '/blog' | '/blog/my-post'
 */
export function buildAlternates(locale: string, path: string): NonNullable<Metadata['alternates']> {
  return {
    canonical: localePath(locale, path),
    languages: {
      vi: localePath('vi', path),
      en: localePath('en', path),
      'x-default': localePath('en', path),
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
