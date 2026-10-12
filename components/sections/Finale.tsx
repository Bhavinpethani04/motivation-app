import { Chapter } from "@/components/ui/Chapter";
import { Countdown } from "@/components/ui/Countdown";
import { FadeIn } from "@/components/ui/FadeIn";
import { FigLabel } from "@/components/ui/FigLabel";
import { ReadAgain } from "@/components/ui/ReadAgain";
import { finale, sections } from "@/content/copy";
import { site } from "@/content/site";

export function Finale() {
  return (
    <Chapter
      id="finale"
      label={`${sections.finale.num} · ${sections.finale.label}`}
      align="left"
      height="160vh"
    >
      <FigLabel num={sections.finale.num} name={sections.finale.label} accent />
      <p className="label mb-6 text-accent">
        <Countdown />
      </p>
      <h2 className="font-serif text-[clamp(2.2rem,5.6vw,4.8rem)] font-light leading-[1.04] tracking-[-0.02em]">
        {finale.headline}
      </h2>
      <FadeIn className="mt-8">
        <p className="font-serif text-[clamp(1.2rem,2.2vw,1.8rem)] serif-italic">
          {finale.line.replace("{name}", site.name)}
        </p>
      </FadeIn>
      <FadeIn className="mt-12">
        <ReadAgain className="label border border-rule px-7 py-3 transition-colors hover:border-accent hover:text-accent" />
      </FadeIn>
      <span className="mt-16 block h-px w-full max-w-xs bg-rule" aria-hidden="true" />
      <p className="label mt-5 text-ink-45">
        {finale.colophon.replace("{name}", site.name)}
      </p>
    </Chapter>
  );
}
