"use client";

import { Boost } from "./Boost";
import { ChapterLabel } from "./ChapterLabel";
import { Ruler } from "./Ruler";
import { scroll } from "@/lib/scroll";
import { plate, ui } from "@/content/copy";
import { site } from "@/content/site";

const Cross = ({ className }: { className: string }) => (
  <span className={`absolute ${className}`} aria-hidden="true">
    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-rule" />
    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-rule" />
  </span>
);

/**
 * The printed furniture of the plate: a hairline border, registration crosses
 * at the corners, and running heads. Fixed over the drawing.
 */
export function PlateFrame() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <div className="absolute inset-[14px] border border-rule-soft sm:inset-[22px]">
        <Cross className="-left-[7px] -top-[7px] size-3.5" />
        <Cross className="-right-[7px] -top-[7px] size-3.5" />
        <Cross className="-bottom-[7px] -left-[7px] size-3.5" />
        <Cross className="-bottom-[7px] -right-[7px] size-3.5" />
      </div>

      {/* Running head */}
      <div className="absolute inset-x-0 top-0 flex items-start justify-between px-[max(2.2rem,5vw)] pt-7">
        <button
          type="button"
          onClick={() => scroll.lenis?.scrollTo(0, { duration: 2.4 })}
          aria-label={ui.backToTop}
          className="pointer-events-auto label text-ink transition-colors hover:text-accent"
        >
          {site.name}
        </button>
        <ChapterLabel className="label label-sm text-ink-45" />
      </div>

      {/* Running foot */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-[max(2.2rem,5vw)] pb-7">
        <p className="label label-sm hidden text-ink-45 sm:block">{plate.edition}</p>
        <div className="pointer-events-auto ml-auto">
          <Boost />
        </div>
      </div>

      <Ruler />
    </div>
  );
}
