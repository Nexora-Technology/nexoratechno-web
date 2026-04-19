'use client';

import BlogListing from '@/components/blog/blog-listing';
import { STATIC_BLOG_POSTS } from '@/lib/static-content';

interface Props { locale: string; }

export default function BlogPageClient({ locale }: Props) {
  return <BlogListing staticPosts={STATIC_BLOG_POSTS} locale={locale} />;
}
