import { Chapter } from "@/components/ui/Chapter";
import { FadeIn } from "@/components/ui/FadeIn";
import { FigLabel } from "@/components/ui/FigLabel";
import { ScrubWords } from "@/components/ui/ScrubWords";
import { sections } from "@/content/copy";
import { letter, site } from "@/content/site";

export function Letter() {
  return (
    <Chapter
      id="letter"
      label={`${sections.letter.num} · ${sections.letter.label}`}
      align="left"
      pinned={false}
    >
      <FigLabel num={sections.letter.num} name={sections.letter.label} />
      <FadeIn>
        <p className="font-serif text-[clamp(2rem,4.8vw,3.8rem)] font-light leading-none">
          {site.name},
        </p>
      </FadeIn>

      <div className="mt-11 space-y-8">
        {letter.map((paragraph) => (
          <ScrubWords
            key={paragraph}
            text={paragraph}
            className="font-serif text-[clamp(1.15rem,1.9vw,1.6rem)] leading-[1.6]"
            start="top 88%"
            end="top 52%"
          />
        ))}
      </div>

      <FadeIn className="mt-12">
        <span className="mb-5 block h-px w-14 bg-rule" aria-hidden="true" />
        <p className="font-serif text-2xl serif-italic text-accent">{site.from}</p>
      </FadeIn>
    </Chapter>
  );
}
