'use client';

import { useTranslations } from 'next-intl';
import { useInView } from '@/components/motion';

const VALUES = [
  { num: '01', titleKey: 'about_v1_t', descKey: 'about_v1_d' },
  { num: '02', titleKey: 'about_v2_t', descKey: 'about_v2_d' },
  { num: '03', titleKey: 'about_v3_t', descKey: 'about_v3_d' },
];

export default function About() {
  const t = useTranslations();
  const leftRef = useInView<HTMLDivElement>();
  const valuesRef = useInView<HTMLDivElement>();

  return (
    <section className="section" id="about" style={{ background: 'var(--color-bg-soft)' }}>
      <div className="container">
        <div className="about-grid">
          {/* Left — copy */}
          <div ref={leftRef} className="reveal">
            <span className="eyebrow">{t('about_eyebrow')}</span>
            <h2 className="section-title" style={{ marginTop: '20px', maxWidth: '18ch' }}>
              {t('about_title')}
            </h2>
            <p style={{
              fontSize: '17px',
              lineHeight: 1.6,
              color: 'var(--color-ink-soft)',
              marginTop: '18px',
              maxWidth: '52ch',
            }}>
              {t('about_p1')}
            </p>
            <p style={{
              fontSize: '17px',
              lineHeight: 1.6,
              color: 'var(--color-ink-soft)',
              marginTop: '18px',
              maxWidth: '52ch',
            }}>
              {t('about_p2')}
            </p>
          </div>

          {/* Right — values cards, staggered rise */}
          <div>
            <div ref={valuesRef} className="about-values">
              {VALUES.map(({ num, titleKey, descKey }, i) => (
                <div key={num} className="about-value" style={{ '--i': i } as React.CSSProperties}>
                  <div className="about-value-mark">{num}</div>
                  <div>
                    <h4>{t(titleKey)}</h4>
                    <p>{t(descKey)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr; gap: 40px; }
        }
        .about-values {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        .about-value {
          background: var(--color-bg-elev);
          border: 1px solid var(--color-line);
          border-radius: var(--radius-md);
          padding: 24px 26px;
          display: grid;
          grid-template-columns: 48px 1fr;
          gap: 20px;
          align-items: start;
          transition: transform var(--dur-fast) var(--ease-exp), border-color var(--dur-fast) var(--ease-exp);
        }
        .about-value:hover {
          transform: translateY(-2px);
          border-color: var(--color-line-strong);
        }
        /* Staggered entrance — animation (not transition) so the hover
           transition above never inherits the per-item delay. */
        .js .about-values:not(.in) .about-value { opacity: 0; }
        .js .about-values.in .about-value {
          animation: about-value-rise 400ms var(--ease-exp) backwards;
          animation-delay: calc(var(--i) * 50ms);
        }
        @keyframes about-value-rise {
          from { opacity: 0; transform: translateY(14px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .js .about-values:not(.in) .about-value { opacity: 1; }
          .js .about-values.in .about-value { animation: none; }
        }
        .about-value-mark {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg,
            color-mix(in oklab, var(--color-accent) 24%, var(--color-bg-elev)),
            color-mix(in oklab, var(--color-indigo) 18%, var(--color-bg-elev)));
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--color-ink);
          font-weight: 600;
        }
        .about-value h4 {
          font-size: 17px;
          font-weight: 600;
        }
        .about-value p {
          margin-top: 4px;
          font-size: 14px;
          color: var(--color-ink-soft);
          line-height: 1.5;
        }
      `}</style>
    </section>
  );
}
