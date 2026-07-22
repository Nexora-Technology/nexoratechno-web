'use client';

import { useTranslations } from 'next-intl';
import { useCountUp, useInView } from '@/components/motion';

const STATS = [
  { value: '2025', labelKey: 'stat1_l' },
  { value: 'TP.HCM', labelKey: 'stat2_l' },
  { value: '45+', labelKey: 'stat3_l' },
  { value: '40+', labelKey: 'stat4_l' },
  { value: '28', labelKey: 'stat5_l' },
  { value: '92%', labelKey: 'stat6_l' },
];

function StatValue({ value }: { value: string }) {
  const ref = useCountUp<HTMLDivElement>(value);
  return (
    <div ref={ref} className="stat-value">
      {value}
    </div>
  );
}

export default function Stats() {
  const t = useTranslations();
  const wrapRef = useInView<HTMLDivElement>();

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div
          ref={wrapRef}
          className="stats-band"
        >
          <h2 className="stats-title">{t('stats_title')}</h2>

          <div className="stats-grid">
            {STATS.map(({ value, labelKey }) => (
              <div key={labelKey} className="stat-cell">
                <StatValue value={value} />
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
        /* Entrance: the 1px top rule draws across each cell, labels fade in.
           (Rule is a ::before instead of border-top so it can scaleX; padding
           absorbs the removed border so content position stays identical.) */
        .stat-cell {
          position: relative;
          padding-top: 21px;
        }
        .stat-cell::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: rgba(255,255,255,0.2);
          transform-origin: left;
          transition: transform var(--dur-enter) var(--ease-exp);
        }
        [data-theme="dark"] .stat-cell::before { background: var(--color-line); }
        .js .stats-band:not(.in) .stat-cell::before { transform: scaleX(0); }
        .stat-value {
          font-family: var(--font-display);
          font-variant-numeric: tabular-nums;
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
          transition: opacity 400ms var(--ease-exp);
        }
        [data-theme="dark"] .stat-label { color: var(--color-ink-mute); }
        .js .stats-band:not(.in) .stat-label { opacity: 0; }
      `}</style>
    </section>
  );
}
