import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { STATIC_CASES } from '@/lib/static-content';
import CaseDetailView from '@/components/case-studies/case-detail-view';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return STATIC_CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = STATIC_CASES.find((c) => c.slug === slug);
  return { title: item?.title ?? 'Case Study' };
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const item = STATIC_CASES.find((c) => c.slug === slug);
  if (!item) notFound();
  return <CaseDetailView item={item} locale={locale} />;
}