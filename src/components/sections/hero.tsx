'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import HeroGrid from './hero-grid';
import HeroCanvas from './hero-canvas';
import { useCountUp } from '@/components/motion';

/** Hero background: 'grid' = engineering blueprint + sweep, 'canvas' = floating shapes. */
const HERO_BG: 'grid' | 'canvas' = 'grid';

/**
 * Page-load choreography: masked headline lines rise first, then badge → sub →
 * CTAs → stats follow. Fires only while the tab is visible (delayed transitions
 * freeze at progress 0 in hidden tabs) with a settle failsafe so content can
 * never stay hidden.
 */
function useHeroChoreography() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let settleTimer = 0;
    let raf = 0;

    const fire = () => {
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(() => {
          el.classList.add('mp-in');
          settleTimer = window.setTimeout(() => el.classList.add('mp-settle'), 2200);
        });
      });
    };

    const onVis = () => {
      if (document.visibilityState === 'visible') {
        document.removeEventListener('visibilitychange', onVis);
        fire();
      }
    };

    if (document.visibilityState === 'visible') {
      fire();
    } else {
      document.addEventListener('visibilitychange', onVis);
      // absolute failsafe: never leave the hero blank
      settleTimer = window.setTimeout(() => el.classList.add('mp-in', 'mp-settle'), 4000);
    }

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      clearTimeout(settleTimer);
      cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}

function StatValue({ value }: { value: string }) {
  const ref = useCountUp<HTMLDivElement>(value);
  return (
    <div ref={ref} className="hero-stat-value">
      {value}
    </div>
  );
}

export default function Hero() {
  const t = useTranslations();
  const sectionRef = useHeroChoreography();

  const lines = [
    { text: t('hero_title_1'), delay: '0s' },
    { text: t('hero_title_2'), delay: '0.07s' },
    { text: t('hero_title_3'), delay: '0.14s', grad: true },
  ];

  const stats = [
    { label: t('hero_stat_1'), value: '2025' },
    { label: t('hero_stat_2'), value: 'TP.HCM' },
    { label: t('hero_stat_3'), value: '40+' },
    { label: t('hero_stat_4'), value: '98%' },
  ];

  return (
    <section ref={sectionRef} id="home" className="hero mp-choreo">
      {HERO_BG === 'grid' ? <HeroGrid /> : <HeroCanvas />}

      <div className="container hero-inner">
        {/* Badge */}
        <div className="hero-badge mp-follow" style={{ '--mp-d': '0.32s' } as React.CSSProperties}>
          <span className="hero-badge-dot">
            <span className="hero-badge-ring" />
          </span>
          {t('hero_badge')}
        </div>

        {/* Title — each line rises through its own mask */}
        <h1 className="hero-title">
          {lines.map(({ text, delay, grad }) => (
            <span key={text} className="mp-mask">
              <span style={{ '--mp-d': delay } as React.CSSProperties} className={grad ? 'hero-title-grad' : undefined}>
                {text}
              </span>
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="hero-sub mp-follow" style={{ '--mp-d': '0.4s' } as React.CSSProperties}>
          {t('hero_sub')}
        </p>

        {/* CTAs */}
        <div className="hero-ctas mp-follow" style={{ '--mp-d': '0.48s' } as React.CSSProperties}>
          <a href="#contact" className="btn btn-accent">
            {t('hero_cta_primary')}
            <svg className="btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#services" className="btn btn-ghost">
            {t('hero_cta_secondary')}
          </a>
        </div>

        {/* Stats */}
        <div className="hero-stats mp-follow" style={{ '--mp-d': '0.56s' } as React.CSSProperties}>
          {stats.map(({ label, value }) => (
            <div key={label} className="hero-stat">
              <div className="hero-stat-label">{label}</div>
              <StatValue value={value} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .hero-inner {
          position: relative;
          z-index: 1;
          padding-top: 140px;
          padding-bottom: 80px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--color-bg-elev);
          border: 1px solid var(--color-line);
          border-radius: 999px;
          padding: 6px 14px 6px 8px;
          box-shadow: var(--shadow-sm);
          font-size: 13px;
          color: var(--color-ink-soft);
          font-weight: 500;
        }
        .hero-badge-dot {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, var(--color-accent), #9E7A1F);
          position: relative;
          flex-shrink: 0;
        }
        .hero-badge-ring {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1px solid var(--color-accent);
          opacity: 0.5;
          animation: pulse-ring 2.4s ease-out infinite;
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .hero-title {
          font-family: var(--font-display);
          font-size: clamp(44px, 7vw, 96px);
          font-weight: 600;
          letter-spacing: -0.035em;
          line-height: 1.02;
          color: var(--color-ink);
          margin-top: 28px;
          max-width: 14ch;
        }
        .hero-title-grad {
          background: linear-gradient(100deg, var(--color-accent) 0%, var(--color-grad-start) 45%, var(--color-grad-end) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-style: italic;
          font-weight: 500;
          letter-spacing: -0.04em;
        }
        .hero-sub {
          font-size: clamp(16px, 1.6vw, 20px);
          line-height: 1.55;
          color: var(--color-ink-soft);
          margin-top: 28px;
          max-width: 56ch;
        }
        .hero-ctas {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          margin-top: 36px;
        }
        .hero-stats {
          margin-top: 72px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
          padding: 28px 0;
          border-top: 1px solid var(--color-line);
          border-bottom: 1px solid var(--color-line);
          max-width: 860px;
        }
        .hero-stat { padding: 0 8px; }
        .hero-stat-label {
          font-family: var(--font-mono);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-ink-mute);
        }
        .hero-stat-value {
          font-family: var(--font-display);
          font-variant-numeric: tabular-nums;
          font-size: 28px;
          font-weight: 600;
          letter-spacing: -0.02em;
          margin-top: 6px;
          color: var(--color-ink);
          line-height: 1.1;
        }
        @media (max-width: 700px) {
          .hero-stats { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </section>
  );
}
