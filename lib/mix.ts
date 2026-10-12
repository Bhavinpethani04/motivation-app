import { useSyncExternalStore } from "react";
import { quotes } from "@/content/quotes";
import { LANGS, SCRIPT_OF, type Lang, type Plate } from "@/types";

/**
 * The eight vertebrae the plate climbs, lumbar to skull base. These stay in
 * ascending order whatever the quotes do: the camera and the spine depend on
 * it, and an atlas that counted backwards would be wrong.
 */
export const LEVELS = ["L5", "L3", "T12", "T8", "T4", "T1", "C4", "C1"];

/**
 * A quote that was first written in Hindi or Gujarati is never shown in that
 * same language, because its original line is already printed above the
 * translation and the page would just say the same thing twice.
 */
function allowedLangs(index: number): Lang[] {
  const own = quotes[index].original?.lang;
  return own ? LANGS.filter((lang) => lang !== own) : LANGS;
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Deals the quotes onto the plates: a fresh order every visit, and a spread of
 * languages rather than a run of one. Takes a random source so the result can
 * be made deterministic in a test.
 */
export function deal(random: () => number = Math.random): Plate[] {
  const order = shuffle(
    quotes.map((_, index) => index),
    random,
  );

  // Hand out languages round-robin from a shuffled cycle, so all three always
  // appear and no language clumps at one end of the page.
  const cycle = shuffle(LANGS, random);
  let cursor = 0;

  return order.map((quoteIndex, slot) => {
    const allowed = allowedLangs(quoteIndex);
    let lang = cycle[cursor % cycle.length];
    // Skip forward if this quote cannot take the next language in the cycle.
    for (let step = 0; step < cycle.length && !allowed.includes(lang); step++) {
      lang = cycle[(cursor + step + 1) % cycle.length];
    }
    cursor++;

    return {
      quote: quotes[quoteIndex],
      lang,
      script: SCRIPT_OF[lang],
      level: LEVELS[slot],
      fig: slot + 1,
    };
  });
}

/**
 * The deal lives outside React: it is random, so the server cannot know it,
 * and `useSyncExternalStore` is the supported way to render one thing during
 * hydration and another once the client takes over.
 */
let dealt: Plate[] | null = null;

/** English, in order — what the server and the first paint render. */
const ordered: Plate[] = quotes.map((quote, slot) => ({
  quote,
  lang: "en",
  script: "latin",
  level: LEVELS[slot],
  fig: slot + 1,
}));

const subscribe = () => () => {};

function getSnapshot(): Plate[] {
  if (dealt === null) dealt = deal();
  return dealt;
}

function getServerSnapshot(): Plate[] {
  return ordered;
}

/** The quotes as laid out for this visit. */
export function usePlates(): Plate[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
