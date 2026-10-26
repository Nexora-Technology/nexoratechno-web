import { GraphQLClient, gql } from 'graphql-request';

const WPGRAPHQL_URL = process.env.WPGRAPHQL_URL || 'http://localhost:8080/graphql';

export const wpClient = new GraphQLClient(WPGRAPHQL_URL);

// ─── Base Types ────────────────────────────────────────────────────────────────

export interface WPAuthor {
  node: { name: string; slug: string };
}

export interface WPMedia {
  node: { sourceUrl: string; altText: string };
}

export interface WPCategory {
  name: string;
  slug: string;
}

// ─── Meta Types (embedded as JSON comments in content, see extractEmbeddedMeta) ─

export interface CareerMeta {
  department: string;
  location: string;
  salary: string;
  jobType: string;
  level: string;
}

export interface CaseMeta {
  client: string;
  industry: string;
  year: string;
  duration: string;
  team: string;
  color: string;
}

// ─── Post Types ────────────────────────────────────────────────────────────────

export interface WPPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  author: WPAuthor;
  categories: { nodes: WPCategory[] };
  featuredImage: WPMedia | null;
}

export interface WPCareer {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  careerMeta: CareerMeta | null;
}

export interface WPCaseStudy {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  modified: string;
  featuredImage: WPMedia | null;
  caseMeta: CaseMeta | null;
}

// ─── GraphQL Fragments ─────────────────────────────────────────────────────────

export const POST_BASE_FIELDS = gql`
  fragment PostBaseFields on Post {
    id
    slug
    title
    excerpt
    date
    modified
    author {
      node { name slug }
    }
    categories { nodes { name slug } }
    featuredImage { node { sourceUrl altText } }
  }
`;

export const CAREER_BASE_FIELDS = gql`
  fragment CareerBaseFields on Career {
    id
    slug
    title
    excerpt
    date
    modified
  }
`;

// caseMeta is embedded as a JSON comment block inside `content` (see extractCaseMeta).
// This avoids dependency on ACF + WPGraphQL-for-ACF plugins.
export const CASE_STUDY_BASE_FIELDS = gql`
  fragment CaseStudyBaseFields on CaseStudy {
    id
    slug
    title
    excerpt
    date
    modified
    featuredImage { node { sourceUrl altText } }
  }
`;

// WordPress texturizes rendered content (quotes, dashes, ampersands become entities);
// the body renders as plain text, so strip tags and decode entities back to characters.
const NAMED_ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
export function textOf(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&#(x?)([0-9a-f]+);/gi, (_, hex, n) => String.fromCodePoint(parseInt(n, hex ? 16 : 10)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, name) => NAMED_ENTITIES[name])
    .trim();
}

// ─── Meta extraction (embedded JSON in content) ────────────────────────────────

export interface ExtractedCaseMeta extends CaseMeta {
  services?: string[];
  metrics?: { label: string; value: string }[];
}

/**
 * Parse `<!-- case-meta:{...} -->` JSON block from post content.
 * Returns parsed meta + content with the comment stripped.
 */
export function extractCaseMeta(html: string): {
  caseMeta: ExtractedCaseMeta | null;
  cleanContent: string;
} {
  const { meta, cleanContent } = extractEmbeddedMeta<ExtractedCaseMeta>(html, 'case-meta');
  return { caseMeta: meta, cleanContent };
}

/** Parse `<!-- career-meta:{...} -->`, the career counterpart of case-meta. */
export function extractCareerMeta(html: string): {
  careerMeta: CareerMeta | null;
  cleanContent: string;
} {
  const { meta, cleanContent } = extractEmbeddedMeta<CareerMeta>(html, 'career-meta');
  return { careerMeta: meta, cleanContent };
}

function extractEmbeddedMeta<T>(html: string, key: string): { meta: T | null; cleanContent: string } {
  const m = html.match(new RegExp(`<!--\\s*${key}:(\\{[\\s\\S]*?\\})\\s*-->`));
  if (!m) return { meta: null, cleanContent: html };
  try {
    return { meta: JSON.parse(m[1]) as T, cleanContent: html.replace(m[0], '').trim() };
  } catch {
    return { meta: null, cleanContent: html };
  }
}
