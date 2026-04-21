'use client';

import BlogListing from '@/components/blog/blog-listing';

interface Props { locale: string; }

export default function BlogPageClient({ locale }: Props) {
  return <BlogListing locale={locale} />;
}
