'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import type { BlogPost } from '@/lib/static-content';
import BlogFeaturedCard from './blog-featured-card';
import BlogFilter from './blog-filter';
import BlogCard from './blog-card';

interface Props {
  staticPosts: BlogPost[];
  locale: string;
}

const CATEGORIES = ['Kỹ thuật', 'Mobile', 'Design', 'Văn hóa công ty', 'Security'];

export default function BlogListing({ staticPosts, locale }: Props) {
  const t = useTranslations();
  const [posts, setPosts] = useState<BlogPost[]>(staticPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wordpress/blog')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: BlogPost[] = data.map((p: Record<string, unknown>) => {
            const cats = p.categories as Record<string, unknown> | null;
            const catNode = (cats && typeof cats === 'object') ? (cats as {nodes?: Array<{name:string}>}).nodes?.[0]?.name : 'General';
            const auth = p.author as Record<string, unknown> | null;
            const authName = (auth && typeof auth === 'object') ? (auth as {node:{name:string}}).node?.name : '';
            return {
              slug: String(p.slug),
              title: String(p.title || '').replace(/<[^>]*>/g, ''),
              category: String(catNode || 'General'),
              author: String(authName || ''),
              authorRole: '',
              date: new Date(String(p.date)).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }),
              readTime: '5 phút đọc',
              summary: String(p.excerpt || '').replace(/<[^>]*>/g, ''),
              body: [],
              tags: [],
            };
          });
          setPosts(mapped.length > 0 ? mapped : staticPosts);
        }
      })
      .catch(() => { /* fall through to static */ })
      .finally(() => setLoading(false));
  }, [staticPosts]);

  const [activeFilter, setActiveFilter] = useState('all');

  const featured = posts.find((p) => p.featured) ?? posts[0];
  const grid = posts.filter((p) => p !== featured);
  const filtered = activeFilter === 'all' ? grid : grid.filter((p) => p.category === activeFilter);

  return (
    <>
      {/* Hero */}
      <section className="subpage-hero">
        <div className="container">
          <div className="subpage-hero-inner">
            <div className="crumb">
              <Link href={`/${locale}`}>{t('sub_home')}</Link>
              <span className="crumb-sep">/</span>
              <span>{t('blog_breadcrumb')}</span>
            </div>
            <span className="eyebrow">{t('blog_eyebrow')}</span>
            <h1 className="subpage-title" style={{ marginTop: 20 }}>
              {t('blog_title_1')}<br />{t('blog_title_2')}
            </h1>
            <p className="subpage-lead">{t('blog_lead')}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section" style={{ paddingTop: 64 }}>
        <div className="container">
          {featured && <BlogFeaturedCard post={featured} locale={locale} />}

          <BlogFilter categories={CATEGORIES} onFilterChange={setActiveFilter} />

          {loading ? (
            <div className="blog-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="blog-card" style={{ height: 280, background: 'var(--color-bg-elev)', animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">{t('blog_empty')}</div>
          ) : (
            <div className="blog-grid">
              {filtered.map((post, i) => (
                <BlogCard key={post.slug} post={post} locale={locale} index={i} />
              ))}
            </div>
          )}

          {/* CTA dark band */}
          <div className="detail-cta" style={{ marginTop: 80 }}>
            <div>
              <h3>{t('blog_cta_title')}</h3>
              <p>{t('blog_cta_desc')}</p>
            </div>
            <Link href={`/${locale}/#contact`} className="btn-accent">
              {t('blog_cta_btn')}
            </Link>
          </div>
        </div>
      </section>

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
          letter-spacing: -.035em; line-height: 1.02; max-width: 18ch;
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
        .crumb a { color: var(--color-ink-mute); transition: color .2s; }
        .crumb a:hover { color: var(--color-ink); }
        .crumb-sep { color: var(--color-ink-mute); opacity: .5; }

        .blog-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
        }
        @media (max-width: 900px) { .blog-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .blog-grid { grid-template-columns: 1fr; } }

        .empty-state {
          text-align: center; padding: 60px 20px;
          color: var(--color-ink-mute); font-size: 15px;
        }

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

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
      `}</style>
    </>
  );
}
