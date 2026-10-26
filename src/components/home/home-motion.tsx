'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { useMotion } from '@/components/providers/motion-provider';
import { choreography } from './motion-state';
import { createScene, type SceneHandle } from './home-scene';
import { setupScrollScenes } from './scroll-scenes';
import { setupPointerEffects } from './pointer-effects';
import { LOCALE_SCROLL_KEY } from '@/components/layout/site-header';

gsap.registerPlugin(ScrollTrigger);

function takeLocaleScroll(): number | null {
  try {
    const value = sessionStorage.getItem(LOCALE_SCROLL_KEY);
    sessionStorage.removeItem(LOCALE_SCROLL_KEY);
    return value === null ? null : Number(value);
  } catch {
    return null;
  }
}

/** Owns every imperative motion system on the home page: Lenis smooth scroll,
 *  GSAP/ScrollTrigger scenes, the shared WebGL scene and pointer effects.
 *  Each effect fully reverts in cleanup (Strict Mode safe, no duplicate pins or canvases). */
export default function HomeMotion({ rootId }: { rootId: string }) {
  const { reduced, ready } = useMotion();
  const scene = useRef<SceneHandle | null>(null);

  // Ticker, refresh plumbing and the WebGL scene: once per mount.
  useEffect(() => {
    const root = document.getElementById(rootId)!;
    let frame = 0;
    choreography.refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    // <details> toggles don't bubble; capture catches accordions, library and comparison.
    const onToggle = () => choreography.refresh?.();
    document.addEventListener('toggle', onToggle, true);
    document.fonts?.ready.then(() => choreography.refresh?.());

    const tick = (time: number) => {
      choreography.lenis?.raf(time * 1000);
      scene.current?.render(time);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    let cancelled = false;
    createScene(root, () => cancelled)
      .then((handle) => {
        if (cancelled) handle?.dispose();
        else scene.current = handle;
      })
      .catch((error) => console.warn('Nexora: WebGL unavailable, showing the static sculpture.', error));

    const cleanupPointer = setupPointerEffects(root, gsap);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      document.removeEventListener('toggle', onToggle, true);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      cleanupPointer();
      scene.current?.dispose();
      scene.current = null;
      choreography.refresh = null;
    };
  }, [rootId]);

  // Smooth scroll + scroll scenes; rebuilt when the visitor toggles motion.
  useEffect(() => {
    // Wait for the stored/system preference so reduced-motion visitors never see a first motion pass.
    if (!ready) return;
    const root = document.getElementById(rootId)!;
    const y = takeLocaleScroll() ?? window.scrollY;
    choreography.reduced = reduced;
    const lenis = reduced ? null : new Lenis({ duration: 1.05, smoothWheel: true, anchors: true });
    lenis?.on('scroll', ScrollTrigger.update);
    choreography.lenis = lenis;
    const context = gsap.context(() => setupScrollScenes(root, gsap, ScrollTrigger), root);
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    scene.current?.invalidate();
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo({ top: y, behavior: 'instant' });
    return () => {
      context.revert();
      // Scrubbed tweens re-record their start values on refresh, so revert can
      // leave "from" styles behind (dimmed words/lines). Clear what GSAP touched;
      // the canvas keeps the size three.js set on it.
      const footerWord = document.querySelector('.footer-word');
      gsap.set([...root.querySelectorAll('[style]:not(canvas)'), ...(footerWord ? [footerWord] : [])], { clearProps: 'all' });
      lenis?.destroy();
      choreography.lenis = null;
      choreography.stageActive = false;
      choreography.stageProgress = 0;
      const stage = root.querySelector<HTMLElement>('.connection-stage');
      stage?.querySelector('.stage-phase')?.replaceChildren('01 / THINK');
      stage?.querySelector('.stage-percent')?.replaceChildren('000%');
      stage?.querySelector<HTMLElement>('.stage-meter>span')?.style.removeProperty('width');
    };
  }, [rootId, reduced, ready]);

  return null;
}
