import { Link } from '@/i18n/routing';

export interface BlogItem {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // already formatted for the locale
  image?: string;
}

export function BlogImage({ src, eager }: { src?: string; eager?: boolean }) {
  return (
    <div className="archive-image">
      {src && (
        <img
          src={src}
          alt=""
          width={1600}
          height={900}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
}

export default function BlogCard({ post, readLabel }: { post: BlogItem; readLabel: string }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="archive-card">
      <Link href={href} className="sub-card-link">
        <BlogImage src={post.image} />
        <span className="mono">{[post.date, post.category].filter(Boolean).join(' · ')}</span>
        <h4>{post.title}</h4>
      </Link>
      {post.excerpt && <p className="sub-card-summary">{post.excerpt}</p>}
      <Link href={href} className="text-link sub-card-more" aria-label={`${readLabel}: ${post.title}`}>
        {readLabel} <span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}
