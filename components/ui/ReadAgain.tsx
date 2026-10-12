"use client";

import { scroll } from "@/lib/scroll";
import { finale } from "@/content/copy";

export function ReadAgain({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => scroll.lenis?.scrollTo(0, { duration: 3.2 })}
      className={className}
    >
      {finale.readAgain} ↑
    </button>
  );
}
