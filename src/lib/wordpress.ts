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

// ─── ACF Meta Types ────────────────────────────────────────────────────────────

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
    careerMeta {
      department
      location
      salary
      jobType
      level
    }
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
  const m = html.match(/<!--\s*case-meta:(\{[\s\S]*?\})\s*-->/);
  if (!m) return { caseMeta: null, cleanContent: html };
  try {
    const caseMeta = JSON.parse(m[1]) as ExtractedCaseMeta;
    return { caseMeta, cleanContent: html.replace(m[0], '').trim() };
  } catch {
    return { caseMeta: null, cleanContent: html };
  }
}
