import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { BlogPost } from '@/lib/static-content';
import { buildAlternates, OG_IMAGES } from '@/lib/seo';
import { textOf } from '@/lib/wordpress';
import BlogDetailView from '@/components/blog/blog-detail-view';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateStaticParams() {
  try {
    const res = await fetch(`${BASE_URL}/api/wordpress/blog`);
    if (!res.ok) return [];
    const posts = await res.json();
    if (!Array.isArray(posts)) return [];
    return posts.map((p: { slug: string }) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  try {
    const res = await fetch(`${BASE_URL}/api/wordpress/blog/${slug}`);
    if (!res.ok) return { title: 'Blog' };
    const post = await res.json();
    const title = String(post?.title || 'Blog').replace(/<[^>]*>/g, '');
    const description = String(post?.excerpt || '').replace(/<[^>]*>/g, '').slice(0, 160);
    return {
      title,
      description: description || `Read "${title}" on Nexora Technology Blog.`,
      openGraph: { type: 'article', title, description, images: OG_IMAGES },
      twitter: { card: 'summary_large_image', title, description, images: OG_IMAGES },
      alternates: buildAlternates(locale, `/blog/${slug}`),
    };
  } catch {
    return { title: 'Blog' };
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  try {
    const res = await fetch(`${BASE_URL}/api/wordpress/blog/${slug}`);
    if (!res.ok) notFound();
    const p = await res.json();
    if (!p || p.error) notFound();

    const post: BlogPost = {
      slug: String(p.slug),
      title: textOf(String(p.title || '')),
      category: p.categories?.nodes?.[0]?.name ?? '',
      author: p.author?.node?.name ?? '',
      date: String(p.date),
      summary: textOf(String(p.excerpt || '')),
      image: p.featuredImage?.node?.sourceUrl,
      wpContent: String(p.content || ''),
    };

    return <BlogDetailView post={post} locale={locale} />;
  } catch {
    notFound();
  }
}
