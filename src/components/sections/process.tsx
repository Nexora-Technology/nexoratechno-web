'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const STEPS = [
  { num: '01', t_key: 'proc1_t', d_key: 'proc1_d' },
  { num: '02', t_key: 'proc2_t', d_key: 'proc2_d' },
  { num: '03', t_key: 'proc3_t', d_key: 'proc3_d' },
  { num: '04', t_key: 'proc4_t', d_key: 'proc4_d' },
  { num: '05', t_key: 'proc5_t', d_key: 'proc5_d' },
  { num: '06', t_key: 'proc6_t', d_key: 'proc6_d' },
];

export default function Process() {
  const t = useTranslations();
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('in'); observer.disconnect(); } },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div ref={headRef} className="section-head reveal">
          <span className="eyebrow">{t('process_eyebrow')}</span>
          <h2 className="section-title">{t('process_title')}</h2>
          <p className="section-sub">{t('process_sub')}</p>
        </div>

        <div className="process-timeline">
          {STEPS.map(({ num, t_key, d_key }) => (
            <div key={num} className="process-step">
              <div className="process-num">{num}</div>
              <h3>{t(t_key)}</h3>
              <p>{t(d_key)}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .process-timeline {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--color-line);
          border: 1px solid var(--color-line);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        @media (max-width: 900px) {
          .process-timeline { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .process-timeline { grid-template-columns: 1fr; }
        }
        .process-step {
          background: var(--color-bg-elev);
          padding: 32px 28px;
          position: relative;
        }
        .process-num {
          font-family: var(--font-display);
          font-size: 44px;
          font-weight: 600;
          letter-spacing: -0.04em;
          background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-grad-start) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          line-height: 1;
        }
        .process-step h3 {
          font-size: 20px;
          margin-top: 14px;
        }
        .process-step p {
          margin-top: 10px;
          font-size: 14.5px;
          color: var(--color-ink-soft);
          line-height: 1.6;
        }
      `}</style>
    </section>
  );
}
