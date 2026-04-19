'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const ICONS = [
  // 01 — Website
  <svg key="web" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 8h18M7 4v4"/>
  </svg>,
  // 02 — Mobile
  <svg key="mobile" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/>
  </svg>,
  // 03 — Application (layers)
  <svg key="app" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2 3 7l9 5 9-5-9-5zM3 12l9 5 9-5M3 17l9 5 9-5"/>
  </svg>,
  // 04 — Maintenance (gear)
  <svg key="maint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.7 1.7 0 0 0 .4 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.4 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.4l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .4-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.4-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.4h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.4l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.4 1.9v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
  </svg>,
  // 05 — IoT
  <svg key="iot" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2"/><path d="M5 12a7 7 0 0 1 14 0M2 12a10 10 0 0 1 20 0M8.5 12a3.5 3.5 0 0 1 7 0"/>
  </svg>,
  // 06 — Legacy Migration
  <svg key="legacy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h6v6H4zM14 14h6v6h-6z"/><path d="M10 7h4M14 7a4 4 0 0 1 0 8h-4"/>
  </svg>,
];

const SERVICES = [
  { num: '01', key: 'svc1', f: ['svc1_f1', 'svc1_f2', 'svc1_f3', 'svc1_f4', 'svc1_f5'] },
  { num: '02', key: 'svc2', f: ['svc2_f1', 'svc2_f2', 'svc2_f3', 'svc2_f4', 'svc2_f5'] },
  { num: '03', key: 'svc3', f: ['svc3_f1', 'svc3_f2', 'svc3_f3', 'svc3_f4', 'svc3_f5'] },
  { num: '04', key: 'svc4', f: ['svc4_f1', 'svc4_f2', 'svc4_f3', 'svc4_f4', 'svc4_f5'] },
  { num: '05', key: 'svc5', f: ['svc5_f1', 'svc5_f2', 'svc5_f3', 'svc5_f4', 'svc5_f5'] },
  { num: '06', key: 'svc6', f: ['svc6_f1', 'svc6_f2', 'svc6_f3', 'svc6_f4', 'svc6_f5'] },
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

export default function Services() {
  const t = useTranslations();
  const headRef = useRef<HTMLDivElement>(null);
  useReveal(headRef);

  return (
    <section className="section" id="services">
      <div className="container">
        <div ref={headRef} className="section-head reveal">
          <span className="eyebrow">{t('services_eyebrow')}</span>
          <h2 className="section-title">{t('services_title')}</h2>
          <p className="section-sub">{t('services_sub')}</p>
        </div>

        <div className="services-grid">
          {SERVICES.map(({ num, key, f }, i) => (
            <div key={key} className="service-card">
              <span className="service-num">{num} / 06</span>
              <div className="service-icon">
                {ICONS[i]}
              </div>
              <h3 className="service-title">{t(`${key}_title`)}</h3>
              <p className="service-desc">{t(`${key}_desc`)}</p>

              <ul className="service-features">
                {f.map(fk => (
                  <li key={fk}>
                    {t(fk)}
                  </li>
                ))}
              </ul>

              <a href="#contact" className="service-learn">
                {t('svc_learn')}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--color-line);
          border: 1px solid var(--color-line);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }
        @media (max-width: 900px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .services-grid { grid-template-columns: 1fr; }
        }
        .service-card {
          position: relative;
          background: var(--color-bg-elev);
          padding: 36px 32px;
          min-height: 340px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: background 0.35s;
          cursor: default;
        }
        .service-card:hover { background: var(--color-bg); }
        .service-num {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          color: var(--color-ink-mute);
        }
        .service-icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-top: 18px;
          margin-bottom: 24px;
          background: linear-gradient(135deg,
            color-mix(in oklab, var(--color-accent) 22%, var(--color-bg-elev)) 0%,
            color-mix(in oklab, var(--color-indigo) 18%, var(--color-bg-elev)) 100%);
          border: 1px solid var(--color-line-strong);
          transition: transform 0.35s;
          color: var(--color-ink);
        }
        .service-card:hover .service-icon { transform: scale(1.05) rotate(-4deg); }
        .service-icon svg {
          width: 24px;
          height: 24px;
          stroke: currentColor;
          stroke-width: 1.6;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .service-title {
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.015em;
        }
        .service-desc {
          margin-top: 10px;
          font-size: 14.5px;
          line-height: 1.6;
          color: var(--color-ink-soft);
        }
        .service-features {
          list-style: none;
          padding: 0;
          margin: 20px 0 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
          transition: max-height 0.4s ease, opacity 0.3s ease, margin-top 0.3s ease;
        }
        .service-card:hover .service-features,
        .service-card:focus-within .service-features {
          max-height: 300px;
          opacity: 1;
        }
        .service-features li {
          font-size: 13.5px;
          color: var(--color-ink-soft);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .service-features li::before {
          content: "";
          width: 14px;
          height: 1px;
          background: var(--color-accent);
          flex-shrink: 0;
        }
        .service-learn {
          margin-top: auto;
          padding-top: 20px;
          font-size: 13px;
          color: var(--color-ink);
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .service-learn svg {
          width: 14px;
          height: 14px;
          transition: transform 0.2s;
        }
        .service-card:hover .service-learn svg { transform: translateX(4px); }
      `}</style>
    </section>
  );
}
