"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/ready";

type Props = {
  /** Must match a stop in components/canvas/rail.ts. */
  id: string;
  /** Running-head text while this chapter is in view. */
  label: string;
  /** Which side the text sits on. The drawing is placed opposite. */
  align?: "left" | "right" | "center";
  /**
   * Pinned chapters hold one screen of text while the drawing moves behind
   * them, for `height` of scroll. Unpinned chapters flow normally.
   */
  pinned?: boolean;
  height?: string;
  /** "wide" gives card grids more room than a reading column. */
  width?: "text" | "wide";
  children: ReactNode;
};

const scrim = {
  left: "plate-scrim plate-scrim-left",
  right: "plate-scrim plate-scrim-right",
  center: "plate-scrim plate-scrim-center",
} as const;

const side = {
  left: "justify-start text-left [&>div]:items-start",
  right: "justify-end text-right [&>div]:items-end",
  center: "justify-center text-center [&>div]:items-center",
} as const;

/** Clears the running head and foot, and gives the text room to breathe. */
const pad = "px-[max(2.2rem,7vw)] pt-[clamp(6rem,14vh,9rem)] pb-[clamp(4.5rem,10vh,7rem)]";

/** One plate: the drawing reads its position to know what to show. */
export function Chapter({
  id,
  label,
  align = "left",
  pinned = true,
  height = "170vh",
  width = "text",
  children,
}: Props) {
  const inner = useRef<HTMLDivElement>(null);
  const column = `relative flex w-full flex-col ${
    width === "wide" ? "max-w-[62rem]" : "max-w-[34rem]"
  }`;

  // Every chapter cross-fades at its edges. A pinned one would otherwise sit
  // there while the next slid in over it; a flowing one would run straight
  // into its neighbour, leaving the tail of one plate on screen under the head
  // of the next.
  useGSAP(
    () => {
      const el = inner.current;
      if (!el || prefersReducedMotion()) return;

      const section = el.parentElement;
      if (!section) return;

      // A pinned chapter has a whole screen of approach to fade over. A
      // flowing one can be barely taller than the viewport, and a full screen
      // of fade at each end would leave it dim for most of its life, so it
      // gets a shorter crossing.
      const fade = pinned ? 1 : 0.55;

      // One writer for opacity: two scrubbed tweens would each latch their own
      // start value and fight, leaving the chapter stuck invisible. Derive it
      // from the trigger's own cached bounds instead — reading the DOM here
      // would force a layout on every scrolled frame.
      //
      // `start` is where the section's top meets the bottom of the screen and
      // `end` where its bottom meets the top.
      const apply = (self: ScrollTrigger) => {
        const span = window.innerHeight * fade;
        const at = self.scroll();
        const entering = gsap.utils.clamp(0, 1, (at - self.start) / span);
        const leaving = gsap.utils.clamp(0, 1, (self.end - at) / span);
        gsap.set(el, { opacity: Math.min(entering, leaving) });
      };

      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: apply,
        onRefresh: apply,
        onLeave: () => gsap.set(el, { opacity: 0 }),
        onLeaveBack: () => gsap.set(el, { opacity: 0 }),
      });
    },
    { scope: inner, dependencies: [pinned] },
  );

  const body = (flowing: boolean) => (
    <>
      <div
        className={`${scrim[align]} ${flowing ? "plate-scrim-flow" : ""}`}
        aria-hidden="true"
      />
      <div className="relative">{children}</div>
    </>
  );

  if (!pinned) {
    return (
      <section
        id={id}
        data-chapter={id}
        data-label={label}
        className={`relative flex min-h-svh items-center ${pad} ${side[align]}`}
      >
        <div ref={inner} className={column}>
          {body(true)}
        </div>
      </section>
    );
  }

  return (
    <section id={id} data-chapter={id} data-label={label} style={{ height }} className="relative">
      <div ref={inner} className={`sticky top-0 flex h-svh items-center ${pad} ${side[align]}`}>
        <div className={column}>{body(false)}</div>
      </div>
    </section>
  );
}
