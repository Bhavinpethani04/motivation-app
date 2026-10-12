"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { scroll } from "@/lib/scroll";
import { LEVELS } from "@/lib/mix";

const TICKS = 24; // one per vertebra

/**
 * A measuring scale down the outer margin, like the one printed beside a
 * specimen. It fills from L5 to C1 as the plate is inked in.
 */
export function Ruler() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lit = -1;

    const tick = () => {
      const root = ref.current;
      const next = Math.round(scroll.progress * TICKS);
      if (!root || next === lit) return;

      lit = next;
      const marks = root.querySelectorAll("[data-tick]");
      marks.forEach((mark, i) => {
        // Rendered top-to-bottom (C1 first), so invert to count up the spine.
        mark.toggleAttribute("data-on", TICKS - 1 - i < next);
      });
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute right-[max(1.9rem,4.4vw)] top-1/2 hidden -translate-y-1/2 flex-col items-end gap-[6px] md:flex"
    >
      <span className="label label-sm mb-1 text-ink-45">{LEVELS[LEVELS.length - 1]}</span>
      {Array.from({ length: TICKS }, (_, i) => (
        <span
          key={i}
          data-tick
          className="block h-px w-2 bg-rule transition-all duration-500 data-[on]:w-5 data-[on]:bg-accent"
        />
      ))}
      <span className="label label-sm mt-1 text-ink-45">{LEVELS[0]}</span>
    </div>
  );
}
