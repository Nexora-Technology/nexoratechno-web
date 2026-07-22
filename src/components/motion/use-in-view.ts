'use client';

import { useEffect, useRef } from 'react';

interface UseInViewOptions {
  /** Portion of the element that must be visible before firing. */
  threshold?: number;
  rootMargin?: string;
  /** Class added to the element when it enters the viewport. */
  className?: string;
}

/**
 * Shared scroll-reveal trigger: adds `className` (default "in") to the element
 * once it intersects the viewport, then unobserves. Replaces the per-section
 * `useReveal` copies. Content stays visible without JS — the hidden initial
 * state only applies under `html.js` (see globals.css).
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {},
) {
  const { threshold = 0.1, rootMargin, className = 'in' } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add(className);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(className);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, className]);

  return ref;
}
