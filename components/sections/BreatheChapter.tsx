import { Breathe } from "@/components/ui/Breathe";
import { Chapter } from "@/components/ui/Chapter";
import { FadeIn } from "@/components/ui/FadeIn";
import { FigLabel } from "@/components/ui/FigLabel";
import { breathe, sections } from "@/content/copy";

export function BreatheChapter() {
  return (
    <Chapter
      id="breathe"
      label={`${sections.breathe.num} · ${sections.breathe.label}`}
      align="right"
      pinned={false}
    >
      <FigLabel num={sections.breathe.num} name={sections.breathe.label} />
      <h2 className="font-serif text-[clamp(1.9rem,4.4vw,3.6rem)] font-light leading-[1.08] tracking-[-0.015em]">
        {breathe.headline}
      </h2>
      <FadeIn className="mt-6">
        <p className="max-w-xl text-[0.98rem] leading-relaxed text-ink-70">{breathe.body}</p>
      </FadeIn>
      <FadeIn className="mt-12">
        <Breathe />
      </FadeIn>
      <FadeIn className="mt-14">
        <p className="font-serif text-3xl serif-italic">{breathe.affirmation}</p>
        <p className="label mt-3 text-ink-45">{breathe.sayIt}</p>
      </FadeIn>
    </Chapter>
  );
}
