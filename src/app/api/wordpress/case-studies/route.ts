import { NextResponse } from 'next/server';
import {
  wpClient,
  CASE_STUDY_BASE_FIELDS,
  WPCaseStudy,
  extractCaseMeta,
} from '@/lib/wordpress';

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

type RawCaseStudy = Omit<WPCaseStudy, 'content'> & { content?: string };

export async function GET() {
  try {
    const data = await wpClient.request<{ caseStudies: { nodes: RawCaseStudy[] } }>(
      GET_CASE_STUDIES,
      { first: 50 }
    );

    const enriched = data.caseStudies.nodes.map((node) => {
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

    return NextResponse.json(enriched, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' },
    });
  } catch (err) {
    console.error('[WP API /case-studies]', err);
    return NextResponse.json({ error: 'Failed to fetch case studies' }, { status: 500 });
  }
}
