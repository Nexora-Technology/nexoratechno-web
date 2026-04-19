'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const STATS = [
  { value: '2025', labelKey: 'stat1_l' },
  { value: 'TP.HCM', labelKey: 'stat2_l' },
  { value: '45+', labelKey: 'stat3_l' },
  { value: '40+', labelKey: 'stat4_l' },
  { value: '28', labelKey: 'stat5_l' },
  { value: '92%', labelKey: 'stat6_l' },
];

function useReveal(ref: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('in'); observer.disconnect(); } },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
}

export default function Stats() {
  const t = useTranslations();
  const wrapRef = useRef<HTMLDivElement>(null);
  useReveal(wrapRef);

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div
          ref={wrapRef}
          className="stats-band reveal"
        >
          <h2 className="stats-title">{t('stats_title')}</h2>

          <div className="stats-grid">
            {STATS.map(({ value, labelKey }) => (
              <div key={labelKey} className="stat-cell">
                <div className="stat-value">{value}</div>
                <div className="stat-label">{t(labelKey)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .stats-band {
          background: var(--color-ink);
          color: var(--color-bg);
          border-radius: var(--radius-xl);
          padding: 72px 56px;
          position: relative;
          overflow: hidden;
        }
        [data-theme="dark"] .stats-band {
          background: var(--color-bg-elev);
          border: 1px solid var(--color-line);
        }
        .stats-band::before {
          content: "";
          position: absolute;
          right: -10%;
          top: -40%;
          width: 60%;
          height: 200%;
          background: radial-gradient(ellipse at center,
            color-mix(in oklab, var(--color-accent) 35%, transparent) 0%,
            transparent 60%);
          pointer-events: none;
        }
        .stats-title {
          font-size: clamp(28px, 3.5vw, 44px);
          font-weight: 600;
          letter-spacing: -0.03em;
          max-width: 18ch;
          position: relative;
          color: var(--color-bg);
        }
        [data-theme="dark"] .stats-title {
          color: var(--color-ink);
        }
        .stats-grid {
          margin-top: 56px;
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 32px 24px;
          position: relative;
        }
        @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 520px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        .stat-cell {
          border-top: 1px solid rgba(255,255,255,0.2);
          padding-top: 20px;
        }
        [data-theme="dark"] .stat-cell { border-top-color: var(--color-line); }
        .stat-value {
          font-family: var(--font-display);
          font-size: clamp(32px, 3.6vw, 48px);
          font-weight: 600;
          letter-spacing: -0.03em;
          line-height: 1;
          background: linear-gradient(135deg, var(--color-accent) 0%, #FFFFFF 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        [data-theme="dark"] .stat-value {
          background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-ink) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .stat-label {
          margin-top: 12px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }
        [data-theme="dark"] .stat-label { color: var(--color-ink-mute); }
      `}</style>
    </section>
  );
}
