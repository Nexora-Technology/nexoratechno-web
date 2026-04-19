import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { STATIC_BLOG_POSTS } from '@/lib/static-content';
import BlogDetailView from '@/components/blog/blog-detail-view';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  return STATIC_BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = STATIC_BLOG_POSTS.find((p) => p.slug === slug);
  return { title: post?.title ?? 'Blog' };
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = STATIC_BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();
  return <BlogDetailView post={post} locale={locale} />;
}
