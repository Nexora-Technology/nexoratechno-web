import Link from 'next/link';
import type { Career } from '@/lib/static-content';

interface Props { career: Career; locale: string; }

export default function CareerDetailView({ career, locale }: Props) {
  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-bg-soft)] border-b border-[var(--color-line)]">
        <div className="container pt-32 pb-14">
          <div className="crumb mb-8">
            <Link href={`/${locale}`}>Home</Link>
            <span className="crumb-sep">/</span>
            <Link href={`/${locale}/careers`}>Careers</Link>
            <span className="crumb-sep">/</span>
            <span>{career.dept}</span>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-full border border-[var(--color-line)] text-[var(--color-ink-soft)]">
              {career.dept}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight text-[var(--color-ink)] mb-8">
            {career.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap gap-6 text-sm text-[var(--color-ink-soft)]">
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {career.location}
            </span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
              {career.type}
            </span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {career.level}
            </span>
            <span className="flex items-center gap-2 font-semibold text-[var(--color-ink)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              {career.salary}
            </span>
            <span className="opacity-60">·</span>
            <span>{career.posted}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {career.tags.map((tag) => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="section py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-12">
            {career.body.map((block, i) => (
              <div key={i} className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-[var(--color-ink)]">
                  {block.h}
                </h2>
                {block.p && (
                  <p className="text-lg text-[var(--color-ink-soft)] leading-relaxed">{block.p}</p>
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

          {/* Apply */}
          <div className="max-w-3xl mx-auto mt-14 pt-10 border-t border-[var(--color-line)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <a
                href={`mailto:careers@nexoratechno.com?subject=Application: ${encodeURIComponent(career.title)}`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--color-ink)] text-[var(--color-bg)] font-medium hover:opacity-90 transition-opacity"
              >
                Ứng tuyển ngay
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
              <Link
                href={`/${locale}/careers`}
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Quay về Careers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-bg-soft)] border-t border-[var(--color-line)] py-16">
        <div className="container">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-display font-semibold tracking-tight text-[var(--color-ink)]">
              Không thấy vị trí phù hợp?
            </h2>
            <p className="mt-3 text-[var(--color-ink-soft)]">
              Gửi CV của bạn, chúng tôi sẽ liên hệ khi có vị trí phù hợp.
            </p>
            <a
              href="mailto:careers@nexoratechno.com"
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--color-line)] text-[var(--color-ink)] hover:border-[var(--color-line-strong)] transition-colors"
            >
              Liên hệ
            </a>
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