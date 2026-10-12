"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { scroll } from "@/lib/scroll";

/** The running head: which plate you are looking at. Swaps with a short fade. */
export function ChapterLabel({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let current = -1;

    const tick = () => {
      const el = ref.current;
      const index = Math.round(scroll.chapter);
      if (!el || index === current || scroll.labels.length === 0) return;

      current = index;
      gsap.killTweensOf(el);
      gsap
        .timeline()
        .to(el, { opacity: 0, duration: 0.16, ease: "power1.in" })
        .add(() => {
          el.textContent = scroll.labels[index] ?? "";
        })
        .to(el, { opacity: 1, duration: 0.36, ease: "power2.out" });
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return <span ref={ref} className={className} aria-hidden="true" />;
}
