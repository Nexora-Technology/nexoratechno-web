import { NextResponse } from 'next/server';
import { wpClient, CASE_STUDY_BASE_FIELDS, WPCaseStudy } from '@/lib/wordpress';

const GET_CASE_STUDIES = `
  ${CASE_STUDY_BASE_FIELDS}
  query GetCaseStudies($first: Int!) {
    caseStudies(first: $first) {
      nodes { ...CaseStudyBaseFields }
    }
  }
`;

export async function GET() {
  try {
    const data = await wpClient.request<{ caseStudies: { nodes: WPCaseStudy[] } }>(
      GET_CASE_STUDIES,
      { first: 20 }
    );
    return NextResponse.json(data.caseStudies.nodes, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' },
    });
  } catch (err) {
    console.error('[WP API /case-studies]', err);
    return NextResponse.json({ error: 'Failed to fetch case studies' }, { status: 500 });
  }
}
