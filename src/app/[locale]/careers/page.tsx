import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { buildAlternates, OG_IMAGES } from '@/lib/seo';
import CareersListing from '@/components/careers/careers-listing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Careers',
    description: 'Join Nexora Technology — explore open positions in software engineering, mobile development, IoT, and more in Ho Chi Minh City.',
    alternates: buildAlternates(locale, '/careers'),
    openGraph: { type: 'website', title: 'Careers — Nexora Technology', images: OG_IMAGES },
  };
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <CareersListing locale={locale} />;
}
