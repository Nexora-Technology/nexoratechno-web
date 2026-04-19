import Link from 'next/link';
import type { BlogPost } from '@/lib/static-content';

interface Props { post: BlogPost; locale: string; }

export default function BlogFeaturedCard({ post, locale }: Props) {
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="blog-featured"
    >
      {/* Left: gradient visual */}
      <div className="blog-featured-visual">
        <span className="blog-featured-label">{post.category}</span>
      </div>

      {/* Right: content */}
      <div className="blog-featured-body">
        <div className="b-cat">{post.category}</div>
        <h2>{post.title}</h2>
        <p>{post.summary}</p>
        <div className="blog-featured-meta">
          <span>{post.author}</span>
          <span className="dot">·</span>
          <span>{post.date}</span>
          <span className="dot">·</span>
          <span>{post.readTime}</span>
        </div>
      </div>

      <style>{`
        .blog-featured {
          display: grid;
          grid-template-columns: 1.3fr 1fr;
          gap: 0;
          background: var(--color-bg-elev);
          border: 1px solid var(--color-line);
          border-radius: var(--radius-xl);
          overflow: hidden;
          margin-bottom: 40px;
          min-height: 420px;
          cursor: pointer;
          transition: border-color .2s;
        }
        .blog-featured:hover { border-color: var(--color-line-strong); }
        @media (max-width: 820px) { .blog-featured { grid-template-columns: 1fr; } }

        .blog-featured-visual {
          background:
            radial-gradient(ellipse at top right, rgba(255,255,255,0.15), transparent 55%),
            linear-gradient(135deg, var(--color-accent) 0%, var(--color-grad-start) 55%, var(--color-grad-end) 100%);
          position: relative; overflow: hidden;
        }
        .blog-featured-visual::after {
          content: ""; position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .blog-featured-label {
          position: absolute; top: 24px; left: 24px;
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: .14em; text-transform: uppercase;
          color: white; z-index: 1; padding: 6px 12px;
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 9999px; backdrop-filter: blur(6px);
        }

        .blog-featured-body {
          padding: 48px; display: flex; flex-direction: column;
          gap: 24px; justify-content: center;
        }
        @media (max-width: 640px) { .blog-featured-body { padding: 32px 28px; } }

        .blog-featured-body .b-cat {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: .12em; text-transform: uppercase;
          color: var(--color-accent-ink);
        }
        .blog-featured-body h2 {
          font-size: clamp(28px, 3.4vw, 40px);
          letter-spacing: -.025em; line-height: 1.1;
          color: var(--color-ink);
        }
        .blog-featured-body p {
          font-size: 16px; color: var(--color-ink-soft);
          max-width: 48ch; line-height: 1.55;
        }
        .blog-featured-meta {
          font-size: 13px; color: var(--color-ink-mute);
          font-family: var(--font-mono);
          letter-spacing: .08em; text-transform: uppercase;
          display: flex; align-items: center; gap: 8px;
        }
        .blog-featured-meta .dot { opacity: .5; }
      `}</style>
    </Link>
  );
}
