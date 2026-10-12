"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { onReady, prefersReducedMotion } from "@/lib/ready";
import { hero, plate } from "@/content/copy";
import { site } from "@/content/site";

/** The title plate. */
export function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      return onReady(() => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to("[data-draw]", { scaleX: 1, duration: 1.1, stagger: 0.12 })
          .to("[data-fade]", { opacity: 1, y: 0, duration: 1, stagger: 0.14 }, "-=0.8");
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      <span data-draw className="mb-8 block h-px w-24 bg-accent" aria-hidden="true" />

      <p data-fade className="label text-ink-45">
        {hero.eyebrow}
      </p>

      <h1
        data-fade
        className="mt-5 font-serif text-[clamp(3rem,10vw,8.5rem)] font-light leading-[0.94] tracking-[-0.025em]"
      >
        {site.name}
      </h1>

      <p data-fade className="mt-3 flex items-baseline gap-4 text-ink-45">
        <span lang="gu" className="script-gu text-xl">
          {site.nameGu}
        </span>
        <span lang="hi" className="script-hi text-xl">
          {site.nameHi}
        </span>
      </p>

      <span data-draw className="mt-9 block h-px w-full max-w-sm bg-rule" aria-hidden="true" />

      <p data-fade className="mt-6 font-serif text-[clamp(1.1rem,2vw,1.5rem)] serif-italic">
        {hero.role}
      </p>
      <p data-fade className="label mt-4 text-ink-45">
        {plate.subtitle}
      </p>

      <p data-fade className="label mt-[9vh] flex items-center gap-3 text-ink-45">
        <span className="inline-block h-6 w-px bg-accent" aria-hidden="true" />
        {hero.cue}
      </p>
    </div>
  );
}
