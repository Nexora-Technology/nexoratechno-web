import { NextResponse } from 'next/server';
import { wpClient, CAREER_BASE_FIELDS, WPCareer, extractCareerMeta } from '@/lib/wordpress';

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

export async function GET() {
  try {
    const data = await wpClient.request<{ careers: { nodes: WPCareer[] } }>(
      GET_CAREERS,
      { first: 50 }
    );
    const careers = data.careers.nodes.map(({ content, ...node }) => ({
      ...node,
      careerMeta: extractCareerMeta(content ?? '').careerMeta,
    }));
    return NextResponse.json(careers, {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' },
    });
  } catch (err) {
    console.error('[WP API /careers]', err);
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 });
  }
}
