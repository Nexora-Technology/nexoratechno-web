import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { BlogPost } from '@/lib/static-content';
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
    const prefix = locale === 'vi' ? '' : `/${locale}`;
    return {
      title,
      description: description || `Read "${title}" on Nexora Technology Blog.`,
      openGraph: { type: 'article', title, description },
      alternates: { canonical: `https://nexoratechno.com${prefix}/blog/${slug}` },
    };
  } catch {
    return { title: 'Blog' };
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  try {
    const res = await fetch(`${BASE_URL}/api/wordpress/blog/${slug}`);
    if (!res.ok) notFound();
    const p = await res.json();
    if (!p || p.error) notFound();

    const cats = p.categories as { nodes?: Array<{ name: string }> } | null;
    const catName = cats?.nodes?.[0]?.name ?? 'General';
    const auth = p.author as { node: { name: string } } | null;
    const authName = auth?.node?.name ?? '';

    const post: BlogPost = {
      slug: String(p.slug),
      title: String(p.title || '').replace(/<[^>]*>/g, ''),
      category: catName,
      author: authName,
      authorRole: '',
      date: new Date(String(p.date)).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }),
      readTime: '5 phút đọc',
      summary: String(p.excerpt || '').replace(/<[^>]*>/g, ''),
      body: [],
      tags: [],
      wpContent: String(p.content || ''),
    };

    return <BlogDetailView post={post} locale={locale} />;
  } catch {
    notFound();
  }
}
