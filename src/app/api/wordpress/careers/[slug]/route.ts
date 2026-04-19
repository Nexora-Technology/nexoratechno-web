import { NextRequest, NextResponse } from 'next/server';
import { wpClient, CAREER_BASE_FIELDS, WPCareer } from '@/lib/wordpress';

const GET_CAREER = `
  ${CAREER_BASE_FIELDS}
  query GetCareer($slug: ID!) {
    career(id: $slug, idType: SLUG) {
      ...CareerBaseFields
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
    const data = await wpClient.request<{ career: WPCareer | null }>(
      GET_CAREER,
      { slug }
    );
    if (!data.career) {
      return NextResponse.json({ error: 'Career not found' }, { status: 404 });
    }
    return NextResponse.json(data.career);
  } catch (err) {
    console.error('[WP API /careers/slug]', err);
    return NextResponse.json({ error: 'Failed to fetch career' }, { status: 500 });
  }
}
