'use client';

import { useEffect, useRef } from 'react';

/** Exponential ease-out — same curve as the CSS `--ease-exp` token. */
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Counts the numeric part of `value` (e.g. "40+", "98%", "2025") from 0 to its
 * target when the element scrolls into view. The full value is rendered
 * server-side, so SEO / no-JS / reduced-motion all see the final number; the
 * animation only rewrites textContent after mount.
 */
export function useCountUp<T extends HTMLElement = HTMLElement>(
  value: string,
  duration = 450,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = value.match(/^(\d+)(.*)$/);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!match || reduce || typeof IntersectionObserver === 'undefined') {
      el.textContent = value;
      return;
    }

    const target = parseInt(match[1], 10);
    const suffix = match[2] ?? '';
    let raf = 0;

    el.textContent = `0${suffix}`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        let start: number | null = null;
        const tick = (now: number) => {
          if (start === null) start = now;
          const p = easeOutExpo(Math.min((now - start) / duration, 1));
          el.textContent = `${Math.round(target * p)}${suffix}`;
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = value; // never leave a partial number behind
    };
  }, [value, duration]);

  return ref;
}
