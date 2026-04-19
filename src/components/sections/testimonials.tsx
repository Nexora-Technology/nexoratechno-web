'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const TESTIMONIALS = [
  {
    quoteKey: 'testi1_q',
    nameKey: 'testi1_n',
    roleKey: 'testi1_r',
    initials: 'NA',
    gradient: 'linear-gradient(135deg, var(--color-accent), var(--color-indigo))',
  },
  {
    quoteKey: 'testi2_q',
    nameKey: 'testi2_n',
    roleKey: 'testi2_r',
    initials: 'QB',
    gradient: 'linear-gradient(135deg, var(--color-indigo), var(--color-cyan))',
  },
  {
    quoteKey: 'testi3_q',
    nameKey: 'testi3_n',
    roleKey: 'testi3_r',
    initials: 'TV',
    gradient: 'linear-gradient(135deg, var(--color-cyan), var(--color-accent))',
  },
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

export default function Testimonials() {
  const t = useTranslations();
  const headRef = useRef<HTMLDivElement>(null);
  useReveal(headRef);

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div ref={headRef} className="section-head reveal">
          <span className="eyebrow">{t('testi_eyebrow')}</span>
          <h2 className="section-title">{t('testi_title')}</h2>
        </div>

        <div className="testi-grid">
          {TESTIMONIALS.map(({ quoteKey, nameKey, roleKey, initials, gradient }) => (
            <div key={nameKey} className="testi-card">
              <p className="testi-quote">{t(quoteKey)}</p>

              <div className="testi-meta">
                <div
                  className="testi-avatar"
                  style={{ background: gradient }}
                >
                  {initials}
                </div>
                <div>
                  <div className="testi-name">{t(nameKey)}</div>
                  <div className="testi-role">{t(roleKey)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .testi-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) { .testi-grid { grid-template-columns: 1fr; } }
        .testi-card {
          background: var(--color-bg-elev);
          border: 1px solid var(--color-line);
          border-radius: var(--radius-lg);
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          min-height: 280px;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .testi-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }
        .testi-quote {
          font-family: var(--font-display);
          font-size: 20px;
          line-height: 1.4;
          letter-spacing: -0.015em;
          color: var(--color-ink);
          font-weight: 500;
          text-wrap: pretty;
          flex: 1;
        }
        .testi-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: auto;
        }
        .testi-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 14px;
          flex-shrink: 0;
        }
        .testi-name { font-size: 14px; font-weight: 600; }
        .testi-role {
          font-size: 12.5px;
          color: var(--color-ink-mute);
          margin-top: 2px;
        }
      `}</style>
    </section>
  );
}
