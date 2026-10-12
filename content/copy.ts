/**
 * Page copy. The quotes carry the three languages (see content/quotes.ts);
 * everything around them is set in English so the plate reads cleanly.
 */

export const plate = {
  title: "The Vertebral Column",
  subtitle: "A field guide for the days before the exam",
  edition: "Plate I · Twenty-four bones, bottom to top",
};

export const hero = {
  eyebrow: "Prepared for",
  role: "Future Registered Physiotherapist",
  cue: "Scroll to begin the climb",
};

export const sections = {
  hero: { num: "", label: "Title plate" },
  calling: { num: "I", label: "Why this work" },
  weight: { num: "II", label: "The honest part" },
  train: { num: "III", label: "Method" },
  patients: { num: "IV", label: "Indications" },
  letter: { num: "V", label: "Note from the author" },
  breathe: { num: "VI", label: "Before examination" },
  finale: { num: "VII", label: "Conclusion" },
};

export const calling = {
  headline: "You chose the work of giving people their movement back.",
  body: "A hip that hurts a little less. A first step after months in bed. A shoulder that finally lifts a child. That is what waits on the other side of this exam.",
  footnote:
    "The profession you are joining grew from people like Mary McMillan, who in 1918 became the first Reconstruction Aide, helping wounded soldiers walk again.",
};

export const weight = {
  headline: "Some nights, it will feel like too much.",
  body: "The material is huge. The clock is loud. The doubt will say you are behind. That feeling is not a sign you are failing. It is the weight of something that matters. Muscle grows under load. So do you.",
};

export const train = {
  headline: "Prepare the way you'd prescribe it: progressive, consistent, and with rest.",
  exercises: [
    {
      name: "Active recall",
      dose: "3 sets, every session",
      cue: "Close the book. Write down what you remember, then check.",
      evidence:
        "Roediger & Karpicke (2006): a week later, students who practised retrieval remembered 61% of the material; those who re-read remembered 40%.",
    },
    {
      name: "Spaced repetition",
      dose: "Little and often",
      cue: "Review it, leave it, come back to it. Don't cram it into one night.",
      evidence:
        "Cepeda et al. (2006): across 317 experiments, spreading study over time beat massing it into one block.",
    },
    {
      name: "Sleep",
      dose: "Non-negotiable",
      cue: "Protect the night before. It is when the day's learning is filed away.",
      evidence:
        "Diekelmann & Born (2010): sleep consolidates newly learned information into long-term memory.",
    },
    {
      name: "Reframe the nerves",
      dose: "Out loud, at the door",
      cue: "Don't tell yourself to calm down. Tell yourself you are excited.",
      evidence:
        "Brooks (2014): people who reappraised anxiety as excitement performed better than those who tried to calm down.",
    },
  ],
};

export const patients = {
  lines: [
    "Somewhere, a runner is afraid they will never run again.",
    "Somewhere, a grandmother just wants to reach her garden.",
    "Somewhere, a child is about to take a first step with a little help.",
    "Somewhere, someone is waiting for exactly the physio you are becoming.",
  ],
  close: "Hold that picture when the notes blur.",
};

export const breathe = {
  headline: "Breathe. Then get excited.",
  body: "In, hold, out, hold: four counts each. Nerves and excitement feel almost the same in the body, so give them the better name.",
  phases: ["Breathe in", "Hold", "Breathe out", "Hold"],
  ready: "Ready when you are",
  begin: "Begin",
  stop: "Stop",
  affirmation: "I am excited.",
  sayIt: "Say it out loud. Twice.",
};

export const finale = {
  headline: "Walk in like you already belong there.",
  line: "{name}, Registered Physiotherapist. Say it like it's already true.",
  readAgain: "Read it again",
  colophon: "Drawn with love, for {name}",
};

export const ui = {
  boost: "Need a boost?",
  boostTitle: "A boost for you",
  another: "Another",
  close: "Close",
  examDay: "Exam day",
  today: "Today. You've got this.",
  tomorrow: "Tomorrow",
  daysToGo: "{n} days to go",
  attributed: "attributed",
  backToTop: "Back to the top",
};
