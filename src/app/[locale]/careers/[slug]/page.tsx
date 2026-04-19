import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { STATIC_CAREERS } from '@/lib/static-content';
import CareerDetailView from '@/components/careers/career-detail-view';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return STATIC_CAREERS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const career = STATIC_CAREERS.find((c) => c.slug === slug);
  return { title: career?.title ?? 'Careers' };
}

export default async function CareerDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const career = STATIC_CAREERS.find((c) => c.slug === slug);
  if (!career) notFound();
  return <CareerDetailView career={career} locale={locale} />;
}
