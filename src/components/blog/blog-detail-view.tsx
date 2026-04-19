import Link from 'next/link';
import type { BlogPost } from '@/lib/static-content';
import { STATIC_BLOG_POSTS } from '@/lib/static-content';

interface Props {
  post: BlogPost;
  locale: string;
}

export default function BlogDetailView({ post, locale }: Props) {
  const related = STATIC_BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.category === post.category
  ).slice(0, 3);

  return (
    <>
      {/* Hero band */}
      <section className="bg-[var(--color-bg-soft)] border-b border-[var(--color-line)]">
        <div className="container pt-32 pb-14">
          {/* Breadcrumb */}
          <div className="crumb mb-8">
            <Link href={`/${locale}`} className="hover:text-[var(--color-ink)] transition-colors">Home</Link>
            <span className="crumb-sep">/</span>
            <Link href={`/${locale}/blog`} className="hover:text-[var(--color-ink)] transition-colors">Blog</Link>
            <span className="crumb-sep">/</span>
            <span>{post.category}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-ink-mute)] mb-6">
            <span className="text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full border border-[var(--color-line)]">
              {post.category}
            </span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight leading-tight text-[var(--color-ink)] max-w-4xl">
            {post.title}
          </h1>
        </div>
      </section>

      {/* Author row */}
      <section className="border-b border-[var(--color-line)]">
        <div className="container py-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-grad-start)] flex items-center justify-center text-white font-display font-semibold text-lg">
            {post.author.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-[var(--color-ink)]">{post.author}</p>
            <p className="text-sm text-[var(--color-ink-mute)]">{post.authorRole}</p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="section py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-10">
              {post.body.map((block, i) => (
                <div key={i} className="space-y-4">
                  <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-[var(--color-ink)]">
                    {block.h}
                  </h2>
                  {block.p && (
                    <p className="text-lg text-[var(--color-ink-soft)] leading-relaxed">
                      {block.p}
                    </p>
                  )}
                  {block.list && (
                    <ul className="space-y-3 pl-0 list-none">
                      {block.list.map((item, j) => (
                        <li key={j} className="flex items-start gap-3 text-base text-[var(--color-ink-soft)] leading-relaxed">
                          <span className="mt-2.5 w-5 h-px bg-[var(--color-accent)] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-12 mt-12 border-t border-[var(--color-line)]">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag-pill">{tag}</span>
                ))}
              </div>
            )}

            {/* Back */}
            <div className="mt-10">
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
                Quay về Blog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-[var(--color-bg-soft)] border-t border-[var(--color-line)] py-16">
          <div className="container">
            <h2 className="text-2xl font-display font-semibold tracking-tight text-[var(--color-ink)] mb-8">
              Bài viết liên quan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${locale}/blog/${p.slug}`}
                  className="p-6 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] hover:border-[var(--color-line-strong)] hover:-translate-y-0.5 hover:shadow-lg transition-all"
                >
                  <span className="text-xs font-mono tracking-widest uppercase text-[var(--color-ink-mute)]">{p.category}</span>
                  <h3 className="mt-3 text-lg font-display font-semibold tracking-tight text-[var(--color-ink)] leading-snug line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{p.date}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-[var(--color-ink)]">
              Ready to start?
            </h2>
            <p className="mt-4 text-lg text-[var(--color-ink-soft)]">
              Chúng tôi luôn tìm kiếm những dự án thú vị và những người đồng hành tài năng.
            </p>
            <Link
              href={`/${locale}/#contact`}
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--color-ink)] text-[var(--color-bg)] font-medium hover:opacity-90 transition-opacity"
            >
              Liên hệ ngay
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        .crumb { display:inline-flex; align-items:center; gap:10px; font-family:var(--font-mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--color-ink-mute); }
        .crumb-sep { opacity:.5; }
        .tag-pill { display:inline-block; padding:4px 10px; font-size:12px; font-weight:500; background:var(--color-bg-soft); border:1px solid var(--color-line); border-radius:9999px; color:var(--color-ink-soft); }
      `}</style>
    </>
  );
}
