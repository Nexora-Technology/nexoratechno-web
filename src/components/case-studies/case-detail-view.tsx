import Link from 'next/link';
import type { CaseStudy } from '@/lib/static-content';

interface Props { item: CaseStudy; locale: string; }

export default function CaseDetailView({ item, locale }: Props) {
  return (
    <>
      {/* Hero visual banner */}
      <section
        className="relative h-96 md:h-[480px] overflow-hidden flex items-end"
        style={{ '--case-color': item.color } as React.CSSProperties}
      >
        <div className="absolute inset-0 case-hero-bg" />
        <div className="relative z-10 container pb-12 text-white">
          <div className="crumb mb-6 text-white/70">
            <Link href={`/${locale}`} className="hover:text-white transition-colors">Home</Link>
            <span className="opacity-50">/</span>
            <Link href={`/${locale}/case-studies`} className="hover:text-white transition-colors">Case Studies</Link>
            <span className="opacity-50">/</span>
            <span>{item.client}</span>
          </div>
          <p className="text-sm font-mono tracking-widest uppercase text-white/80 mb-3">{item.industry} · {item.year}</p>
          <h1 className="text-4xl md:text-5xl font-display font-semibold tracking-tight leading-tight max-w-3xl">
            {item.title}
          </h1>
        </div>
      </section>

      {/* Facts row */}
      <section className="bg-[var(--color-bg-elev)] border-b border-[var(--color-line)]">
        <div className="container py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-[var(--color-ink-mute)] mb-2">Khách hàng</p>
            <p className="font-display font-semibold text-lg text-[var(--color-ink)]">{item.client}</p>
          </div>
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-[var(--color-ink-mute)] mb-2">Ngành</p>
            <p className="font-display font-semibold text-lg text-[var(--color-ink)]">{item.industry}</p>
          </div>
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-[var(--color-ink-mute)] mb-2">Thời gian</p>
            <p className="font-display font-semibold text-lg text-[var(--color-ink)]">{item.duration}</p>
          </div>
          <div>
            <p className="text-xs font-mono tracking-widest uppercase text-[var(--color-ink-mute)] mb-2">Đội ngũ</p>
            <p className="font-display font-semibold text-lg text-[var(--color-ink)]">{item.team}</p>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="section py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-12">
            {item.body.map((block, i) => (
              <div key={i} className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-[var(--color-ink)]">
                  {block.h}
                </h2>
                {block.p && (
                  <p className="text-lg text-[var(--color-ink-soft)] leading-relaxed">{block.p}</p>
                )}
                {block.list && (
                  <ul className="space-y-3 pl-0 list-none">
                    {block.list.map((item2, j) => (
                      <li key={j} className="flex items-start gap-3 text-base text-[var(--color-ink-soft)] leading-relaxed">
                        <span className="mt-2.5 w-5 h-px bg-[var(--color-accent)] shrink-0" />
                        {item2}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Services */}
          <div className="max-w-3xl mx-auto mt-10 pt-8 border-t border-[var(--color-line)]">
            <div className="flex flex-wrap gap-2">
              {item.services.map((svc) => (
                <span key={svc} className="tag-pill">{svc}</span>
              ))}
            </div>
          </div>

          {/* Back */}
          <div className="max-w-3xl mx-auto mt-8">
            <Link href={`/${locale}/case-studies`} className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Quay về Case Studies
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics band */}
      {item.metrics.length > 0 && (
        <section className="bg-[var(--color-bg-soft)] border-t border-[var(--color-line)] py-16">
          <div className="container">
            <h2 className="text-xl font-display font-semibold text-[var(--color-ink)] mb-8 text-center">Kết quả</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {item.metrics.map((m, i) => (
                <div key={i} className="text-center p-6 rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)]">
                  <p className="text-4xl font-display font-semibold bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-grad-end)] bg-clip-text text-transparent leading-tight">
                    {m.value}
                  </p>
                  <p className="mt-3 text-sm text-[var(--color-ink-mute)]">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section py-20">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-semibold tracking-tight text-[var(--color-ink)]">
              Bạn muốn có kết quả như thế này?
            </h2>
            <p className="mt-4 text-lg text-[var(--color-ink-soft)]">
              Bắt đầu dự án của bạn cùng Nexora.
            </p>
            <a
              href={`/${locale}/#contact`}
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[var(--color-ink)] text-[var(--color-bg)] font-medium hover:opacity-90 transition-opacity"
            >
              Bắt đầu dự án
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .case-hero-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 70%, rgba(255,255,255,0.12) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%),
            var(--case-color, #4F46E5);
        }
        .case-hero-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .crumb { display:inline-flex; align-items:center; gap:10px; font-family:var(--font-mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; }
        .tag-pill { display:inline-block; padding:4px 10px; font-size:12px; font-weight:500; background:var(--color-bg-soft); border:1px solid var(--color-line); border-radius:9999px; color:var(--color-ink-soft); }
      `}</style>
    </>
  );
}