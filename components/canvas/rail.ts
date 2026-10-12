import { MathUtils } from "three";

/**
 * The plate rail: one keyframe (Stop) per chapter. The camera, the posture of
 * the specimen and how much of it has been inked in are interpolated between
 * the stops either side of the viewer.
 *
 * The arc is a drawing being finished: the column starts as a faint pencil
 * ghost, slouched, and is inked in from L5 upward until the plate is complete.
 *
 * Add a chapter to the page with `data-chapter="id"`, then give it a stop here.
 * A chapter with no stop inherits the previous one.
 */
export type Stop = {
  /** Where the camera looks along the column, 0 (sacrum) to 1 (skull base). */
  focus: number;
  /** 0 = slouched and compressed, 1 = tall and aligned. */
  posture: number;
  /** How far up the column has been inked in, 0 to 1. */
  ink: number;
  /** Column rotation around the vertical axis (radians). */
  yaw: number;
  /** Camera distance. */
  dist: number;
  /**
   * Where the drawing's centre should sit across the plate, -1 (left edge) to
   * 1 (right edge). The framing solver honours this as far as the margin
   * allows, so the specimen can never be pushed off the paper.
   */
  shift: number;
  fov: number;
  /** The oxblood annotation ring at the skull base, 0 to 1. */
  mark: number;
  /** Roll of the column (radians). */
  tilt: number;
};

export const KEYS = [
  "focus",
  "posture",
  "ink",
  "yaw",
  "dist",
  "shift",
  "fov",
  "mark",
  "tilt",
] as const satisfies readonly (keyof Stop)[];

const BASE: Stop = {
  focus: 0.5,
  posture: 0.5,
  ink: 0,
  yaw: 0,
  dist: 9,
  shift: 0,
  fov: 34,
  mark: 0,
  tilt: 0,
};

const stop = (o: Partial<Stop>): Stop => ({ ...BASE, ...o });

export const stops: Record<string, Stop> = {
  // Title plate: the whole specimen, faint, waiting to be drawn.
  hero: stop({ focus: 0.52, posture: 0.18, ink: 0.12, yaw: -0.5, dist: 15, shift: 0.5 }),
  calling: stop({ focus: 0.42, posture: 0.34, ink: 0.14, yaw: 0.45, dist: 11, shift: -0.55, tilt: -0.04 }),
  weight: stop({ focus: 0.56, posture: 0.06, ink: 0.12, yaw: -1.2, dist: 9.5, shift: 0.55, tilt: 0.07 }),

  // The climb: one figure per vertebral level, straightening and inking in.
  q1: stop({ focus: 0.08, posture: 0.42, ink: 0.17, yaw: 0.55, dist: 9.2, shift: -0.58 }),
  q2: stop({ focus: 0.2, posture: 0.52, ink: 0.28, yaw: -0.65, dist: 9.2, shift: 0.58 }),
  q3: stop({ focus: 0.33, posture: 0.62, ink: 0.4, yaw: 0.75, dist: 9.2, shift: -0.58 }),
  q4: stop({ focus: 0.46, posture: 0.71, ink: 0.52, yaw: -0.55, dist: 9.2, shift: 0.58 }),
  q5: stop({ focus: 0.59, posture: 0.8, ink: 0.64, yaw: 0.85, dist: 9.2, shift: -0.58 }),
  q6: stop({ focus: 0.72, posture: 0.88, ink: 0.76, yaw: -0.5, dist: 9.2, shift: 0.58 }),
  q7: stop({ focus: 0.85, posture: 0.94, ink: 0.89, yaw: 0.65, dist: 9.2, shift: -0.58, mark: 0.2 }),
  q8: stop({ focus: 0.97, posture: 1, ink: 1, yaw: -0.4, dist: 9.2, shift: 0.58, mark: 0.5 }),

  // Step back: the finished column.
  train: stop({ focus: 0.58, posture: 1, ink: 1, yaw: 0.9, dist: 16.5, shift: 0.72, mark: 0.4 }),
  patients: stop({ focus: 0.58, posture: 1, ink: 1, yaw: -0.9, dist: 15.5, shift: -0.72, mark: 0.45 }),
  letter: stop({ focus: 0.58, posture: 1, ink: 1, yaw: 0.25, dist: 17, shift: 0.72, mark: 0.5 }),
  breathe: stop({ focus: 0.78, posture: 1, ink: 1, yaw: 0, dist: 11, shift: -0.55, mark: 0.7 }),

  // The finished plate.
  finale: stop({ focus: 0.62, posture: 1, ink: 1, yaw: -0.4, dist: 13, shift: 0.45, fov: 36, mark: 1 }),
};

/** Hold each stop for a moment, then glide to the next. */
const plateau = (f: number) => {
  const t = MathUtils.clamp((f - 0.18) / 0.64, 0, 1);
  return t * t * (3 - 2 * t);
};

/** Interpolated target for a fractional chapter index. */
export function sampleRail(chapter: number, ids: string[], out: Stop): Stop {
  if (ids.length === 0) return Object.assign(out, stops.hero);

  const last = ids.length - 1;
  const i = Math.min(Math.floor(chapter), last);
  const j = Math.min(i + 1, last);
  const a = stops[ids[i]] ?? stops.hero;
  const b = stops[ids[j]] ?? a;
  const f = plateau(chapter - i);

  for (const k of KEYS) out[k] = a[k] + (b[k] - a[k]) * f;
  return out;
}

/** Current, smoothed scene state. Written by the Scene, read by its parts. */
export const live: Stop = { ...stops.hero };
