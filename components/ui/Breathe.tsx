"use client";

import { useEffect, useRef, useState } from "react";
import { scroll } from "@/lib/scroll";
import { breathe } from "@/content/copy";

const SECONDS = 4; // box breathing: 4-4-4-4

const smooth = (x: number) => x * x * (3 - 2 * x);

/** Box-breathing guide. It also widens the annotation ring on the plate. */
export function Breathe() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);
  const dial = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = dial.current;
    if (!running) {
      scroll.breath = 0;
      scroll.invalidate?.();
      el?.style.setProperty("--b", "0");
      return;
    }

    const start = performance.now();
    let frame = 0;
    let lastPhase = -1;

    const loop = (now: number) => {
      const elapsed = ((now - start) / 1000) % (SECONDS * 4);
      const index = Math.floor(elapsed / SECONDS);
      const p = (elapsed % SECONDS) / SECONDS;
      const b = index === 0 ? smooth(p) : index === 1 ? 1 : index === 2 ? 1 - smooth(p) : 0;

      scroll.breath = b;
      scroll.invalidate?.();
      el?.style.setProperty("--b", b.toFixed(3));
      if (count.current) {
        count.current.textContent = String(Math.ceil(SECONDS - (elapsed % SECONDS)));
      }
      if (index !== lastPhase) {
        lastPhase = index;
        setPhase(index);
      }
      frame = requestAnimationFrame(loop);
    };

    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      scroll.breath = 0;
    };
  }, [running]);

  return (
    <div className="flex flex-col items-start gap-10 sm:flex-row sm:items-center">
      <div
        ref={dial}
        style={{ ["--b" as string]: 0 }}
        className="relative grid size-48 shrink-0 place-items-center"
        role="img"
        aria-label={breathe.headline}
      >
        <span className="absolute inset-0 rounded-full border border-rule" />
        <span
          className="absolute inset-0 rounded-full border border-accent"
          style={{ transform: "scale(calc(0.42 + var(--b) * 0.58))" }}
        />
        <span
          className="absolute inset-0 rounded-full bg-accent-soft"
          style={{ transform: "scale(calc(0.42 + var(--b) * 0.58))" }}
        />
        <span ref={count} className="relative font-serif text-5xl font-light leading-none">
          {running ? "" : "·"}
        </span>
      </div>

      <div>
        <p className="font-serif text-2xl serif-italic" aria-live="polite">
          {running ? breathe.phases[phase] : breathe.ready}
        </p>
        <button
          type="button"
          onClick={() => setRunning((r) => !r)}
          className="label mt-6 border border-rule px-7 py-3 transition-colors hover:border-accent hover:text-accent"
        >
          {running ? breathe.stop : breathe.begin}
        </button>
      </div>
    </div>
  );
}
