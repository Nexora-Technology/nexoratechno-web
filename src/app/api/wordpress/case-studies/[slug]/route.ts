import { NextRequest, NextResponse } from 'next/server';
import {
  wpClient,
  CASE_STUDY_BASE_FIELDS,
  WPCaseStudy,
  extractCaseMeta,
} from '@/lib/wordpress';

const GET_CASE_STUDY = `
  ${CASE_STUDY_BASE_FIELDS}
  query GetCaseStudy($slug: ID!) {
    caseStudy(id: $slug, idType: SLUG) {
      ...CaseStudyBaseFields
      content
    }
  }
`;

type RawCaseStudy = Omit<WPCaseStudy, 'content'> & { content?: string };

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const data = await wpClient.request<{ caseStudy: RawCaseStudy | null }>(
      GET_CASE_STUDY,
      { slug }
    );
    if (!data.caseStudy) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    const node = data.caseStudy;
    const { caseMeta, cleanContent } = extractCaseMeta(node.content ?? '');
    const services = caseMeta?.services ?? [];

    return NextResponse.json({
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
      categories: {
        nodes: services.map((s) => ({ name: s, slug: s.toLowerCase().replace(/\s+/g, '-') })),
      },
      metrics: caseMeta?.metrics ?? [],
    });
  } catch (err) {
    console.error('[WP API /case-studies/slug]', err);
    return NextResponse.json({ error: 'Failed to fetch case study' }, { status: 500 });
  }
}
