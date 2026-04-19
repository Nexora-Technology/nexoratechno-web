'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import HeroCanvas from './hero-canvas';

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('in'); observer.disconnect(); } },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Hero() {
  const t = useTranslations();
  const statsRef = useReveal();

  return (
    <section
      id="home"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <HeroCanvas />

      <div
        className="container"
        style={{ position: 'relative', zIndex: 1, paddingTop: '140px', paddingBottom: '80px' }}
      >
        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          background: 'var(--color-bg-elev)',
          border: '1px solid var(--color-line)',
          borderRadius: '999px',
          padding: '6px 14px 6px 8px',
          marginBottom: '0px',
          boxShadow: 'var(--shadow-sm)',
          fontSize: '13px',
          color: 'var(--color-ink-soft)',
          fontWeight: 500,
        }}>
          <span style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, var(--color-accent), #9E7A1F)',
            position: 'relative',
            flexShrink: 0,
          }}>
            <span style={{
              position: 'absolute',
              inset: '-3px',
              borderRadius: '50%',
              border: '1px solid var(--color-accent)',
              opacity: 0.5,
              animation: 'pulse-ring 2.4s ease-out infinite',
            }} />
          </span>
          {t('hero_badge')}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(44px, 7vw, 104px)',
          fontWeight: 600,
          letterSpacing: '-0.035em',
          lineHeight: 0.98,
          color: 'var(--color-ink)',
          marginBottom: '0px',
          marginTop: '28px',
          maxWidth: '14ch',
        }}>
          <span>{t('hero_title_1')}<br /></span>
          <span>{t('hero_title_2')}<br /></span>
          <span style={{
            background: 'linear-gradient(100deg, var(--color-accent) 0%, var(--color-grad-start) 45%, var(--color-grad-end) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontStyle: 'italic',
            fontWeight: 500,
            letterSpacing: '-0.04em',
          }}>
            {t('hero_title_3')}
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(16px, 1.6vw, 20px)',
          lineHeight: 1.55,
          color: 'var(--color-ink-soft)',
          marginTop: '28px',
          maxWidth: '56ch',
        }}>
          {t('hero_sub')}
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          gap: '14px',
          flexWrap: 'wrap',
          marginTop: '36px',
        }}>
          <a
            href="#contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 22px',
              borderRadius: '9999px',
              background: 'var(--color-accent)',
              color: '#1A1508',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 6px 14px rgba(218,182,96,0.35)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-1px)';
              el.style.boxShadow = '0 12px 28px rgba(218,182,96,0.5)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'none';
              el.style.boxShadow = '0 6px 14px rgba(218,182,96,0.35)';
            }}
          >
            {t('hero_cta_primary')}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </a>
          <a
            href="#services"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 22px',
              borderRadius: '9999px',
              border: '1px solid var(--color-line-strong)',
              background: 'transparent',
              color: 'var(--color-ink)',
              fontSize: '14px',
              fontWeight: 600,
              transition: 'background 0.2s, border-color 0.2s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'var(--color-bg-soft)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'transparent';
            }}
          >
            {t('hero_cta_secondary')}
          </a>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="reveal"
          style={{
            marginTop: '72px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            padding: '28px 0',
            borderTop: '1px solid var(--color-line)',
            borderBottom: '1px solid var(--color-line)',
            maxWidth: '860px',
          }}
        >
          {[
            { label: t('hero_stat_1'), value: '2025' },
            { label: t('hero_stat_2'), value: 'TP.HCM' },
            { label: t('hero_stat_3'), value: '40+' },
            { label: t('hero_stat_4'), value: '98%' },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{ padding: '0 8px' }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--color-ink-mute)',
              }}>
                {label}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '28px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                marginTop: '6px',
                color: 'var(--color-ink)',
                lineHeight: 1.1,
              }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @media (max-width: 700px) {
          .hero-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </section>
  );
}
