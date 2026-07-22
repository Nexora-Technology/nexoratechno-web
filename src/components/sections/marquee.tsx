'use client';

import { useTranslations } from 'next-intl';

const STACK = [
  'React', 'Next.js', 'Node.js', 'Python', 'Go',
  'Swift', 'Kotlin', 'Flutter', 'AWS', 'GCP',
  'Kubernetes', 'PostgreSQL',
];

export default function Marquee() {
  const t = useTranslations();

  return (
    <section
      style={{
        padding: '40px 0',
        borderTop: '1px solid var(--color-line)',
        borderBottom: '1px solid var(--color-line)',
        background: 'var(--color-bg-soft)',
        overflow: 'hidden',
      }}
    >
      <p style={{
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        color: 'var(--color-ink-mute)',
        marginBottom: '20px',
      }}>
        {t('marquee_label')}
      </p>

      <div className="marquee-viewport">
        <div
          className="marquee-track"
          aria-hidden="true"
        >
          {[...STACK, ...STACK].map((tech, i) => (
            <span key={i} className={i >= STACK.length ? 'marquee-item marquee-dup' : 'marquee-item'}>
              {tech}
              <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .marquee-viewport {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .marquee-track {
          display: flex;
          gap: 56px;
          animation: marquee-scroll 40s linear infinite;
          width: max-content;
        }
        .marquee-track:hover { animation-play-state: paused; }
        .marquee-item {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--color-ink-mute);
          opacity: 0.6;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          white-space: nowrap;
        }
        .marquee-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--color-accent);
          flex-shrink: 0;
        }
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        /* Reduced motion: static, centered, wrapping row — no clipped names,
           no edge fade, duplicate loop copies hidden. */
        @media (prefers-reduced-motion: reduce) {
          .marquee-viewport {
            -webkit-mask-image: none;
            mask-image: none;
          }
          .marquee-track {
            animation: none;
            width: auto;
            flex-wrap: wrap;
            justify-content: center;
            row-gap: 16px;
            padding: 0 24px;
          }
          .marquee-dup { display: none; }
        }
      `}</style>
    </section>
  );
}
