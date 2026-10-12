"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/ready";

type Props = {
  text: string;
  className?: string;
  lang?: string;
  /** "self" scrubs while this element travels; "section" while its plate does. */
  scope?: "self" | "section";
  start?: string;
  end?: string;
};

/** Text whose words are inked in one by one as you scroll. */
export function ScrubWords({
  text,
  className,
  lang,
  scope = "self",
  start = "top 85%",
  end = "top 45%",
}: Props) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion()) return;

      gsap.to(el.querySelectorAll("[data-w]"), {
        opacity: 1,
        ease: "none",
        duration: 1,
        stagger: 0.15,
        scrollTrigger: {
          trigger: scope === "section" ? el.closest("section") : el,
          start,
          end,
          scrub: true,
        },
      });
    },
    // The dealt language changes the text, so the spans must be re-tweened.
    { scope: ref, dependencies: [text, scope, start, end], revertOnUpdate: true },
  );

  return (
    <p ref={ref} lang={lang} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i}>
          <span data-w>{word}</span>{" "}
        </span>
      ))}
    </p>
  );
}
