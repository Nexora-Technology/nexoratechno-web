import { Link } from '@/i18n/routing';
import { BlogImage, type BlogItem } from './blog-card';

interface Props { post: BlogItem; label: string; readLabel: string; }

export default function BlogFeaturedCard({ post, label, readLabel }: Props) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="sub-featured">
      <Link href={href} className="sub-card-link" tabIndex={-1} aria-hidden="true">
        <BlogImage src={post.image} eager />
      </Link>
      <div>
        <p className="mono">{label}</p>
        <p className="mono sub-featured-meta">{[post.date, post.category].filter(Boolean).join(' · ')}</p>
        <h2>
          <Link href={href}>{post.title}</Link>
        </h2>
        {post.excerpt && <p className="sub-card-summary">{post.excerpt}</p>}
        <Link href={href} className="text-link" aria-label={`${readLabel}: ${post.title}`}>
          {readLabel} <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
