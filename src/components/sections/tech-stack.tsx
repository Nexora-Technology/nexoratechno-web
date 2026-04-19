'use client';

import { useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';

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

export default function TechStack() {
  const t = useTranslations();
  const headRef = useRef<HTMLDivElement>(null);
  useReveal(headRef);

  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div ref={headRef} className="section-head reveal">
          <span className="eyebrow">{t('tech_eyebrow')}</span>
          <h2 className="section-title">{t('tech_title')}</h2>
          <p className="section-sub">{t('tech_sub')}</p>
        </div>

        <div className="tech-grid">
          {STACKS.map(({ key, pills }) => (
            <div key={key} className="tech-card">
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
          transition: border-color 0.2s, color 0.2s, background 0.2s;
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
