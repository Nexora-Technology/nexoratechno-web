import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { tokenMatches } from '@/lib/revalidate-token';

// Refreshes every ISR page (home, listings, details) on demand. deploy.sh calls
// it after a new container starts: CI cannot reach WordPress, so build-time
// pages are empty until revalidated.
export async function POST(req: NextRequest) {
  if (!tokenMatches(process.env.REVALIDATE_TOKEN, req.headers.get('x-revalidate-token'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  revalidatePath('/', 'layout');
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
