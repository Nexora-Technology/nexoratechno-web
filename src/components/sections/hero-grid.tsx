'use client';

/**
 * Engineering-grid hero background: faint 1px blueprint lines with a slow
 * diagonal highlight sweep. Pure CSS, theme-aware via tokens. Alternative to
 * <HeroCanvas /> — switch via HERO_BG in hero.tsx.
 */
export default function HeroGrid() {
  return (
    <div className="hero-grid" aria-hidden="true">
      <div className="hero-grid-sweep" />
      <style>{`
        .hero-grid {
          position: absolute;
          inset: 0;
          overflow: hidden;
          contain: paint;
          background-image:
            linear-gradient(var(--color-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-line) 1px, transparent 1px);
          background-size: 56px 56px;
          /* fade the grid out toward the edges so it reads as depth, not wallpaper */
          -webkit-mask-image: radial-gradient(120% 90% at 30% 40%, #000 0%, transparent 78%);
          mask-image: radial-gradient(120% 90% at 30% 40%, #000 0%, transparent 78%);
        }
        .hero-grid-sweep {
          position: absolute;
          top: -20%;
          bottom: -20%;
          width: 34%;
          transform: skewX(-14deg) translateX(-140%);
          background: linear-gradient(90deg,
            transparent 0%,
            color-mix(in oklab, var(--color-accent) 7%, transparent) 40%,
            color-mix(in oklab, var(--color-indigo) 6%, transparent) 60%,
            transparent 100%);
          animation: hero-sweep 13s var(--ease-exp) infinite;
        }
        @keyframes hero-sweep {
          0%   { transform: skewX(-14deg) translateX(-140%); }
          60%, 100% { transform: skewX(-14deg) translateX(460%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-grid-sweep { animation: none; display: none; }
        }
      `}</style>
    </div>
  );
}
