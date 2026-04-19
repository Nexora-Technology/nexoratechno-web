'use client';

import { useState } from 'react';
import type { CaseStudy } from '@/lib/static-content';
import CaseCard from './case-card';

interface Props {
  staticCases: CaseStudy[];
  locale: string;
}

const INDUSTRIES = ['Fintech', 'Logistics', 'E-commerce', 'Industrial', 'Healthcare', 'Energy'];

export default function CaseStudiesListing({ staticCases, locale }: Props) {
  const [cases] = useState<CaseStudy[]>(staticCases);
  const [activeIndustry, setActiveIndustry] = useState('all');

  const filtered = activeIndustry === 'all' ? cases : cases.filter((c) => c.industry === activeIndustry);

  return (
    <>
      {/* Hero */}
      <section className="subpage-hero">
        <div className="container">
          <div className="subpage-hero-inner">
            <div className="crumb">
              <a href={`/${locale}`}>Home</a>
              <span className="crumb-sep">/</span>
              <span>Case Studies</span>
            </div>
            <p className="text-xs font-mono tracking-widest uppercase text-[var(--color-ink-mute)] mb-4">Dự án</p>
            <h1 className="subpage-title text-[var(--color-ink)]">
              Kết quả thực tế,<br />từ người thật.
            </h1>
            <p className="subpage-lead">
              {cases.length} case study từ fintech đến IoT — mỗi dự án đều có số liệu cụ thể.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section py-16">
        <div className="container">
          <div className="listing-filters mb-10">
            <button
              className={activeIndustry === 'all' ? 'active' : ''}
              onClick={() => setActiveIndustry('all')}
            >
              Tất cả
            </button>
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                className={activeIndustry === ind ? 'active' : ''}
                onClick={() => setActiveIndustry(ind)}
              >
                {ind}
              </button>
            ))}
          </div>

          <div className="cases-grid">
            {filtered.length === 0 ? (
              <div className="col-span-2 text-center py-20 text-[var(--color-ink-mute)]">
                <p>Không có case study nào trong ngành này.</p>
              </div>
            ) : (
              filtered.map((c) => (
                <CaseCard key={c.slug} item={c} locale={locale} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section py-20 bg-[var(--color-bg-soft)] border-t border-[var(--color-line)]">
        <div className="container">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-display font-semibold tracking-tight text-[var(--color-ink)]">
              Bạn muốn có kết quả như thế này?
            </h2>
            <p className="mt-4 text-[var(--color-ink-soft)]">
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
        .subpage-hero { padding-top:140px; padding-bottom:56px; background:var(--color-bg-soft); border-bottom:1px solid var(--color-line); position:relative; overflow:hidden; }
        .subpage-hero::before { content:""; position:absolute; right:-20%; top:-80%; width:70%; height:260%; background:radial-gradient(ellipse at center, color-mix(in oklab, var(--color-accent) 18%, transparent) 0%, transparent 60%); pointer-events:none; }
        .subpage-title { font-size:clamp(40px,5.5vw,80px); letter-spacing:-0.035em; line-height:1.02; max-width:18ch; font-family:var(--font-display); }
        .subpage-lead { margin-top:20px; font-size:clamp(17px,1.6vw,20px); color:var(--color-ink-soft); max-width:60ch; line-height:1.55; }
        .crumb { display:inline-flex; align-items:center; gap:10px; font-family:var(--font-mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--color-ink-mute); margin-bottom:28px; }
        .crumb a { color:var(--color-ink-mute); transition:color .2s; }
        .crumb a:hover { color:var(--color-ink); }
        .cases-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:24px; }
        @media (max-width: 820px) { .cases-grid { grid-template-columns:1fr; } }
        .listing-filters { display:flex; gap:8px; flex-wrap:wrap; padding:6px; background:var(--color-bg-elev); border:1px solid var(--color-line); border-radius:9999px; width:fit-content; max-width:100%; overflow-x:auto; }
        .listing-filters button { padding:9px 16px; font-size:13px; font-weight:500; border-radius:9999px; color:var(--color-ink-soft); transition:background .2s, color .2s; white-space:nowrap; background:transparent; border:none; cursor:pointer; }
        .listing-filters button:hover { color:var(--color-ink); }
        .listing-filters button.active { background:var(--color-ink); color:var(--color-bg); }
      `}</style>
    </>
  );
}