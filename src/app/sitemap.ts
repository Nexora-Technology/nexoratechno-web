import type { MetadataRoute } from 'next';

const SITE_URL = 'https://nexoratechno.com';
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Real routes only. about/services/process/contact are in-page anchors on the
// home route (not standalone pages), so they must NOT appear as sitemap URLs.
const STATIC_PAGES = ['', '/blog', '/careers', '/case-studies'];

async function fetchSlugs(endpoint: string): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((item: { slug: string }) => item.slug).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogSlugs, careerSlugs, caseStudySlugs] = await Promise.all([
    fetchSlugs('/api/wordpress/blog'),
    fetchSlugs('/api/wordpress/careers'),
    fetchSlugs('/api/wordpress/case-studies'),
  ]);

  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.flatMap((page) => [
    {
      url: `${SITE_URL}/vi${page}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 0.9 : 0.7,
    },
    {
      url: `${SITE_URL}${page || '/'}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: page === '' ? 1 : 0.8,
    },
  ]);

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.flatMap((slug) => [
    {
      url: `${SITE_URL}/vi/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]);

  const careerEntries: MetadataRoute.Sitemap = careerSlugs.flatMap((slug) => [
    {
      url: `${SITE_URL}/vi/careers/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/careers/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]);

  const caseStudyEntries: MetadataRoute.Sitemap = caseStudySlugs.flatMap((slug) => [
    {
      url: `${SITE_URL}/vi/case-studies/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/case-studies/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]);

  return [...staticEntries, ...blogEntries, ...careerEntries, ...caseStudyEntries];
}
