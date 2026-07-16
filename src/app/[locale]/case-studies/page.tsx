import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { buildAlternates, OG_IMAGES } from '@/lib/seo';
import CaseStudiesListing from '@/components/case-studies/case-studies-listing';

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
    title: 'Case Studies',
    description: 'Real-world projects delivered by Nexora Technology — web platforms, mobile apps, IoT systems, and legacy migrations.',
    alternates: buildAlternates(locale, '/case-studies'),
    openGraph: { type: 'website', title: 'Case Studies — Nexora Technology', images: OG_IMAGES },
  };
}

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <CaseStudiesListing locale={locale} />;
}
