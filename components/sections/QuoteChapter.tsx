"use client";

import { Chapter } from "@/components/ui/Chapter";
import { FadeIn } from "@/components/ui/FadeIn";
import { FigLabel } from "@/components/ui/FigLabel";
import { ScrubWords } from "@/components/ui/ScrubWords";
import { ui } from "@/content/copy";
import type { Plate, Script } from "@/types";

const scriptClass: Record<Script, string> = {
  latin: "",
  devanagari: "script-hi",
  gujarati: "script-gu",
};

const fig = (n: number) => `Fig. ${String(n).padStart(2, "0")}`;

/**
 * One quote, pinned to one vertebra. The language is dealt fresh on every
 * visit (lib/mix.ts), and a line first written in Sanskrit, Hindi or Gujarati
 * keeps its original above the translation.
 */
export function QuoteChapter({
  plate,
  align,
}: {
  plate: Plate;
  align: "left" | "right";
}) {
  const { quote, lang, script, level } = plate;
  const body = scriptClass[script];
  const original = quote.original;

  return (
    <Chapter
      id={`q${plate.fig}`}
      label={`${fig(plate.fig)} · ${level}`}
      align={align}
      height="180vh"
    >
      <FigLabel num={fig(plate.fig)} name={level} accent />

      {original && (
        <FadeIn>
          <p
            lang={original.script === "gujarati" ? "gu" : "hi"}
            className={`mb-7 text-[clamp(1rem,1.7vw,1.35rem)] text-accent ${
              original.script === "gujarati" ? "script-gu" : "script-hi"
            }`}
          >
            {original.text}
          </p>
        </FadeIn>
      )}

      <ScrubWords
        lang={lang}
        scope="section"
        start="top 32%"
        end="top -28%"
        text={script === "latin" ? `“${quote.text[lang]}”` : quote.text[lang]}
        className={`font-serif text-[clamp(1.65rem,3.5vw,3.1rem)] font-light leading-[1.18] tracking-[-0.01em] ${
          script === "latin" ? "serif-italic" : body
        }`}
      />

      <FadeIn className="mt-10 w-full">
        <span className="mb-5 block h-px w-14 bg-rule" aria-hidden="true" />
        <p lang={lang} className={`label text-ink ${body}`}>
          {quote.author[lang]}
          {quote.attributed && <span className="text-ink-45"> ({ui.attributed})</span>}
        </p>
        {quote.source && (
          <p lang={lang} className={`mt-2 text-xs leading-relaxed text-ink-45 ${body}`}>
            {quote.source[lang]}
          </p>
        )}
        <p
          lang={lang}
          className={`mt-7 max-w-md font-serif text-lg text-ink-70 ${
            script === "latin" ? "serif-italic" : body
          }`}
        >
          {quote.note[lang]}
        </p>
      </FadeIn>
    </Chapter>
  );
}
