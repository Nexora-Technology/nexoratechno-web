import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import CaseStudiesListing from '@/components/case-studies/case-studies-listing';
import { STATIC_CASES } from '@/lib/static-content';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Case Studies' };
}

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <CaseStudiesListing staticCases={STATIC_CASES} locale={locale} />;
}