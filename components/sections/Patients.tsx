import { Chapter } from "@/components/ui/Chapter";
import { FigLabel } from "@/components/ui/FigLabel";
import { ScrubWords } from "@/components/ui/ScrubWords";
import { patients, sections } from "@/content/copy";

const line =
  "font-serif text-[clamp(1.5rem,3.2vw,2.8rem)] font-light leading-[1.2] tracking-[-0.01em]";

export function Patients() {
  return (
    <Chapter
      id="patients"
      label={`${sections.patients.num} · ${sections.patients.label}`}
      align="right"
      pinned={false}
    >
      <FigLabel num={sections.patients.num} name={sections.patients.label} />
      <div className="space-y-[16vh] pb-[6vh]">
        {patients.lines.map((text) => (
          <ScrubWords key={text} text={text} className={line} start="top 86%" end="top 48%" />
        ))}
        <ScrubWords
          text={patients.close}
          className={`${line} serif-italic text-accent`}
          start="top 86%"
          end="top 48%"
        />
      </div>
    </Chapter>
  );
}
