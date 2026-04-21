'use client';

import { useTranslations } from 'next-intl';
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
}

export default function BlogDetailView({ post, locale }: Props) {
  const t = useTranslations();

  const [c1, c2] = GRADIENT_PAIRS[0];

  const initials = post.author
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      {/* Hero */}
      <section className="subpage-hero" style={{ paddingBottom: 32 }}>
        <div className="container subpage-hero-inner">
          <div className="crumb">
            <Link href={`/${locale}`}>{t('sub_home')}</Link>
            <span className="crumb-sep">/</span>
            <Link href={`/${locale}/blog`}>{t('blog_eyebrow')}</Link>
            <span className="crumb-sep">/</span>
            <span>{post.category}</span>
          </div>

          <span className="eyebrow">{post.category}</span>
          <h1 className="subpage-title" style={{ maxWidth: '24ch' }}>{post.title}</h1>
          <p className="subpage-lead">{post.summary}</p>

          <div className="detail-author" style={{ marginTop: 28, borderTop: 0, paddingTop: 16 }}>
            <div className="testi-avatar">{initials}</div>
            <div>
              <div className="detail-author-name">{post.author}</div>
              <div className="detail-author-role">
                {post.authorRole} · {post.date} · {post.readTime}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual banner */}
      <div className="container">
        <div
          className="blog-detail-visual"
          style={{ '--c1': c1, '--c2': c2 } as React.CSSProperties}
        />

        {/* Body */}
        <div className="detail-wrap">
          <div className="detail-body">
            {post.wpContent ? (
              <div dangerouslySetInnerHTML={{ __html: post.wpContent }} />
            ) : (
              post.body.map((block, i) => (
                <div key={i}>
                  <h2>{block.h}</h2>
                  {block.p && <p>{block.p}</p>}
                  {block.list && (
                    <ul>
                      {block.list.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="tag-row" style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--color-line)' }}>
              {post.tags.map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>
          )}

          {/* Back */}
          <div style={{ marginTop: 40 }}>
            <Link href={`/${locale}/blog`} className="btn-ghost">
              {t('blog_back')}
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="detail-cta" style={{ marginTop: 40 }}>
          <div>
            <h3>{t('sub_cta_title')}</h3>
            <p>{t('sub_cta_desc')}</p>
          </div>
          <Link href={`/${locale}/#contact`} className="btn-accent">
            {t('sub_cta_btn')}
          </Link>
        </div>

        <div style={{ height: 80 }} />
      </div>

      <style>{`
        .subpage-hero {
          padding-top: 140px; padding-bottom: 56px;
          background: var(--color-bg-soft);
          border-bottom: 1px solid var(--color-line);
          position: relative; overflow: hidden;
        }
        .subpage-hero::before {
          content: ""; position: absolute; right: -20%; top: -80%;
          width: 70%; height: 260%;
          background: radial-gradient(ellipse at center,
            color-mix(in oklab, var(--color-accent) 18%, transparent) 0%,
            transparent 60%);
          pointer-events: none;
        }
        .subpage-hero-inner { position: relative; z-index: 1; }
        .eyebrow {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: .12em; text-transform: uppercase;
          color: var(--color-ink-mute); display: block; margin-bottom: 4px;
        }
        .subpage-title {
          font-size: clamp(40px, 5.5vw, 80px);
          letter-spacing: -.035em; line-height: 1.02;
          font-family: var(--font-display); color: var(--color-ink);
        }
        .subpage-lead {
          margin-top: 20px; font-size: clamp(17px, 1.6vw, 20px);
          color: var(--color-ink-soft); max-width: 60ch; line-height: 1.55;
        }
        .crumb {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: .12em; text-transform: uppercase;
          color: var(--color-ink-mute); margin-bottom: 28px;
        }
        .crumb a { color: var(--color-ink-mute); transition: color .2s; text-decoration: none; }
        .crumb a:hover { color: var(--color-ink); }
        .crumb-sep { color: var(--color-ink-mute); opacity: .5; }

        .blog-detail-visual {
          max-width: 1080px; height: 340px; margin: 40px auto 48px;
          border-radius: var(--radius-xl); overflow: hidden;
          position: relative;
          background: linear-gradient(135deg, var(--c1) 0%, var(--c2) 100%);
        }
        .blog-detail-visual::after {
          content: ""; position: absolute; inset: 0;
          background-image:
            radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25) 0%, transparent 40%),
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px);
          background-size: auto, 28px 28px, 28px 28px;
        }
        @media (max-width: 680px) { .blog-detail-visual { height: 220px; } }

        .detail-author {
          display: flex; align-items: center; gap: 14px;
          padding: 18px 0;
          border-top: 1px solid var(--color-line);
          border-bottom: 1px solid var(--color-line);
        }
        .detail-author .testi-avatar {
          width: 44px; height: 44px;
        }
        .detail-author-name { font-size: 14px; font-weight: 600; color: var(--color-ink); }
        .detail-author-role { font-size: 12.5px; color: var(--color-ink-mute); margin-top: 2px; }

        .detail-wrap {
          max-width: 780px; margin: 0 auto; padding: 0 20px;
        }
        .detail-body {
          font-size: 17px; line-height: 1.75; color: var(--color-ink-soft);
        }
        .detail-body h2 {
          font-size: 28px; color: var(--color-ink); margin: 48px 0 16px;
          letter-spacing: -.02em; font-family: var(--font-display);
        }
        .detail-body h3 {
          font-size: 20px; color: var(--color-ink); margin: 32px 0 12px;
        }
        .detail-body p { margin: 14px 0; }
        .detail-body ul {
          padding-left: 0; list-style: none; margin: 14px 0;
        }
        .detail-body ul li {
          position: relative; padding-left: 28px;
          font-size: 17px; color: var(--color-ink-soft);
          line-height: 1.6; margin: 10px 0;
        }
        .detail-body ul li::before {
          content: ""; position: absolute;
          left: 0; top: .75em; width: 16px; height: 1px;
          background: var(--color-accent);
        }

        .blog-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
        }
        @media (max-width: 900px) { .blog-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .blog-grid { grid-template-columns: 1fr; } }

        .detail-cta {
          margin: 0 auto; max-width: 1080px; padding: 56px 48px;
          background: var(--color-ink); color: var(--color-bg);
          border-radius: var(--radius-xl);
          display: grid; grid-template-columns: 1fr auto;
          gap: 24px; align-items: center;
        }
        [data-theme="dark"] .detail-cta {
          background: var(--color-bg-elev);
          border: 1px solid var(--color-line);
        }
        .detail-cta h3 {
          color: var(--color-bg);
          font-size: clamp(22px, 2.8vw, 32px);
          letter-spacing: -.02em; max-width: 22ch;
        }
        [data-theme="dark"] .detail-cta h3 { color: var(--color-ink); }
        .detail-cta p {
          color: rgba(255,255,255,0.7);
          font-size: 15px; margin-top: 8px; max-width: 50ch;
        }
        [data-theme="dark"] .detail-cta p { color: var(--color-ink-soft); }
        @media (max-width: 680px) {
          .detail-cta { grid-template-columns: 1fr; padding: 32px 28px; }
        }

        .btn-accent {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 9999px;
          background: var(--color-accent); color: #1A1508;
          font-weight: 600; font-size: 15px;
          transition: opacity .2s; text-decoration: none;
        }
        .btn-accent:hover { opacity: .9; }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 12px 24px; border-radius: 9999px;
          border: 1px solid var(--color-line);
          color: var(--color-ink); font-size: 14px; font-weight: 500;
          transition: border-color .2s; text-decoration: none;
        }
        .btn-ghost:hover { border-color: var(--color-line-strong); }

        .tag-pill {
          display: inline-block; padding: 4px 10px;
          font-size: 12px; font-weight: 500;
          background: var(--color-bg-soft);
          border: 1px solid var(--color-line);
          border-radius: 9999px; color: var(--color-ink-soft);
        }
        .tag-row { display: flex; flex-wrap: wrap; gap: 6px; }
      `}</style>
    </>
  );
}
