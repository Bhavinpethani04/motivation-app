"use client";

import { BreatheChapter } from "@/components/sections/BreatheChapter";
import { Finale } from "@/components/sections/Finale";
import { Letter } from "@/components/sections/Letter";
import { Patients } from "@/components/sections/Patients";
import { QuoteChapter } from "@/components/sections/QuoteChapter";
import { Train } from "@/components/sections/Train";
import { Chapter } from "@/components/ui/Chapter";
import { FadeIn } from "@/components/ui/FadeIn";
import { FigLabel } from "@/components/ui/FigLabel";
import { Hero } from "@/components/ui/Hero";
import { ScrubWords } from "@/components/ui/ScrubWords";
import { usePlates } from "@/lib/mix";
import { calling, sections, weight } from "@/content/copy";

const headline =
  "font-serif text-[clamp(1.8rem,4vw,3.5rem)] font-light leading-[1.1] tracking-[-0.015em]";

export default function Home() {
  const plates = usePlates();

  return (
    <main className="relative z-10">
      <Chapter id="hero" label={sections.hero.label} align="left" height="130vh">
        <Hero />
      </Chapter>

      <Chapter
        id="calling"
        label={`${sections.calling.num} · ${sections.calling.label}`}
        align="right"
        height="175vh"
      >
        <FigLabel num={sections.calling.num} name={sections.calling.label} />
        <ScrubWords
          scope="section"
          start="top 38%"
          end="top -22%"
          text={calling.headline}
          className={headline}
        />
        <FadeIn className="mt-9">
          <p className="max-w-lg text-[1.02rem] leading-relaxed text-ink-70">{calling.body}</p>
          <p className="mt-6 max-w-lg border-t border-rule-soft pt-5 text-xs leading-relaxed text-ink-45">
            {calling.footnote}
          </p>
        </FadeIn>
      </Chapter>

      <Chapter
        id="weight"
        label={`${sections.weight.num} · ${sections.weight.label}`}
        align="left"
        height="175vh"
      >
        <FigLabel num={sections.weight.num} name={sections.weight.label} />
        <ScrubWords
          scope="section"
          start="top 38%"
          end="top -22%"
          text={weight.headline}
          className={headline}
        />
        <FadeIn className="mt-9">
          <p className="max-w-lg text-[1.02rem] leading-relaxed text-ink-70">{weight.body}</p>
        </FadeIn>
      </Chapter>

      {plates.map((plate, i) => (
        <QuoteChapter
          key={plate.quote.id}
          plate={plate}
          align={i % 2 === 0 ? "right" : "left"}
        />
      ))}

      <Train />
      <Patients />
      <Letter />
      <BreatheChapter />
      <Finale />
    </main>
  );
}
