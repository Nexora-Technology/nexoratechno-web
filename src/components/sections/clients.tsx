'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const CLIENTS = [
  {
    name: 'Kerova',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  },
  {
    name: 'Altair',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 2 L22 20 L2 20 Z" />
      </svg>
    ),
  },
  {
    name: 'Monolith',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <rect x="3" y="3" width="18" height="18" />
      </svg>
    ),
  },
  {
    name: 'Orbit Co',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <path d="M4 12 L12 4 L20 12 L12 20 Z" />
      </svg>
    ),
  },
  {
    name: 'Nova',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
        <path d="M12 2 L16 10 L24 12 L16 14 L12 22 L8 14 L0 12 L8 10 Z" />
      </svg>
    ),
  },
  {
    name: 'Lumen',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" fill="currentColor" />
      </svg>
    ),
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

export default function Clients() {
  const t = useTranslations();
  const wrapRef = useRef<HTMLDivElement>(null);
  useReveal(wrapRef);

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div ref={wrapRef} className="reveal" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 500,
            color: 'var(--color-ink-mute)',
            letterSpacing: '-0.01em',
            textAlign: 'center',
          }}>
            {t('clients_title')}
          </h3>
        </div>

        <div className="clients-row">
          {CLIENTS.map(({ name, icon }) => (
            <div key={name} className="client-logo">
              {icon}
              <span>{name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .clients-row {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0;
          border: 1px solid var(--color-line);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--color-bg-elev);
        }
        @media (max-width: 900px) { .clients-row { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 520px) { .clients-row { grid-template-columns: repeat(2, 1fr); } }
        .client-logo {
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid var(--color-line);
          border-bottom: 1px solid var(--color-line);
          font-family: var(--font-display);
          font-weight: 600;
          font-size: 18px;
          letter-spacing: -0.01em;
          color: var(--color-ink-mute);
          opacity: 0.75;
          transition: opacity 0.2s, color 0.2s;
          gap: 8px;
          cursor: default;
        }
        .client-logo:hover { opacity: 1; color: var(--color-ink); }
        .client-logo:nth-child(6n) { border-right: none; }
        @media (max-width: 900px) {
          .client-logo:nth-child(3n) { border-right: none; }
        }
      `}</style>
    </section>
  );
}
