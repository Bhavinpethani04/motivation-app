/**
 * The caption line above every block: a figure or section number on the left,
 * a rule across, and the specimen name on the right.
 */
export function FigLabel({
  num,
  name,
  accent = false,
}: {
  num: string;
  name: string;
  accent?: boolean;
}) {
  return (
    <div className="mb-8 flex w-full items-center gap-4">
      <span className={`label whitespace-nowrap ${accent ? "text-accent" : "text-ink-70"}`}>
        {num}
      </span>
      <span className="h-px min-w-6 flex-1 bg-rule" aria-hidden="true" />
      <span className="label label-sm whitespace-nowrap text-ink-45">{name}</span>
    </div>
  );
}
