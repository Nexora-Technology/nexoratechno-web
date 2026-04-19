import Link from 'next/link';
import type { BlogPost } from '@/lib/static-content';

interface Props { post: BlogPost; locale: string; }

export default function BlogCard({ post, locale }: Props) {
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="blog-card group flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] transition-all duration-200 hover:border-[var(--color-line-strong)] hover:-translate-y-0.5 hover:shadow-lg"
    >
      {/* Gradient visual */}
      <div className="blog-card-visual relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-grad-start)] to-[var(--color-grad-end)]" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <span className="absolute top-4 left-4 z-10 text-xs font-mono tracking-widest uppercase text-white px-3 py-1.5 rounded-full border border-white/30 backdrop-blur-sm bg-white/10">
          {post.category}
        </span>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        <h3 className="text-xl font-display font-semibold tracking-tight text-[var(--color-ink)] leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed line-clamp-2 flex-1">
          {post.summary}
        </p>
        <div className="flex items-center gap-2 pt-3 text-xs text-[var(--color-ink-mute)] border-t border-[var(--color-line)]">
          <span className="font-medium">{post.author}</span>
          <span>·</span>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}
