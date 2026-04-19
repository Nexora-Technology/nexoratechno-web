'use client';

import { useState, useEffect } from 'react';
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
  const [posts, setPosts] = useState<BlogPost[]>(staticPosts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wordpress/blog')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Map WP posts to BlogPost shape
          const mapped: BlogPost[] = data.map((p: Record<string, unknown>) => {
            const cats = p.categories as Record<string, unknown> | null;
            const catNode = (cats && typeof cats === 'object') ? (cats as {nodes?: Array<{node:{name:string}}>}).nodes?.[0]?.node?.name : 'General';
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
  }, []);

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
              <a href={`/${locale}`}>Home</a>
              <span className="crumb-sep">/</span>
              <span>Blog</span>
            </div>
            <p className="text-xs font-mono tracking-widest uppercase text-[var(--color-ink-mute)] mb-4">Blog</p>
            <h1 className="subpage-title text-[var(--color-ink)]">
              Kiến thức,<br />kinh nghiệm thực chiến.
            </h1>
            <p className="subpage-lead">
              Những bài viết về kỹ thuật, thiết kế, văn hóa và cách chúng tôi xây dựng phần mềm tại Nexora.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section py-16">
        <div className="container">
          {featured && <BlogFeaturedCard post={featured} locale={locale} />}

          <BlogFilter categories={CATEGORIES} onFilterChange={setActiveFilter} />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-64 rounded-2xl bg-[var(--color-bg-elev)] border border-[var(--color-line)] animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-[var(--color-ink-mute)]">
              <p className="text-lg">Không có bài viết nào trong danh mục này.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((post) => (
                <BlogCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          )}
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
        .subpage-title {
          font-size: clamp(40px, 5.5vw, 80px);
          letter-spacing: -0.035em; line-height: 1.02; max-width: 18ch;
          font-family: var(--font-display);
        }
        .subpage-lead {
          margin-top: 20px; font-size: clamp(17px, 1.6vw, 20px);
          color: var(--color-ink-soft); max-width: 60ch; line-height: 1.55;
        }
        .crumb {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--color-ink-mute); margin-bottom: 28px;
        }
        .crumb a { color: var(--color-ink-mute); transition: color .2s; }
        .crumb a:hover { color: var(--color-ink); }
      `}</style>
    </>
  );
}
