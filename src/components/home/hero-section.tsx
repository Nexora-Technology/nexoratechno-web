import { useTranslations } from 'next-intl';
import LiveTime from './live-time';

export default function HeroSection() {
  const t = useTranslations('home.hero');
  return (
    <section className="hero" id="home">
      <div className="hero-top mono">
        <span>
          <i className="status-dot" /> {t('status')}
        </span>
        <span>
          {t('city')} <LiveTime />
        </span>
      </div>
      <div className="hero-title">
        <h1>
          <span>Engineering</span>
          <span>
            what’s <em>next.</em>
          </span>
        </h1>
        <span className="hero-star" aria-hidden="true">
          ✳
        </span>
      </div>
      <div className="sculpture-wrap">
        <div className="orbit" aria-hidden="true" />
        {/* The WebGL canvas host is attached here (and moved to the 3D chapter) by home-scene. */}
        <div id="sculpture" role="img" aria-label={t('sculpture')}>
          <div className="sculpture-fallback" aria-hidden="true" />
          <div className="scene-slot" data-scene-slot="hero" />
        </div>
        <span className="sculpture-label mono">N° 01 — THE CONNECTION</span>
        <span className="coordinate mono">
          10.76° N<br />
          106.70° E
        </span>
      </div>
      <div className="hero-bottom">
        <a className="scroll-cue mono" href="#intro">
          <span className="scroll-icon" aria-hidden="true">
            ↓
          </span>
          <span>{t('scroll')}</span>
        </a>
        <div className="hero-description">
          <p>{t('description')}</p>
          <a className="text-link" href="#work">
            <span>{t('explore')}</span> ↗
          </a>
        </div>
        <span className="hero-index mono">STRATEGY → BUILD → EVOLVE</span>
      </div>
    </section>
  );
}
