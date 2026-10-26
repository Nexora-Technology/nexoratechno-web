import type Lenis from 'lenis';

/** Shared, non-React state between the scroll choreography and the WebGL scene
 *  (both run outside React's render cycle, on the GSAP ticker). */
export const choreography = {
  reduced: false,
  stageActive: false,
  stageProgress: 0,
  lenis: null as Lenis | null,
  refresh: null as (() => void) | null,
};

/** Re-measure pinned scenes after content above them changes height. */
export function requestScrollRefresh() {
  choreography.refresh?.();
}
