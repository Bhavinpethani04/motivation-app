import type Lenis from "lenis";

/**
 * Shared scroll state, written by <SmoothScroll /> and read anywhere.
 *
 * This is a plain mutable object on purpose: scroll changes every frame, so
 * keeping it out of React state avoids re-renders. Read it inside `useFrame`
 * or GSAP callbacks, not during render.
 */
export const scroll = {
  /** The Lenis instance (null until <SmoothScroll /> mounts). Use for scrollTo/stop/start. */
  lenis: null as Lenis | null,
  /** Page scroll progress, 0 to 1. */
  progress: 0,
  /** Scroll velocity in px per frame (signed). */
  velocity: 0,
  /** Last scroll direction. */
  direction: 0 as -1 | 0 | 1,

  /**
   * Fractional chapter index. 2.0 means chapter 2 is centred in the viewport;
   * 2.5 is halfway to chapter 3. Chapters are the `[data-chapter]` elements.
   */
  chapter: 0,
  ids: [] as string[],
  labels: [] as string[],
  /** Document-space Y of each chapter's centre. */
  centers: [] as number[],

  /** Breathing exercise phase, 0 (empty) to 1 (full). Drives the annotation ring. */
  breath: 0,
  reduceMotion: false,

  /**
   * Asks the canvas for another frame. The scene runs on demand, so anything
   * that changes what it should look like has to call this. Set by the Scene.
   */
  invalidate: null as (() => void) | null,
};

/** Re-read chapter positions from the DOM. Call after layout changes. */
export function measureChapters() {
  const els = Array.from(
    document.querySelectorAll<HTMLElement>("[data-chapter]"),
  );
  const y = window.scrollY;
  scroll.ids = els.map((el) => el.dataset.chapter ?? "");
  scroll.labels = els.map((el) => el.dataset.label ?? "");
  scroll.centers = els.map((el) => {
    const rect = el.getBoundingClientRect();
    return rect.top + y + rect.height / 2;
  });
}

/** Convert a scroll position into the fractional chapter index. */
export function updateChapter(scrollY: number, viewportHeight: number) {
  const { centers } = scroll;
  if (centers.length === 0) return;

  const mid = scrollY + viewportHeight / 2;
  const last = centers.length - 1;

  if (mid <= centers[0]) {
    scroll.chapter = 0;
    return;
  }
  if (mid >= centers[last]) {
    scroll.chapter = last;
    return;
  }

  let i = 0;
  while (i < last && centers[i + 1] <= mid) i++;
  scroll.chapter = i + (mid - centers[i]) / (centers[i + 1] - centers[i]);
}
