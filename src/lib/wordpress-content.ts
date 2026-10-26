import {
  wpClient,
  CASE_STUDY_BASE_FIELDS,
  POST_BASE_FIELDS,
  CAREER_BASE_FIELDS,
  extractCaseMeta,
  extractCareerMeta,
  type WPCaseStudy,
  type WPPost,
  type WPCareer,
} from '@/lib/wordpress';

// Server-side WordPress reads shared by the API routes and server-rendered pages.
// Each throws on transport errors; callers decide between a 500 and an empty state.

// Listing pulls `content` so we can extract the embedded case-meta JSON without
// needing ACF / WPGraphQL-for-ACF plugins on the WordPress instance.
const GET_CASE_STUDIES = `
  ${CASE_STUDY_BASE_FIELDS}
  query GetCaseStudies($first: Int!) {
    caseStudies(first: $first) {
      nodes {
        ...CaseStudyBaseFields
        content
      }
    }
  }
`;

const GET_BLOG_POSTS = `
  ${POST_BASE_FIELDS}
  query GetBlogPosts($first: Int!) {
    posts(first: $first) {
      nodes { ...PostBaseFields }
    }
  }
`;

// Listing pulls `content` only to read the embedded career-meta JSON.
const GET_CAREERS = `
  ${CAREER_BASE_FIELDS}
  query GetCareers($first: Int!) {
    careers(first: $first) {
      nodes {
        ...CareerBaseFields
        content
      }
    }
  }
`;

// WPGraphQL caps `first` at 100 by default; the site is far below that.
const PAGE_SIZE = 100;

type RawCaseStudy = Omit<WPCaseStudy, 'content'> & { content?: string };

export async function getCaseStudies() {
  const data = await wpClient.request<{ caseStudies: { nodes: RawCaseStudy[] } }>(
    GET_CASE_STUDIES,
    { first: PAGE_SIZE }
  );
  return data.caseStudies.nodes.map((node) => {
    const { caseMeta, cleanContent } = extractCaseMeta(node.content ?? '');
    const services = caseMeta?.services ?? [];
    return {
      ...node,
      content: cleanContent,
      caseMeta: caseMeta
        ? {
            client: caseMeta.client ?? '',
            industry: caseMeta.industry ?? '',
            year: caseMeta.year ?? '',
            duration: caseMeta.duration ?? '',
            team: caseMeta.team ?? '',
            color: caseMeta.color ?? '#6B46C1',
          }
        : null,
      // Frontend reads `categories.nodes[].name` as service tags.
      categories: {
        nodes: services.map((s) => ({ name: s, slug: s.toLowerCase().replace(/\s+/g, '-') })),
      },
    };
  });
}

export type CaseStudyEntry = Awaited<ReturnType<typeof getCaseStudies>>[number];

export async function getBlogPosts() {
  const data = await wpClient.request<{ posts: { nodes: WPPost[] } }>(GET_BLOG_POSTS, {
    first: PAGE_SIZE,
  });
  return data.posts.nodes;
}

export async function getCareers() {
  const data = await wpClient.request<{ careers: { nodes: WPCareer[] } }>(GET_CAREERS, {
    first: PAGE_SIZE,
  });
  return data.careers.nodes.map(({ content, ...node }) => ({
    ...node,
    careerMeta: extractCareerMeta(content ?? '').careerMeta,
  }));
}

export type CareerEntry = Awaited<ReturnType<typeof getCareers>>[number];

/** During `next build` WordPress may be unreachable (docker build): render an
 *  empty state and let ISR refill it. At runtime rethrow, so a failed
 *  revalidation keeps the last good page instead of caching an empty one. */
export async function orEmpty<T>(load: () => Promise<T[]>, label: string): Promise<T[]> {
  try {
    return await load();
  } catch (err) {
    if (process.env.NEXT_PHASE !== 'phase-production-build') throw err;
    console.error(`[wordpress] ${label}`, err);
    return [];
  }
}
