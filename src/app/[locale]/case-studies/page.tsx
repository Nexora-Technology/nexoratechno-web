import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import CaseStudiesListing from '@/components/case-studies/case-studies-listing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Case Studies',
    description: 'Real-world projects delivered by Nexora Technology — web platforms, mobile apps, IoT systems, and legacy migrations.',
    openGraph: { type: 'website', title: 'Case Studies — Nexora Technology' },
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
