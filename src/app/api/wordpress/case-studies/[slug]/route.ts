import { NextRequest, NextResponse } from 'next/server';
import { wpClient, CASE_STUDY_BASE_FIELDS, WPCaseStudy } from '@/lib/wordpress';

const GET_CASE_STUDY = `
  ${CASE_STUDY_BASE_FIELDS}
  query GetCaseStudy($slug: ID!) {
    caseStudy(id: $slug, idType: SLUG) {
      ...CaseStudyBaseFields
      content
    }
  }
`;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const data = await wpClient.request<{ caseStudy: WPCaseStudy | null }>(
      GET_CASE_STUDY,
      { slug }
    );
    if (!data.caseStudy) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }
    return NextResponse.json(data.caseStudy);
  } catch (err) {
    console.error('[WP API /case-studies/slug]', err);
    return NextResponse.json({ error: 'Failed to fetch case study' }, { status: 500 });
  }
}
