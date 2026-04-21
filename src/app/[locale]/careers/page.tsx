import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import CareersListing from '@/components/careers/careers-listing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Careers' };
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <CareersListing locale={locale} />;
}
