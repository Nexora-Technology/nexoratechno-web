import type { Metadata } from 'next';

const WP_INTERNAL_URL = process.env.WP_INTERNAL_URL || 'http://wordpress';

/** How often the Site Icon set in WP admin (Settings → General) is re-read. */
export const SITE_ICON_REVALIDATE_SECONDS = 3600;

interface WPMediaSize {
  source_url: string;
  width: number;
  height: number;
}

async function wpGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${WP_INTERNAL_URL}${path}`, {
      next: { revalidate: SITE_ICON_REVALIDATE_SECONDS },
      // WordPress is unreachable during `docker build` — fail fast instead of
      // stalling the build; the page picks the icon up on the next revalidation.
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * Favicon + apple-touch-icon from the WordPress Site Icon setting.
 * The front end is rendered by Next.js, so WordPress' own `wp_site_icon()`
 * head tags never reach these pages — the icon has to be mirrored here.
 * Returns undefined when WordPress is down or no icon is set.
 */
export async function getWordPressSiteIcons(): Promise<Metadata['icons'] | undefined> {
  const site = await wpGet<{ site_icon?: number; site_icon_url?: string }>(
    '/wp-json/?_fields=site_icon,site_icon_url',
  );
  if (!site?.site_icon || !site.site_icon_url) return undefined;

  const media = await wpGet<{ media_details?: { sizes?: Record<string, WPMediaSize> } }>(
    `/wp-json/wp/v2/media/${site.site_icon}?_fields=media_details`,
  );
  const sizes = media?.media_details?.sizes ?? {};

  // WordPress crops the Site Icon to these exact sizes (see wp_site_icon()).
  const sized = (key: string) => {
    const s = sizes[key];
    return s ? { url: s.source_url, sizes: `${s.width}x${s.height}`, type: 'image/png' } : null;
  };
  const icon = [sized('site_icon-32'), sized('site_icon-192')].filter((i) => i !== null);
  const apple = sized('site_icon-180');

  return {
    icon: icon.length > 0 ? icon : [{ url: site.site_icon_url }],
    apple: apple ? [apple] : [{ url: site.site_icon_url }],
  };
}
