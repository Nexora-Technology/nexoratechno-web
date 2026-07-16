import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { buildAlternates, OG_IMAGES } from '@/lib/seo';
import BlogPageClient from '@/components/blog/blog-page-client';

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
    title: 'Blog',
    description: 'Insights on software development, technology trends, and engineering best practices from Nexora Technology.',
    alternates: buildAlternates(locale, '/blog'),
    openGraph: { type: 'website', title: 'Blog — Nexora Technology', images: OG_IMAGES },
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <BlogPageClient locale={locale} />;
}
