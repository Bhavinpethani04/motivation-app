import { MathUtils, Vector3 } from "three";

/** 5 lumbar + 12 thoracic + 7 cervical, bottom to top (L5 ... C1). */
export const VERTEBRAE = 24;
export const SPINE_HEIGHT = 7;

/** Local height of the vertebral body in the unit vertebra geometry. */
const BODY_HEIGHT = 0.6;
/** Spacing between vertebrae as a multiple of body height (room for discs). */
const SPACING = 1.3;

// Vertebrae shrink from the lumbar spine up to the neck.
const sizes = Array.from(
  { length: VERTEBRAE },
  (_, i) => 1.05 - 0.62 * Math.pow(i / (VERTEBRAE - 1), 0.9),
);
const total = sizes.reduce((sum, s) => sum + s, 0);

/** Curve parameter at the boundary below each vertebra (length VERTEBRAE + 1). */
export const bounds: number[] = [0];
sizes.forEach((s) => bounds.push(bounds[bounds.length - 1] + s / total));

/** Curve parameter at the centre of each vertebra. */
export const centers = sizes.map((_, i) => (bounds[i] + bounds[i + 1]) / 2);

/** Uniform instance scale per vertebra. */
export const scales = sizes.map(
  (s) => ((s / total) * SPINE_HEIGHT) / (BODY_HEIGHT * SPACING),
);

/** A slouched spine is compressed; an aligned one stands tall. */
export const heightScale = (posture: number) => 0.82 + 0.18 * posture;

const AMPLITUDE = 0.3;
// Lumbar lordosis (+), thoracic kyphosis (-), cervical lordosis (+).
const sCurve = (u: number) => Math.cos(2 * Math.PI * (u * 0.85 + 0.05));

/**
 * A point on the spine's midline. `u` runs 0 (sacrum) to 1 (skull base).
 * `posture` 0 blends to a C-shaped slouch with the head dropped forward;
 * 1 is the natural S-curve. +Z is anterior (the front of the body).
 *
 * Deliberately a pure function of `u` and `posture`: nothing here depends on
 * the clock, so a specimen that is not moving costs nothing to hold on screen.
 */
export function spinePoint(u: number, posture: number, out: Vector3): Vector3 {
  const natural = AMPLITUDE * (sCurve(u) - sCurve(0));
  const slouch =
    -0.95 * Math.sin(Math.PI * Math.pow(u, 0.85)) + 1.5 * Math.pow(u, 4);

  const z = MathUtils.lerp(slouch, natural, posture);
  // A slouched column is also pulled out of the midline; an aligned one is true.
  const x = (1 - posture) * 0.2 * Math.sin(u * 5);

  return out.set(x, u * SPINE_HEIGHT * heightScale(posture), z);
}
