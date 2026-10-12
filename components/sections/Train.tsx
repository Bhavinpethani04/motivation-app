import { Chapter } from "@/components/ui/Chapter";
import { FadeIn } from "@/components/ui/FadeIn";
import { FigLabel } from "@/components/ui/FigLabel";
import { sections, train } from "@/content/copy";

export function Train() {
  return (
    <Chapter
      id="train"
      label={`${sections.train.num} · ${sections.train.label}`}
      align="left"
      pinned={false}
      width="wide"
    >
      <FigLabel num={sections.train.num} name={sections.train.label} />
      <h2 className="max-w-3xl font-serif text-[clamp(1.8rem,4vw,3.4rem)] font-light leading-[1.1] tracking-[-0.015em]">
        {train.headline}
      </h2>

      <div className="mt-14 grid gap-px border border-rule bg-rule sm:grid-cols-2">
        {train.exercises.map((exercise, i) => (
          <FadeIn key={exercise.name} delay={i * 0.06}>
            <article className="h-full bg-paper p-7">
              <div className="label flex items-baseline justify-between gap-4 text-ink-45">
                <span>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-accent">{exercise.dose}</span>
              </div>
              <h3 className="mt-5 font-serif text-2xl">{exercise.name}</h3>
              <p className="mt-3 text-[0.95rem] leading-relaxed">{exercise.cue}</p>
              <p className="mt-5 border-t border-rule-soft pt-5 text-xs leading-relaxed text-ink-45">
                {exercise.evidence}
              </p>
            </article>
          </FadeIn>
        ))}
      </div>
    </Chapter>
  );
}
