'use client';

import { useTranslations } from 'next-intl';
import { useInView } from '@/components/motion';

const STACKS = [
  {
    key: 'tech_frontend',
    pills: ['React', 'Next.js', 'Vue', 'Nuxt', 'TypeScript', 'Tailwind'],
  },
  {
    key: 'tech_backend',
    pills: ['Node.js', 'Python', 'Go', 'Java', '.NET', 'GraphQL', 'PostgreSQL', 'MongoDB'],
  },
  {
    key: 'tech_mobile',
    pills: ['Swift', 'SwiftUI', 'Kotlin', 'React Native', 'Flutter'],
  },
  {
    key: 'tech_cloud',
    pills: ['AWS', 'GCP', 'Azure', 'Kubernetes', 'Docker', 'Terraform', 'GitHub Actions'],
  },
  {
    key: 'tech_data',
    pills: ['Python', 'TensorFlow', 'PyTorch', 'LangChain', 'Snowflake', 'dbt'],
  },
  {
    key: 'tech_iot',
    pills: ['MQTT', 'ESP32', 'Raspberry Pi', 'AWS IoT Core', 'Zigbee', 'LoRaWAN'],
  },
];

export default function TechStack() {
  const t = useTranslations();
  const headRef = useInView<HTMLDivElement>();
  const gridRef = useInView<HTMLDivElement>();

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div ref={headRef} className="section-head reveal">
          <span className="eyebrow">{t('tech_eyebrow')}</span>
          <h2 className="section-title">{t('tech_title')}</h2>
          <p className="section-sub">{t('tech_sub')}</p>
        </div>

        <div ref={gridRef} className="tech-grid">
          {STACKS.map(({ key, pills }, i) => (
            <div key={key} className="tech-card" style={{ '--i': i } as React.CSSProperties}>
              <h4>{t(key)}</h4>
              <div className="tech-pills">
                {pills.map(pill => (
                  <span key={pill} className="tech-pill">{pill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .tech-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 900px) { .tech-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .tech-grid { grid-template-columns: 1fr; } }
        .tech-card {
          background: var(--color-bg-elev);
          border: 1px solid var(--color-line);
          border-radius: var(--radius-md);
          padding: 28px;
          transition: transform var(--dur-fast) var(--ease-exp), border-color var(--dur-fast) var(--ease-exp);
        }
        .tech-card:hover {
          transform: translateY(-2px);
          border-color: var(--color-line-strong);
        }
        /* Staggered entrance — animation keeps hover transitions delay-free. */
        .js .tech-grid:not(.in) .tech-card { opacity: 0; }
        .js .tech-grid.in .tech-card {
          animation: tech-card-rise 400ms var(--ease-exp) backwards;
          animation-delay: calc(var(--i) * 50ms);
        }
        @keyframes tech-card-rise {
          from { opacity: 0; transform: translateY(14px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .js .tech-grid:not(.in) .tech-card { opacity: 1; }
          .js .tech-grid.in .tech-card { animation: none; }
        }
        .tech-card h4 {
          font-size: 14px;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-ink-mute);
          font-weight: 500;
        }
        .tech-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
        }
        .tech-pill {
          padding: 6px 12px;
          font-size: 13px;
          font-weight: 500;
          background: var(--color-bg-soft);
          border: 1px solid var(--color-line);
          border-radius: 9999px;
          color: var(--color-ink-soft);
          transition: border-color var(--dur-fast) var(--ease-exp), color var(--dur-fast) var(--ease-exp), background var(--dur-fast) var(--ease-exp);
          cursor: default;
        }
        .tech-pill:hover {
          border-color: var(--color-accent);
          color: var(--color-ink);
          background: color-mix(in oklab, var(--color-accent-soft) 25%, var(--color-bg-elev));
        }
      `}</style>
    </section>
  );
}
