import { getBlogPosts, getCareers, getCaseStudies, orEmpty } from '@/lib/wordpress-content';
import { postsForLocale } from '@/lib/blog-language';
import { sectorOf } from '@/lib/case-sectors';
import { textOf } from '@/lib/wordpress';

/** Slim case shape sent to the client library (no article HTML). */
export interface HomeCase {
  slug: string;
  title: string;
  summary: string;
  industry: string;
  sector: string;
  image: string;
  imageAlt: string;
  tags: string[];
  figure: string;
}

export const FEATURED_SLUGS = [
  'multi-entity-fintech-core-ledger-rebuild',
  'ai-road-marking-wear-measurement-japan',
  'travel-itinerary-planning-platform-ai-agents',
  'nexora-management-system-hrms-crm-finance',
];

// Quick view shows the article's first published diagram (`fig-…` uploads).
function firstDiagram(html: string): string {
  const sources = [...html.matchAll(/<img[^>]*\ssrc="([^"]+)"/gi)].map((m) => m[1]);
  const diagrams = sources.filter((src) => /\/fig-[^/]*$/.test(src));
  return diagrams.find((src) => /-1\.\w+$/.test(src)) ?? diagrams[0] ?? '';
}

export async function getHomeData(locale: string) {
  const [cases, posts, careers] = await Promise.all([
    orEmpty(getCaseStudies, 'home case studies'),
    orEmpty(getBlogPosts, 'home blog'),
    orEmpty(getCareers, 'home careers'),
  ]);

  const library: HomeCase[] = cases.map((c) => {
    const industry = c.caseMeta?.industry ?? '';
    return {
      slug: c.slug,
      title: textOf(c.title),
      summary: textOf(c.excerpt ?? ''),
      industry,
      sector: sectorOf(industry),
      image: c.featuredImage?.node.sourceUrl ?? '',
      imageAlt: c.featuredImage?.node.altText ?? '',
      tags: c.categories.nodes.map((n) => n.name),
      figure: firstDiagram(c.content),
    };
  });

  const post = postsForLocale(posts, locale)[0];
  return {
    library,
    featured: FEATURED_SLUGS.map((slug) => library.find((c) => c.slug === slug)),
    post: post && {
      slug: post.slug,
      title: textOf(post.title),
      summary: textOf(post.excerpt ?? ''),
      date: post.date,
      category: post.categories.nodes[0]?.name ?? '',
      image: post.featuredImage?.node.sourceUrl ?? '',
    },
    careerCount: careers.length,
  };
}

export type HomeData = Awaited<ReturnType<typeof getHomeData>>;
