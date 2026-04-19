import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { Career } from '@/lib/static-content';

interface Props { career: Career; locale: string; }

export default function CareerDetailView({ career, locale }: Props) {
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
              <a href={`/${locale}/careers`}>{t('career_breadcrumb')}</a>
              <span className="crumb-sep">/</span>
              <span>{career.dept}</span>
            </div>
            <div className="detail-meta">
              <span>{career.dept}</span>
              <span className="dot">·</span>
              <span>{career.level}</span>
              <span className="dot">·</span>
              <span>{career.type}</span>
            </div>
            <h1 className="detail-title">{career.title}</h1>
            <p className="subpage-lead">{career.summary}</p>
            <div className="detail-hero-actions">
              <a
                href={`mailto:careers@nexoratechno.com?subject=Application: ${encodeURIComponent(career.title)}`}
                className="btn-accent"
              >
                {t('career_detail_apply')}
                <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </a>
              <Link href={`/${locale}/careers`} className="btn-ghost">
                {t('career_detail_back')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Facts grid */}
      <div className="container">
        <div className="detail-wrap">
          <div className="case-facts">
            <div className="case-fact">
              <p className="case-fact-l">{t('career_detail_loc')}</p>
              <p className="case-fact-v">{career.location}</p>
            </div>
            <div className="case-fact">
              <p className="case-fact-l">{t('career_detail_type')}</p>
              <p className="case-fact-v">{career.type}</p>
            </div>
            <div className="case-fact">
              <p className="case-fact-l">{t('career_detail_level')}</p>
              <p className="case-fact-v">{career.level}</p>
            </div>
            <div className="case-fact">
              <p className="case-fact-l">{t('career_detail_salary')}</p>
              <p className="case-fact-v">{career.salary}</p>
            </div>
          </div>

          {/* Body */}
          <div className="detail-body">
            {career.body.map((block, i) => (
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
            ))}
            <div className="tag-row">
              {career.tags.map((tag) => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>
          </div>

          {/* CTA dark band */}
          <div className="detail-cta">
            <div>
              <h3>{t('career_detail_apply')}</h3>
              <p>{career.summary}</p>
            </div>
            <a
              href={`mailto:careers@nexoratechno.com?subject=Application: ${encodeURIComponent(career.title)}`}
              className="btn-accent"
            >
              {t('career_detail_apply')}
              <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .subpage-hero { padding-top:140px; padding-bottom:56px; background:var(--color-bg-soft); border-bottom:1px solid var(--color-line); position:relative; overflow:hidden; }
        .subpage-hero::before { content:""; position:absolute; right:-20%; top:-80%; width:70%; height:260%; background:radial-gradient(ellipse at center, color-mix(in oklab, var(--color-accent) 18%, transparent) 0%, transparent 60%); pointer-events:none; }
        .subpage-hero-inner { position:relative; z-index:1; }

        .crumb { display:inline-flex; align-items:center; gap:10px; font-family:var(--font-mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--color-ink-mute); margin-bottom:28px; }
        .crumb a { color:var(--color-ink-mute); transition:color .2s; }
        .crumb a:hover { color:var(--color-ink); }
        .crumb-sep { color:var(--color-ink-mute); opacity:.5; }

        .detail-meta { display:flex; gap:12px; font-size:13px; color:var(--color-ink-mute); margin-bottom:20px; font-family:var(--font-mono); letter-spacing:.05em; text-transform:uppercase; flex-wrap:wrap; }
        .detail-meta .dot { opacity:.4; }
        .detail-title { font-size:clamp(32px,4vw,56px); letter-spacing:-0.03em; line-height:1.05; font-family:var(--font-display); color:var(--color-ink); max-width:24ch; }
        .subpage-lead { margin-top:20px; font-size:clamp(17px,1.6vw,20px); color:var(--color-ink-soft); max-width:60ch; line-height:1.55; }

        .detail-hero-actions { margin-top:32px; display:flex; gap:12px; flex-wrap:wrap; align-items:center; }

        .case-facts { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; margin:0 0 40px; }
        .case-fact { border-top:1px solid var(--color-line); padding-top:14px; }
        .case-fact-l { font-family:var(--font-mono); font-size:11px; letter-spacing:.12em; text-transform:uppercase; color:var(--color-ink-mute); }
        .case-fact-v { margin-top:6px; font-size:15px; color:var(--color-ink); font-weight:500; }
        @media(max-width:680px) { .case-facts { grid-template-columns:repeat(2,1fr); gap:16px; } }

        .detail-wrap { max-width:780px; margin:0 auto; padding:60px 20px 80px; }
        .detail-body { font-size:17px; line-height:1.75; color:var(--color-ink-soft); }
        .detail-body h2 { font-size:28px; letter-spacing:-0.02em; margin:48px 0 16px; font-family:var(--font-display); color:var(--color-ink); }
        .detail-body h3 { font-size:20px; color:var(--color-ink); margin:32px 0 12px; }
        .detail-body p { margin:14px 0; font-size:17px; line-height:1.7; color:var(--color-ink-soft); }
        .detail-body ul { padding-left:0; list-style:none; margin:14px 0; }
        .detail-body ul li { position:relative; padding-left:28px; font-size:17px; color:var(--color-ink-soft); line-height:1.6; margin:10px 0; }
        .detail-body ul li::before { content:""; position:absolute; left:0; top:0.75em; width:16px; height:1px; background:var(--color-accent); }
        .detail-body .tag-row { margin-top:40px; }

        .tag-pill { display:inline-block; padding:4px 10px; font-size:12px; font-weight:500; background:var(--color-bg-soft); border:1px solid var(--color-line); border-radius:9999px; color:var(--color-ink-soft); }
        .tag-row { display:flex; flex-wrap:wrap; gap:6px; }

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

        .btn-ghost { display:inline-flex; align-items:center; gap:6px; font-size:14px; font-weight:500; color:var(--color-ink-soft); text-decoration:none; transition:color .2s; }
        .btn-ghost:hover { color:var(--color-ink); }
      `}</style>
    </>
  );
}
