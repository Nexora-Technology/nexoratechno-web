import type { gsap as GSAP } from 'gsap';
import { choreography } from './motion-state';

/** Artwork tilt, the "view case" cursor label and magnetic CTAs — only on
 *  devices with a fine hovering pointer. Returns a cleanup function. */
export function setupPointerEffects(root: HTMLElement, gsap: typeof GSAP): () => void {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  const controller = new AbortController();
  const { signal } = controller;
  const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, fn: (e: HTMLElementEventMap[K]) => void) =>
    el.addEventListener(type, fn, { passive: true, signal });

  const cursor = root.querySelector<HTMLElement>('.case-cursor')!;
  const cursorX = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3.out' });
  const cursorY = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3.out' });
  root.querySelectorAll<HTMLElement>('.project-art').forEach((art) => {
    on(art, 'pointermove', (e) => {
      if (choreography.reduced) return;
      const rect = art.getBoundingClientRect();
      art.style.setProperty('--tilt-x', `${(-(e.clientY - rect.top - rect.height / 2) / rect.height) * 7}deg`);
      art.style.setProperty('--tilt-y', `${((e.clientX - rect.left - rect.width / 2) / rect.width) * 7}deg`);
      cursorX(e.clientX);
      cursorY(e.clientY);
    });
    on(art, 'pointerenter', () => !choreography.reduced && gsap.to(cursor, { opacity: 1, duration: 0.2 }));
    on(art, 'pointerleave', () => {
      art.style.setProperty('--tilt-x', '0deg');
      art.style.setProperty('--tilt-y', '0deg');
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    });
  });

  const magnets = [...document.querySelectorAll<HTMLElement>('.round-arrow'), ...root.querySelectorAll<HTMLElement>('.big-arrow,.submit-button')];
  magnets.forEach((button) => {
    const xTo = gsap.quickTo(button, 'x', { duration: 0.35, ease: 'power3.out' });
    const yTo = gsap.quickTo(button, 'y', { duration: 0.35, ease: 'power3.out' });
    on(button, 'pointermove', (e) => {
      if (choreography.reduced) return;
      const rect = button.getBoundingClientRect();
      xTo((e.clientX - rect.left - rect.width / 2) * 0.18);
      yTo((e.clientY - rect.top - rect.height / 2) * 0.18);
    });
    on(button, 'pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });

  return () => {
    controller.abort();
    gsap.killTweensOf([cursor, ...magnets]);
    gsap.set([cursor, ...magnets], { clearProps: 'transform,opacity' });
  };
}
