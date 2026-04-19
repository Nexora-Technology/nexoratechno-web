'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { CaseStudy } from '@/lib/static-content';

interface Props { item: CaseStudy; locale: string; }

export default function CaseDetailView({ item, locale }: Props) {
  const t = useTranslations();

  return (
    <>
      {/* Hero */}
      <section className="subpage-hero">
        <div className="container">
          <div className="subpage-hero-inner">
            <div className="crumb">
              <a href={`/${locale}`}>{t('sub_home')}</a>
              <span className="crumb-sep">/</span>
              <a href={`/${locale}/case-studies`}>{t('cs_breadcrumb')}</a>
              <span className="crumb-sep">/</span>
              <span>{item.client}</span>
            </div>
            <span className="eyebrow">{item.industry} · {item.year}</span>
            <h1 className="subpage-title" style={{ maxWidth: '22ch' }}>{item.title}</h1>
            <p className="subpage-lead">{item.summary}</p>
          </div>
        </div>
      </section>

      {/* Hero visual */}
      <div className="container" style={{ paddingTop: '60px' }}>
        <div
          className="case-hero-visual"
          style={{ '--case-color': item.color } as React.CSSProperties}
        >
          <div className="case-hero-content">
            <div>
              <div className="case-client">{item.client}</div>
              <h2>{item.title}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Facts grid */}
      <div className="container">
        <div className="case-facts">
          <div className="case-fact">
            <div className="case-fact-l">{t('cs_detail_client')}</div>
            <div className="case-fact-v">{item.client}</div>
          </div>
          <div className="case-fact">
            <div className="case-fact-l">{t('cs_detail_industry')}</div>
            <div className="case-fact-v">{item.industry}</div>
          </div>
          <div className="case-fact">
            <div className="case-fact-l">{t('cs_detail_duration')}</div>
            <div className="case-fact-v">{item.duration}</div>
          </div>
          <div className="case-fact">
            <div className="case-fact-l">{t('cs_detail_team')}</div>
            <div className="case-fact-v">{item.team}</div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="detail-wrap">
        <h2 style={{ fontSize: '28px', letterSpacing: '-0.02em', marginBottom: '8px' }}>
          {t('sub_results')}
        </h2>
        {item.metrics.length > 0 && (
          <div className="case-stats">
            {item.metrics.map((m, i) => (
              <div key={i}>
                <div className="case-stat-v">{m.value}</div>
                <div className="case-stat-l">{m.label}</div>
              </div>
            ))}
          </div>
        )}
        <div className="detail-body">
          {item.body.map((block, i) => (
            <div key={i}>
              <h2>{block.h}</h2>
              {block.p && <p>{block.p}</p>}
              {block.list && (
                <ul>{block.list.map((x, j) => <li key={j}>{x}</li>)}</ul>
              )}
            </div>
          ))}
          <div className="tag-row" style={{ marginTop: '40px' }}>
            {item.services.map((s) => (
              <span key={s} className="tag-pill">{s}</span>
            ))}
          </div>
        </div>
        <div style={{ marginTop: '40px' }}>
          <Link href={`/${locale}/case-studies`} className="btn btn-ghost">
            {t('cs_back')}
          </Link>
        </div>
      </div>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className="detail-cta">
            <div>
              <h3>{t('cs_cta_title')}</h3>
              <p>{t('cs_cta_desc')}</p>
            </div>
            <a href={`/${locale}/#contact`} className="btn btn-accent">
              {t('cs_cta_btn')}
              <svg
                className="btn-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .subpage-hero { padding-top:140px; padding-bottom:56px; background:var(--color-bg-soft); border-bottom:1px solid var(--color-line); position:relative; overflow:hidden; }
        .subpage-hero::before { content:""; position:absolute; right:-20%; top:-80%; width:70%; height:260%; background:radial-gradient(ellipse at center, color-mix(in oklab, var(--color-accent) 18%, transparent) 0%, transparent 60%); pointer-events:none; }
        .subpage-hero-inner { position:relative; z-index:1; }
        .crumb { display:inline-flex; align-items:center; gap:10px; font-family:var(--font-mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--color-ink-mute); margin-bottom:28px; }
        .crumb a { color:var(--color-ink-mute); transition:color .2s; }
        .crumb a:hover { color:var(--color-ink); }
        .crumb-sep { color:var(--color-ink-mute); opacity:.5; }
        .eyebrow { font-family:var(--font-mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--color-ink-mute); margin-bottom:16px; display:block; }
        .subpage-title { font-size:clamp(40px,5.5vw,80px); letter-spacing:-0.035em; line-height:1.02; max-width:18ch; font-family:var(--font-display); }
        .subpage-lead { margin-top:20px; font-size:clamp(17px,1.6vw,20px); color:var(--color-ink-soft); max-width:60ch; line-height:1.55; }
        .case-hero-visual { border-radius:var(--radius-xl); overflow:hidden; margin:0 auto 48px; max-width:1080px; height:360px; position:relative; color:white; display:flex; align-items:flex-end; padding:48px; }
        @media (max-width:600px) { .case-hero-visual { height:260px; padding:28px; } }
        .case-hero-visual::before { content:""; position:absolute; inset:0; background:radial-gradient(ellipse at top right, rgba(255,255,255,0.25), transparent 55%), radial-gradient(ellipse at bottom left, rgba(0,0,0,0.3), transparent 55%), var(--case-color, #4F46E5); }
        .case-hero-visual::after { content:""; position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px); background-size:40px 40px; }
        .case-hero-content { position:relative; z-index:1; }
        .case-hero-content h2 { font-size:clamp(28px,3.4vw,42px); color:white; letter-spacing:-0.02em; max-width:22ch; line-height:1.1; }
        .case-hero-content .case-client { font-size:16px; opacity:.85; margin-bottom:12px; }
        .case-facts { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; margin:0 auto 40px; max-width:1080px; }
        @media (max-width:680px) { .case-facts { grid-template-columns:repeat(2,1fr); gap:16px; } }
        .case-fact { border-top:1px solid var(--color-line); padding-top:14px; }
        .case-fact-l { font-family:var(--font-mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--color-ink-mute); }
        .case-fact-v { margin-top:6px; font-size:15px; color:var(--color-ink); font-weight:500; }
        .case-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; padding:36px; background:var(--color-bg-elev); border:1px solid var(--color-line); border-radius:var(--radius-lg); margin:32px 0 40px; }
        @media (max-width:680px) { .case-stats { grid-template-columns:repeat(2,1fr); padding:24px; } }
        .case-stat-v { font-family:var(--font-display); font-size:clamp(28px,3vw,36px); font-weight:600; letter-spacing:-0.03em; color:var(--color-ink); line-height:1; }
        .case-stat-l { margin-top:8px; font-size:13px; color:var(--color-ink-mute); line-height:1.4; }
        .detail-wrap { max-width:780px; margin:0 auto; padding:60px 0 80px; }
        .detail-body h2 { font-size:28px; letter-spacing:-0.02em; margin-top:48px; margin-bottom:16px; }
        .detail-body p { font-size:17px; line-height:1.7; color:var(--color-ink-soft); margin:14px 0; }
        .detail-body ul { padding-left:0; list-style:none; margin:14px 0; }
        .detail-body ul li { position:relative; padding-left:28px; font-size:17px; color:var(--color-ink-soft); line-height:1.6; margin:10px 0; }
        .detail-body ul li::before { content:""; position:absolute; left:0; top:0.75em; width:16px; height:1px; background:var(--color-accent); }
        .detail-cta { margin:0 auto; max-width:1080px; padding:56px 48px; background:var(--color-ink); color:var(--color-bg); border-radius:var(--radius-xl); display:grid; grid-template-columns:1fr auto; gap:24px; align-items:center; }
        [data-theme="dark"] .detail-cta { background:var(--color-bg-elev); border:1px solid var(--color-line); }
        .detail-cta h3 { color:var(--color-bg); font-size:clamp(22px,2.8vw,32px); letter-spacing:-0.02em; max-width:22ch; }
        [data-theme="dark"] .detail-cta h3 { color:var(--color-ink); }
        .detail-cta p { color:rgba(255,255,255,0.7); font-size:15px; margin-top:8px; max-width:50ch; }
        [data-theme="dark"] .detail-cta p { color:var(--color-ink-soft); }
        @media (max-width:680px) { .detail-cta { grid-template-columns:1fr; padding:32px 28px; } }
        .tag-pill { padding:4px 10px; font-size:12px; font-weight:500; background:var(--color-bg-soft); border:1px solid var(--color-line); border-radius:9999px; color:var(--color-ink-soft); display:inline-block; }
        .tag-row { display:flex; flex-wrap:wrap; gap:6px; margin-top:14px; }
        .btn-arrow { width:18px; height:18px; transition:transform .2s; }
        .btn:hover .btn-arrow { transform:translateX(3px); }
      `}</style>
    </>
  );
}
