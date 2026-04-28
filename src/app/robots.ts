import type { MetadataRoute } from 'next';

const SITE_URL = 'https://nexoratechno.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/wp-admin/', '/wp-includes/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
