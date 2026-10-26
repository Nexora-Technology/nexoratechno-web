import { NextResponse } from 'next/server';
import { getCaseStudies } from '@/lib/wordpress-content';

export async function GET() {
  try {
    return NextResponse.json(await getCaseStudies(), {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' },
    });
  } catch (err) {
    console.error('[WP API /case-studies]', err);
    return NextResponse.json({ error: 'Failed to fetch case studies' }, { status: 500 });
  }
}
