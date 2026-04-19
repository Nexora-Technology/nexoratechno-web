import type Metadata from 'next';
export const dynamic = 'force-static';

export default async function RootPage() {
  const { redirect } = await import('next/navigation');
  redirect('/vi');
}