"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { quotes, reminders } from "@/content/quotes";
import { ui } from "@/content/copy";
import { scroll } from "@/lib/scroll";
import { LANGS, SCRIPT_OF, type Lang, type Script } from "@/types";

type Draw = { text: string; author?: string; script: Script; lang: Lang };

const scriptClass: Record<Script, string> = {
  latin: "",
  devanagari: "script-hi",
  gujarati: "script-gu",
};

/** One random line, in one random language. */
function drawOne(previous?: string): Draw {
  for (let attempt = 0; attempt < 12; attempt++) {
    const lang = LANGS[Math.floor(Math.random() * LANGS.length)];
    const pool = reminders[lang];
    const useQuote = Math.random() < quotes.length / (quotes.length + pool.length);

    const picked: Draw = useQuote
      ? (() => {
          const quote = quotes[Math.floor(Math.random() * quotes.length)];
          return {
            text: quote.text[lang],
            author: quote.attributed
              ? `${quote.author[lang]} (${ui.attributed})`
              : quote.author[lang],
            script: SCRIPT_OF[lang],
            lang,
          };
        })()
      : {
          text: pool[Math.floor(Math.random() * pool.length)],
          script: SCRIPT_OF[lang],
          lang,
        };

    if (picked.text !== previous) return picked;
  }
  return { text: reminders.en[0], script: "latin", lang: "en" };
}

/**
 * "Need a boost?" opens a detail card with one random line, in one random
 * language — the same mix the plate itself uses.
 */
export function Boost() {
  const [open, setOpen] = useState(false);
  const [draw, setDraw] = useState<Draw | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  const next = useCallback(() => setDraw((current) => drawOne(current?.text)), []);

  useEffect(() => {
    if (!open) return;
    const opener = openerRef.current;
    scroll.lenis?.stop();
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      scroll.lenis?.start();
      opener?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        onClick={() => {
          next();
          setOpen(true);
        }}
        aria-haspopup="dialog"
        className="label flex items-center gap-2 border border-rule px-4 py-2.5 text-ink transition-colors hover:border-accent hover:text-accent"
      >
        <span aria-hidden="true" className="text-accent">
          +
        </span>
        <span className="hidden sm:inline">{ui.boost}</span>
      </button>

      {open && draw && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ui.boostTitle}
          className="fixed inset-0 z-[70] flex animate-[fade_0.35s_ease] items-center justify-center bg-paper/95 px-[8vw] backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="pointer-events-none absolute inset-[14px] border border-rule-soft sm:inset-[22px]" />

          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            className="label absolute right-[max(2.2rem,5vw)] top-7 text-ink-45 transition-colors hover:text-accent"
          >
            {ui.close} ✕
          </button>

          <figure
            key={draw.text}
            className="max-w-3xl animate-[rise_0.6s_cubic-bezier(0.16,1,0.3,1)] text-center"
          >
            <span className="mx-auto mb-10 block h-px w-16 bg-accent" aria-hidden="true" />
            <blockquote
              lang={draw.lang}
              className={`font-serif text-[clamp(1.5rem,3.8vw,2.9rem)] font-light leading-[1.26] ${
                draw.script === "latin" ? "serif-italic" : scriptClass[draw.script]
              }`}
            >
              {draw.text}
            </blockquote>
            {draw.author && (
              <figcaption
                lang={draw.lang}
                className={`label mt-9 text-ink-45 ${scriptClass[draw.script]}`}
              >
                {draw.author}
              </figcaption>
            )}
            <button
              type="button"
              onClick={next}
              className="label mt-12 border border-rule px-7 py-3 transition-colors hover:border-accent hover:text-accent"
            >
              {ui.another} →
            </button>
          </figure>
        </div>
      )}
    </>
  );
}
