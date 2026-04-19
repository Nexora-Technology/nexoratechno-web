import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import BlogPageClient from '@/components/blog/blog-page-client';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Blog' };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <BlogPageClient locale={locale} />;
}
