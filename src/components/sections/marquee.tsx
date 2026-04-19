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

      <div style={{ overflow: 'hidden' }}>
        <div
          className="marquee-track"
          aria-hidden="true"
        >
          {[...STACK, ...STACK].map((tech, i) => (
            <span key={i} className="marquee-item">
              {tech}
              <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .marquee-track {
          display: flex;
          gap: 56px;
          animation: marquee-scroll 40s linear infinite;
          width: max-content;
        }
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
      `}</style>
    </section>
  );
}
