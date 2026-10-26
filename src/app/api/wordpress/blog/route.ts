import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/wordpress-content';

export async function GET() {
  try {
    return NextResponse.json(await getBlogPosts(), {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' },
    });
  } catch (err) {
    console.error('[WP API /blog]', err);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
