"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { measureChapters, scroll, updateChapter } from "@/lib/scroll";

/**
 * Smooth (inertial) scrolling on the native page scroll, wired into GSAP:
 * Lenis is driven by the GSAP ticker so ScrollTrigger and the WebGL scene stay
 * in lockstep. Also tracks which chapter is centred. Renders nothing; mount it
 * once in the root layout.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    scroll.reduceMotion = reduceMotion;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: !reduceMotion });
    scroll.lenis = lenis;

    const syncChapter = () => {
      measureChapters();
      updateChapter(window.scrollY, window.innerHeight);
      // This runs on mount and on every refresh, which is how the scene learns
      // where it is after a reload part-way down the page. Lenis emits no
      // scroll event for that, so the canvas has to be woken here too.
      scroll.invalidate?.();
    };

    // Backstop for scrolling that never goes through Lenis: the browser
    // restoring a position after a reload, anchor jumps, find-in-page. Without
    // this the canvas is never asked for a frame and the drawing is missing
    // until something else moves.
    const onNativeScroll = () => {
      updateChapter(window.scrollY, window.innerHeight);
      scroll.invalidate?.();
    };
    window.addEventListener("scroll", onNativeScroll, { passive: true });

    let lastScroll = Number.NaN;
    lenis.on("scroll", () => {
      scroll.progress = lenis.progress;
      scroll.velocity = lenis.velocity;
      scroll.direction = lenis.direction;
      updateChapter(lenis.scroll, window.innerHeight);
      if (lenis.scroll !== lastScroll) {
        lastScroll = lenis.scroll;
        scroll.invalidate?.();
      }
      ScrollTrigger.update();
    });

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Chapter centres move whenever layout does (resize, fonts, content).
    syncChapter();
    ScrollTrigger.addEventListener("refresh", syncChapter);
    let lastHeight = document.body.scrollHeight;
    let pending = 0;
    const resize = new ResizeObserver(() => {
      if (document.body.scrollHeight === lastHeight) return;
      lastHeight = document.body.scrollHeight;
      window.clearTimeout(pending);
      pending = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    });
    resize.observe(document.body);
    document.fonts.ready.then(() => ScrollTrigger.refresh());

    return () => {
      window.removeEventListener("scroll", onNativeScroll);
      window.clearTimeout(pending);
      resize.disconnect();
      ScrollTrigger.removeEventListener("refresh", syncChapter);
      gsap.ticker.remove(tick);
      lenis.destroy();
      scroll.lenis = null;
    };
  }, []);

  return null;
}
