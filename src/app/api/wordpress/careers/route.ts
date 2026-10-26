import { NextResponse } from 'next/server';
import { getCareers } from '@/lib/wordpress-content';

export async function GET() {
  try {
    return NextResponse.json(await getCareers(), {
      headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' },
    });
  } catch (err) {
    console.error('[WP API /careers]', err);
    return NextResponse.json({ error: 'Failed to fetch careers' }, { status: 500 });
  }
}
