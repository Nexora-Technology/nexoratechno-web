import Link from 'next/link';
import type { BlogPost } from '@/lib/static-content';

interface Props { post: BlogPost; locale: string; }

export default function BlogFeaturedCard({ post, locale }: Props) {
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="blog-featured group"
    >
      {/* Left: gradient visual */}
      <div className="blog-featured-visual relative overflow-hidden min-h-[420px]">
        <span className="blog-featured-label">{post.category}</span>
      </div>

      {/* Right: content */}
      <div className="blog-featured-body flex flex-col justify-between p-10 md:p-12">
        <div className="space-y-4">
          <span className="text-xs font-mono tracking-widest uppercase text-[var(--color-ink-mute)]">
            {post.category}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight leading-tight text-[var(--color-ink)]">
            {post.title}
          </h2>
          <p className="text-base text-[var(--color-ink-soft)] leading-relaxed line-clamp-3">
            {post.summary}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-6 text-sm text-[var(--color-ink-mute)] border-t border-[var(--color-line)] mt-6">
          <span className="font-medium text-[var(--color-ink)]">{post.author}</span>
          <span>·</span>
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.readTime}</span>
        </div>
      </div>

      <style>{`
        .blog-featured {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          background: var(--color-bg-elev);
          border: 1px solid var(--color-line);
          border-radius: var(--radius-xl);
          overflow: hidden;
          margin-bottom: 40px;
          min-height: 420px;
          transition: border-color 0.2s;
        }
        .blog-featured:hover { border-color: var(--color-line-strong); }
        @media (max-width: 820px) { .blog-featured { grid-template-columns: 1fr; } }
        .blog-featured-visual {
          background: radial-gradient(ellipse at 65% 35%, rgba(255,255,255,0.18) 0%, transparent 55%),
            linear-gradient(135deg, var(--color-accent) 0%, var(--color-grad-start) 55%, var(--color-grad-end) 100%);
        }
        .blog-featured-visual::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .blog-featured-label {
          position: absolute;
          top: 24px; left: 24px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: white;
          z-index: 1;
          padding: 6px 12px;
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 9999px;
          backdrop-filter: blur(6px);
        }
        .blog-featured-body { padding: 48px; display: flex; flex-direction: column; justify-content: space-between; }
        @media (max-width: 640px) { .blog-featured-body { padding: 28px; } }
      `}</style>
    </Link>
  );
}
