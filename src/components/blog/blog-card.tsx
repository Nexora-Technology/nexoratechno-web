import Link from 'next/link';
import type { BlogPost } from '@/lib/static-content';

const GRADIENT_PAIRS = [
  ['#4F46E5', '#06B6D4'],
  ['#7C3AED', '#EC4899'],
  ['#DAB660', '#4F46E5'],
  ['#059669', '#06B6D4'],
];

interface Props {
  post: BlogPost;
  locale: string;
  index?: number;
}

export default function BlogCard({ post, locale, index = 0 }: Props) {
  const [c1, c2] = GRADIENT_PAIRS[index % GRADIENT_PAIRS.length];

  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="blog-card"
      style={{ '--c1': c1, '--c2': c2 } as React.CSSProperties}
    >
      <div className="blog-card-visual" />
      <div className="blog-card-body">
        <div className="b-cat">{post.category}</div>
        <h3>{post.title}</h3>
        <p className="b-sum">{post.summary}</p>
        <div className="blog-card-foot">
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>
      </div>

      <style>{`
        .blog-card {
          display: flex; flex-direction: column; overflow: hidden;
          border-radius: var(--radius-lg); border: 1px solid var(--color-line);
          background: var(--color-bg-elev); cursor: pointer;
          transition: border-color .2s, transform .2s, box-shadow .2s;
        }
        .blog-card:hover {
          border-color: var(--color-line-strong);
          transform: translateY(-3px);
          box-shadow: 0 6px 24px rgba(0,0,0,.06);
        }
        .blog-card-visual {
          aspect-ratio: 16/10;
          background: linear-gradient(135deg, var(--c1, #4F46E5) 0%, var(--c2, #06B6D4) 100%);
          position: relative; overflow: hidden;
        }
        .blog-card-visual::after {
          content: ""; position: absolute; inset: 0;
          background-image:
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25) 0%, transparent 40%),
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: auto, 28px 28px, 28px 28px;
        }
        .blog-card-body {
          padding: 24px; display: flex; flex-direction: column;
          gap: 12px; flex: 1;
        }
        .blog-card-body .b-cat {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: .12em; text-transform: uppercase;
          color: var(--color-accent-ink);
        }
        .blog-card-body h3 {
          font-size: 18px; letter-spacing: -.015em; line-height: 1.3;
          color: var(--color-ink);
        }
        .blog-card-body .b-sum {
          font-size: 14px; color: var(--color-ink-soft); line-height: 1.55;
          display: -webkit-box; -webkit-line-clamp: 3;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .blog-card-foot {
          margin-top: auto; padding-top: 12px;
          border-top: 1px solid var(--color-line);
          display: flex; justify-content: space-between;
          font-size: 12.5px; color: var(--color-ink-mute);
        }
      `}</style>
    </Link>
  );
}
