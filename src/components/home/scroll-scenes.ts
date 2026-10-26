import type { gsap as GSAP } from 'gsap';
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger';
import { choreography } from './motion-state';

const PHASES = ['01 / THINK', '02 / CONNECT', '03 / BUILD'];

/** Scroll choreography from the approved mockup. Runs inside a gsap.context
 *  scoped to the home root, so `revert()` undoes every tween, pin and class. */
export function setupScrollScenes(root: HTMLElement, gsap: typeof GSAP, ScrollTrigger: typeof ST) {
  const $ = <T extends HTMLElement = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;

  gsap.to('.reading-progress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: { trigger: document.body, refreshPriority: -100, start: 'top top', end: 'bottom bottom', scrub: true },
  });
  if (choreography.reduced) return;

  gsap.from('.hero-title h1>span', {
    yPercent: 45, rotationX: 35, opacity: 0, clipPath: 'inset(0 0 100% 0)', stagger: 0.15, duration: 1.25, ease: 'power4.out', clearProps: 'all',
  });
  gsap.fromTo('.statement .word-reveal', { opacity: 0.18 }, {
    opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: '.statement', start: 'top 82%', end: 'bottom 42%', scrub: 0.5 },
  });

  const mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 761px)', mobile: '(max-width: 760px)' }, (context) => {
    const desktop = Boolean(context.conditions?.desktop);
    const meter = $('.stage-meter>span');
    const percent = $('.stage-percent');
    const phase = $('.stage-phase');
    const updateStage = (s: ScrollTrigger) => {
      choreography.stageProgress = s.progress;
      meter.style.width = `${s.progress * 100}%`;
      percent.textContent = `${String(Math.round(s.progress * 100)).padStart(3, '0')}%`;
      phase.textContent = PHASES[s.progress < 0.3 ? 0 : s.progress < 0.7 ? 1 : 2];
    };
    gsap.timeline({
      scrollTrigger: {
        trigger: '.connection', id: 'connection-scene', refreshPriority: 3,
        start: desktop ? 'top top' : 'top 30%', end: desktop ? '+=1900' : 'bottom 50%',
        pin: desktop ? '.connection-stage' : false, scrub: 0.65, invalidateOnRefresh: true,
        onUpdate: updateStage, onToggle: updateStage,
      },
    })
      .fromTo('.stage-line:nth-child(1)', { opacity: 1, y: 0 }, { opacity: 0.2, y: -15, duration: 0.4 }, 0)
      .fromTo('.stage-line:nth-child(2)', { opacity: 0.2, x: -20 }, { opacity: 1, x: 0, duration: 0.25 }, 0.2)
      .to('.stage-line:nth-child(2)', { opacity: 0.2, duration: 0.2 }, 0.65)
      .fromTo('.stage-line:nth-child(3)', { opacity: 0.2, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 0.7)
      .fromTo('.stage-watermark', { xPercent: 10 }, { xPercent: -15, ease: 'none', duration: 1 }, 0)
      .fromTo('.stage-halo', { scale: 0.6 }, { scale: 1.5, ease: 'none', duration: 1 }, 0);
    // Keeps the sculpture in the chapter until the chapter leaves the viewport,
    // so it never jumps back to the fallback at the end of the pin.
    ScrollTrigger.create({
      trigger: '.connection', id: 'connection-visibility', refreshPriority: 2.9, start: 'top 65%', end: 'bottom top',
      onToggle: (s) => (choreography.stageActive = s.isActive),
      onRefresh: (s) => (choreography.stageActive = s.isActive),
    });
    return () => {
      choreography.stageActive = false;
      choreography.stageProgress = 0;
    };
  });

  mm.add('(min-width: 761px)', () => {
    const track = $('#process-track');
    const counter = $('.journey-counter');
    const progress = $('.process-progress span');
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + window.innerWidth * 0.104);
    gsap.to(track, {
      x: () => -distance(), ease: 'none',
      scrollTrigger: {
        trigger: '.journey', refreshPriority: 1, start: 'top top', end: () => `+=${distance() + 400}`,
        pin: '.journey-sticky', scrub: 1, invalidateOnRefresh: true,
        onUpdate: (s) => {
          counter.textContent = `0${Math.min(6, Math.floor(s.progress * 6) + 1)} — 06`;
          progress.style.width = `${16.67 + s.progress * 83.33}%`;
        },
      },
    });
    gsap.to('.sculpture-wrap', { y: 140, rotation: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
    gsap.to('.hero-title', { y: 80, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '35% top', end: 'bottom top', scrub: 0.5 } });

    // Project deck: four stacked panels; only the front one is focusable/clickable.
    const work = $('#work');
    const workCounter = $('.work-counter');
    const cards = gsap.utils.toArray<HTMLElement>('.project', root);
    work.classList.add('is-stack');
    cards.forEach((el, i) => {
      gsap.set(el, { zIndex: i + 1 });
      el.inert = i !== 0;
    });
    gsap.set(cards.slice(1), { yPercent: 110, rotationX: 12 });
    const deck = gsap.timeline({
      scrollTrigger: {
        trigger: '.project-grid', id: 'project-deck', refreshPriority: 2, start: 'top 60px',
        end: () => `+=${window.innerHeight * 3.2}`, pin: true, scrub: 0.65, invalidateOnRefresh: true,
        onUpdate: (s) => {
          const time = s.progress * 4.45;
          const index = time < 0.85 ? 0 : time < 2.2 ? 1 : time < 3.55 ? 2 : 3;
          workCounter.textContent = `0${index + 1} / 04`;
          cards.forEach((el, i) => (el.inert = i !== index));
        },
      },
    });
    deck.to(cards[0], { scale: 1, duration: 0.4, ease: 'none' }, 0);
    cards.slice(1).forEach((el, i) => {
      const position = 0.4 + i * 1.35;
      deck
        .to(cards[i], { scale: 0.92, yPercent: -5, opacity: 0.25, rotationX: -5, duration: 0.9, ease: 'none' }, position)
        .to(el, { yPercent: 0, rotationX: 0, duration: 0.9, ease: 'none' }, position);
    });
    deck.to(cards[3], { scale: 1, duration: 0.45, ease: 'none' }, 4);
    return () => {
      work.classList.remove('is-stack');
      cards.forEach((el) => (el.inert = false));
    };
  });

  gsap.utils.toArray<HTMLElement>('.section-heading h2,.about-copy h2,.tech h2,.more-block h2', root).forEach((el) =>
    gsap.from(el, { y: 35, clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } })
  );
  gsap.to('.contact-heading h2', { xPercent: -3, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'center center', scrub: 1 } });
  // The footer lives in the shared layout, outside the context scope.
  const footer = document.querySelector('.footer');
  if (footer) {
    gsap.from(footer.querySelector('.footer-word'), { yPercent: 40, scale: 0.85, ease: 'none', scrollTrigger: { trigger: footer, start: 'top bottom', end: 'bottom bottom', scrub: 1 } });
  }
}
