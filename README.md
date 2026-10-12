# For Jahanvi

A scroll-driven 3D motivation site for Jahanvi, on the way to becoming a Registered Physiotherapist.

**Concept: "Rise."** The hero is a procedural 3D spine (24 vertebrae, L5 to C1). It starts slouched and dim under a night sky. Each quote is anchored to one vertebral level: as you scroll, the camera climbs, the spine straightens, a light climbs with it, and at the top it becomes the sunrise. The page flips from night to dawn.

The site speaks **English, Hindi and Gujarati**. A toggle in the header switches
everything; the choice is remembered. Quotes that began in Sanskrit, Hindi or
Gujarati keep their original line in its own script above the translation.

**Stack:** Next.js (App Router) · React · TypeScript · Tailwind CSS · three.js via React Three Fiber · GSAP + ScrollTrigger · Lenis

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The first load compiles shaders, so a loading cover shows briefly.

## Make it hers (edit content, not code)

| What | Where |
| ---- | ----- |
| **Exam date** (shows a live countdown in the finale) | `content/site.ts` → `examDate: "2026-12-05"` |
| **Her name**, tagline, and who the letter is from | `content/site.ts` → `site` |
| **The letter** | `content/site.ts` → `letter` |
| **Quotes** (text, original line, author, source, level, note) | `content/quotes.ts` |
| **"Need a boost?" pool** (quotes + short reminders) | `content/quotes.ts` → `reminders` |
| **Everything else you can read on the page** | `content/copy.ts` |

Every string is `{ en, hi, gu }`, so edits stay in step across the three
languages. `{name}` in a template is filled with her name in the active
language.

Two typographic rules the code already follows, worth keeping:

- **Keep her name in upright type.** Fraunces' italic "h" looks like "ñ", which
  turned "Jahanvi" into "Jañanvi". Use `display-italic` (not Tailwind's
  `italic`) for emphasis — it switches itself off for Devanagari and Gujarati,
  which have no true italic and would otherwise get an ugly synthetic slant.
- **Never split Indic text into per-character spans.** Devanagari and Gujarati
  letters are shaped together, so one span per character breaks conjuncts
  (जाह्नवी rendered as जाह्वा). The hero animates Latin letter by letter and the
  other scripts as a whole word. Wide `letter-spacing` causes the same damage,
  so `.eyebrow` and `.wordmark` reduce it for those scripts.

## How the scroll story works

```
Lenis (smooth scroll) ──► GSAP ticker ──► ScrollTrigger (word reveals, fades)
                              │
                              └──► lib/scroll.ts: fractional chapter index ──► scene rail ──► camera, spine, sky
```

- Every `<Chapter id="…">` is a section the scene tracks. `lib/scroll.ts` converts scroll position into a **fractional chapter index** (2.5 = halfway between chapter 2 and 3).
- `components/canvas/rail.ts` holds one **Stop** per chapter id (eight quote
  stops, `q1`–`q8`, climb L5 → C1): camera focus along the spine, posture (slouched to aligned), how much is lit, yaw, distance, horizontal placement, sky colour, bloom, and the light at the top. The scene eases between stops, holding each for a moment.
- **To add or retune a chapter:** add `<Chapter id="x" label="…">` to the page, then add a stop `x` in `rail.ts`. A chapter with no stop inherits the previous one.
- `shift` is **where the drawing's centre should sit across the plate**, -1
  (left edge) to 1 (right edge). Positive puts the specimen on the right, so
  put the text on the left.
- It is a request, not a position. `components/canvas/framing.ts` projects the
  curve each frame, finds the band of screen the drawing actually occupies, and
  solves for the offset that honours the request — pulling it back inside if it
  would cross the edge. This replaced a hand-tuned fraction of the viewport,
  which could not survive the rail: the column is rotated, curved and re-posed
  at every stop, so one value framed it well on one plate and pushed it clean
  off the paper on the next.
- The sky flips to a light "dawn" palette past `sky > 0.9`; text colours follow via `html[data-dawn="true"]` in `app/globals.css`.

## Performance

The canvas runs on `frameloop="demand"`: it draws only when something asks for
a frame. Idle, with the page just sitting there, it renders **nothing** — 0
frames and 0 spine rebuilds per second. Four invariants keep it that way, and
each is easy to break by accident:

- **`spinePoint` must stay a pure function of `u` and `posture`.** It used to
  take `time` for a subtle living ripple, which meant the pose changed every
  frame forever: ~150 trig calls, 94 matrix composes and 8 GPU buffer uploads
  per frame, for a wobble nobody could see. Anything clock-driven in here puts
  the whole loop back on permanently.
- **Damping has to snap.** `MathUtils.damp` only ever approaches its target, so
  without the explicit snap in `Scene.tsx` the scene keeps requesting frames
  long after the movement stops being visible. The tolerance scales with the
  value because `dist` and `fov` are far larger than the 0-1 parameters.
- **Anything that changes the picture must call `scroll.invalidate?.()`** —
  scrolling, the pointer, and the breathing ring all do. Miss one and the
  drawing freezes.
- **`Chapter` must not measure the DOM on scroll.** Its fade is derived from
  the ScrollTrigger's own cached `start`/`end`; a `getBoundingClientRect()` in
  that callback forces a layout on every scrolled frame.

Also deliberate: no post-processing or lighting rig (the shader does its own
flat shading), the grain overlay uses plain alpha rather than
`mix-blend-mode` (a fixed full-screen blend makes the compositor redo the whole
viewport), pixel density is capped at 1.5, and `ScrollTrigger.refresh()` is
debounced and only runs when the document actually changes height.

If the drawing ever looks dead while you are testing, check the browser pane or
tab is actually **visible** first — hidden tabs stop `requestAnimationFrame`,
so React Three Fiber never sizes or draws the canvas. That is not a bug.

## Project structure

```
app/
  layout.tsx             Fonts, loading cover, canvas, header
  page.tsx               Hero, calling, honest part, quotes, then the sections below
  globals.css            Palette (night / dawn), keyframes
  icon.svg               Tab icon
components/
  canvas/
    Experience.tsx       The fixed full-screen <Canvas>, error fallback, adaptive resolution
    Scene.tsx            Reads scroll, drives camera / spine / sky / bloom
    rail.ts              Per-chapter keyframes + sky palette
    spine/               curve.ts (S-curve vs slouch), geometry.ts (vertebra),
                         Spine.tsx, Orb.tsx (the sun), Particles.tsx
  providers/SmoothScroll.tsx   Lenis + chapter tracking
  sections/              QuoteChapter, Train, Patients, Letter, BreatheChapter, Finale
  ui/                    Chapter, Header, Hero, LanguageToggle, ScrubWords, Boost, …
content/                 site.ts (hers), quotes.ts, copy.ts (all other strings)
lib/                     gsap.ts (plugins registered once), scroll.ts, ready.ts,
                         lang.tsx (language store + useT)
types/                   Shared types
```

Imports from the project root use the `@/` alias.

## Conventions

- Import GSAP from `@/lib/gsap`, never from `"gsap"`, so plugins are always registered.
- Per-frame scroll values live in `lib/scroll.ts`, not React state. Read them in `useFrame` or GSAP callbacks.
- Don't hide GSAP-animated elements with a CSS `transform`; GSAP reads it as pixels. Hide with `opacity` (see `[data-hero-letter]`).
- Mutate three.js objects through refs in `useFrame` (the React compiler lint rejects mutating `useState` values).
- Read copy with `const t = useT()`, then `t(someLocalizedValue)`. It works for strings and for string arrays.
- Give one property one animator. Two scrubbed GSAP tweens on the same property each latch their own start value and fight; `Chapter`'s fade measures the section and writes opacity once.
- Respects `prefers-reduced-motion`: smooth scroll, parallax and scroll-linked reveals are reduced or disabled.

## Research and attributions

Quotes were checked against primary or well-documented sources. Where no primary source could be found, the site says "attributed".

- Will Durant, *The Story of Philosophy* (1926): summarising Aristotle; often misattributed to Aristotle directly.
- Sohanlal Dwivedi, "कोशिश करने वालों की हार नहीं होती": very widely misattributed to Harivansh Rai Bachchan, partly because Amitabh Bachchan has recited it.
- "उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः": a traditional subhashita, usually cited to the Hitopadesha, though some sources give the *Subhashitaratnakara*; no verse number confirmed, so the site says "traditional".
- "હિંમતે મર્દા તો મદદે ખુદા": a Gujarati folk saying (કહેવત) with no single author.
- Martin Luther King Jr., address at Spelman College, 10 April 1960 ("Keep Moving from This Mountain").
- Oliver Goldsmith, *The Citizen of the World*, Letter VII (1760): often misattributed to Confucius or Mandela.
- Nelson Mandela, *Long Walk to Freedom*.
- Maya Angelou, interviews (1970 *Los Angeles Times*; 1979; *Conversations with Maya Angelou*, 1989): attributed, wording varies.
- Swami Vivekananda, after *Katha Upanishad* 1.3.14.
- Sister Elizabeth Kenny: attributed; no primary source found.

Study-science cards:

- Roediger & Karpicke (2006), retrieval practice, *Psychological Science*.
- Cepeda et al. (2006), distributed practice meta-analysis, *Psychological Bulletin*.
- Diekelmann & Born (2010), "The memory function of sleep", *Nature Reviews Neuroscience* 11.
- Brooks (2014), "Get excited: Reappraising pre-performance anxiety as excitement", *Journal of Experimental Psychology: General* 143(3).

Profession history: Mary McMillan, first Reconstruction Aide (1918) and first president of the American Women's Physical Therapeutic Association (1921).

## Running it on your phone

`next dev` picks the next free port if 3000 is taken, so check the terminal for
the actual one. `next.config.ts` allows `192.168.68.*` through
`allowedDevOrigins`; without that, Next blocks another device's JavaScript
requests with a 403 and the page never starts. Your Mac's IP can change, so
confirm it with `ipconfig getifaddr en0`.

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start the dev server       |
| `npm run build` | Create a production build  |
| `npm run start` | Serve the production build |
| `npm run lint`  | Run ESLint                 |
