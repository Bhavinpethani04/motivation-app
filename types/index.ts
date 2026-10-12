/** The three languages the quotes are drawn from. */
export type Lang = "en" | "hi" | "gu";

export const LANGS: Lang[] = ["en", "hi", "gu"];

/** A string in every language. */
export type Localized = Record<Lang, string>;

/** Script of a line, so it can be set in type drawn for it. */
export type Script = "latin" | "devanagari" | "gujarati";

export const SCRIPT_OF: Record<Lang, Script> = {
  en: "latin",
  hi: "devanagari",
  gu: "gujarati",
};

export type Quote = {
  id: string;
  /** Short theme word, printed beside the figure number. */
  title: Localized;
  /** The quote, in each language. One is chosen per visit. */
  text: Localized;
  /**
   * The line as it was first written, when that was not English. Printed in
   * its own script above the translation, so the root is never lost.
   */
  original?: { text: string; script: Script; lang?: Lang };
  author: Localized;
  source?: Localized;
  /** True when the attribution is traditional but no primary source was found. */
  attributed?: boolean;
  /** One line connecting the quote to the exam. */
  note: Localized;
};

/** A quote as placed on the page: which vertebra, which language, which figure. */
export type Plate = {
  quote: Quote;
  lang: Lang;
  script: Script;
  /** Vertebral level, ascending up the page. */
  level: string;
  /** Figure number, 1-based. */
  fig: number;
};
