import { plate } from "@/content/copy";

/** Loading cover. Fades out once the plate has drawn its first frames. */
export function Intro() {
  return (
    <div
      className="intro fixed inset-0 z-[60] grid place-items-center bg-paper"
      aria-hidden="true"
    >
      <div className="text-center">
        <p className="label text-ink-45">{plate.title}</p>
        <span className="mx-auto mt-5 block h-px w-28 animate-[plate-line_2.2s_ease-in-out_infinite] bg-accent" />
      </div>
    </div>
  );
}
