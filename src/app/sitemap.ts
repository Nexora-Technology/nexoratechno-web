import type { MetadataRoute } from 'next';
import { wpClient } from '@/lib/wordpress';

// Built at build time, WordPress is unreachable and the sitemap froze with no
// content URLs; render per request so it always reflects what WordPress has.
export const dynamic = 'force-dynamic';

const SITE_URL = 'https://nexoratechno.com';

// Real routes only. about/services/process/contact are in-page anchors on the
// home route (not standalone pages), so they must NOT appear as sitemap URLs.
const STATIC_PAGES = ['', '/blog', '/careers', '/case-studies'];

type Entry = { slug: string; modifiedGmt: string };

async function fetchEntries(type: 'posts' | 'careers' | 'caseStudies'): Promise<Entry[]> {
  try {
    const data = await wpClient.request<Record<string, { nodes: Entry[] }>>(
      `query { ${type}(first: 100) { nodes { slug modifiedGmt } } }`
    );
    return data[type].nodes.filter((n) => n.slug);
  } catch (err) {
    console.error(`[sitemap] ${type}`, err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, careers, caseStudies] = await Promise.all([
    fetchEntries('posts'),
    fetchEntries('careers'),
    fetchEntries('caseStudies'),
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

  const blogEntries: MetadataRoute.Sitemap = blogPosts.flatMap(({ slug, modifiedGmt }) => [
    {
      url: `${SITE_URL}/vi/blog/${slug}`,
      lastModified: new Date(`${modifiedGmt}Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: new Date(`${modifiedGmt}Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]);

  const careerEntries: MetadataRoute.Sitemap = careers.flatMap(({ slug, modifiedGmt }) => [
    {
      url: `${SITE_URL}/vi/careers/${slug}`,
      lastModified: new Date(`${modifiedGmt}Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/careers/${slug}`,
      lastModified: new Date(`${modifiedGmt}Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]);

  const caseStudyEntries: MetadataRoute.Sitemap = caseStudies.flatMap(({ slug, modifiedGmt }) => [
    {
      url: `${SITE_URL}/vi/case-studies/${slug}`,
      lastModified: new Date(`${modifiedGmt}Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/case-studies/${slug}`,
      lastModified: new Date(`${modifiedGmt}Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]);

  return [...staticEntries, ...blogEntries, ...careerEntries, ...caseStudyEntries];
}
