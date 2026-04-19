'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Career } from '@/lib/static-content';
import CareerCard from './career-card';

interface Props {
  staticCareers: Career[];
  locale: string;
}

const DEPARTMENTS = ['Engineering', 'Mobile', 'Design', 'Infrastructure', 'Quality', 'Product'];

export default function CareersListing({ staticCareers, locale }: Props) {
  const t = useTranslations();
  const [careers] = useState<Career[]>(staticCareers);
  const [activeDept, setActiveDept] = useState('all');

  const filtered = activeDept === 'all' ? careers : careers.filter((c) => c.dept === activeDept);

  return (
    <>
      {/* Hero */}
      <section className="subpage-hero">
        <div className="container">
          <div className="subpage-hero-inner">
            <div className="crumb">
              <a href={`/${locale}`}>{t('sub_home')}</a>
              <span className="crumb-sep">/</span>
              <span>{t('career_breadcrumb')}</span>
            </div>
            <p className="cl-eyebrow">{t('career_eyebrow')}</p>
            <h1 className="subpage-title">{t('career_title')}</h1>
            <p className="subpage-lead">{t('career_lead')}</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          {/* Filter chips */}
          <div className="listing-filters">
            <button
              className={activeDept === 'all' ? 'active' : ''}
              onClick={() => setActiveDept('all')}
            >
              {t('sub_all')}
            </button>
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                className={activeDept === dept ? 'active' : ''}
                onClick={() => setActiveDept(dept)}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Job list */}
          <div className="careers-grid">
            {filtered.length === 0 ? (
              <div className="empty-state">{t('career_empty')}</div>
            ) : (
              filtered.map((career) => (
                <CareerCard key={career.slug} career={career} locale={locale} />
              ))
            )}
          </div>

          {/* CTA dark band */}
          <div className="detail-cta">
            <div>
              <h3>{t('career_cta_title')}</h3>
              <p>{t('career_cta_desc')}</p>
            </div>
            <a href="mailto:careers@nexoratechno.com" className="btn-accent">
              {t('career_cta_btn')}
              <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .subpage-hero { padding-top:140px; padding-bottom:56px; background:var(--color-bg-soft); border-bottom:1px solid var(--color-line); position:relative; overflow:hidden; }
        .subpage-hero::before { content:""; position:absolute; right:-20%; top:-80%; width:70%; height:260%; background:radial-gradient(ellipse at center, color-mix(in oklab, var(--color-accent) 18%, transparent) 0%, transparent 60%); pointer-events:none; }
        .subpage-hero-inner { position:relative; z-index:1; }
        .subpage-title { font-size:clamp(40px,5.5vw,80px); letter-spacing:-0.035em; line-height:1.02; max-width:18ch; font-family:var(--font-display); color:var(--color-ink); }
        .subpage-lead { margin-top:20px; font-size:clamp(17px,1.6vw,20px); color:var(--color-ink-soft); max-width:60ch; line-height:1.55; }
        .cl-eyebrow { font-family:var(--font-mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--color-ink-mute); margin-bottom:16px; }
        .crumb { display:inline-flex; align-items:center; gap:10px; font-family:var(--font-mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--color-ink-mute); margin-bottom:28px; }
        .crumb a { color:var(--color-ink-mute); transition:color .2s; }
        .crumb a:hover { color:var(--color-ink); }
        .crumb-sep { color:var(--color-ink-mute); opacity:.5; }

        .careers-grid { display:grid; grid-template-columns:1fr; gap:14px; }
        .listing-filters { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:40px; padding:6px; background:var(--color-bg-elev); border:1px solid var(--color-line); border-radius:9999px; width:fit-content; max-width:100%; overflow-x:auto; }
        .listing-filters button { padding:9px 16px; font-size:13px; font-weight:500; border-radius:9999px; color:var(--color-ink-soft); transition:background .2s, color .2s; white-space:nowrap; background:transparent; border:none; cursor:pointer; }
        .listing-filters button:hover { color:var(--color-ink); }
        .listing-filters button.active { background:var(--color-ink); color:var(--color-bg); }

        .empty-state { text-align:center; padding:60px 20px; color:var(--color-ink-mute); font-size:15px; }

        .detail-cta { margin:80px auto 0; max-width:1080px; padding:56px 48px; background:var(--color-ink); color:var(--color-bg); border-radius:var(--radius-xl); display:grid; grid-template-columns:1fr auto; gap:24px; align-items:center; }
        [data-theme="dark"] .detail-cta { background:var(--color-bg-elev); border:1px solid var(--color-line); }
        .detail-cta h3 { color:var(--color-bg); font-size:clamp(22px,2.8vw,32px); letter-spacing:-0.02em; max-width:22ch; font-family:var(--font-display); }
        [data-theme="dark"] .detail-cta h3 { color:var(--color-ink); }
        .detail-cta p { color:rgba(255,255,255,.7); font-size:15px; margin-top:8px; max-width:50ch; }
        [data-theme="dark"] .detail-cta p { color:var(--color-ink-soft); }
        @media(max-width:680px) { .detail-cta { grid-template-columns:1fr; padding:32px 28px; } }

        .btn-accent { display:inline-flex; align-items:center; gap:8px; padding:14px 28px; border-radius:9999px; background:var(--color-accent); color:#1A1508; font-weight:600; font-size:15px; transition:opacity .2s; text-decoration:none; }
        .btn-accent:hover { opacity:.9; }
        .btn-arrow { width:18px; height:18px; transition:transform .2s; }
        .btn-accent:hover .btn-arrow { transform:translateX(3px); }
      `}</style>
    </>
  );
}
