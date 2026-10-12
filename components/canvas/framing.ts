import { Euler, MathUtils, Vector3 } from "three";
import { scales, spinePoint } from "./spine/curve";

/**
 * Where to place the specimen so it lands where the plate wants it *and* stays
 * on the paper.
 *
 * Positioning by a hand-tuned fraction of the viewport does not survive the
 * rail: the column is rotated, curved and re-posed at every stop, so the same
 * fraction framed it beautifully at one plate and pushed it off the edge at
 * the next. This measures the drawing instead — it projects the curve, finds
 * the band of screen it actually occupies, and solves for the offset that puts
 * that band where it was asked for, pulling it back inside if it would cross
 * the edge.
 */

/** How far the widest vertebra reaches to either side of the midline. */
const LATERAL = Math.max(...scales) * 0.9;

/** Keep the drawing inside this much of the half-width, leaving a margin. */
const EDGE = 0.9;

const SAMPLES = 17;

const _local = new Vector3();
const _rot = new Euler();

export type Framing = {
  posture: number;
  yaw: number;
  tilt: number;
  /** Height the camera is looking at, in world units. */
  focusY: number;
  dist: number;
  /** Vertical field of view, in degrees. */
  fov: number;
  aspect: number;
  /** Where the drawing's centre should sit across the screen, -1 to 1. */
  target: number;
};

/** The x offset to give the specimen's group. */
export function solveShift({
  posture,
  yaw,
  tilt,
  focusY,
  dist,
  fov,
  aspect,
  target,
}: Framing): number {
  const tanHalf = Math.tan(MathUtils.degToRad(fov) / 2);
  _rot.set(0, yaw, tilt);

  let min = Infinity;
  let max = -Infinity;
  let depthSum = 0;
  let kept = 0;

  // Two passes at most: prefer the part of the column that is actually on
  // screen, but if the camera is between vertebrae fall back to all of it.
  for (let pass = 0; pass < 2 && kept === 0; pass++) {
    for (let i = 0; i < SAMPLES; i++) {
      spinePoint(i / (SAMPLES - 1), posture, _local).applyEuler(_rot);

      // The camera sits at (0, focusY, dist) looking down -z, so camera depth
      // is just the gap in z and there is no rotation to undo.
      const depth = dist - _local.z;
      if (depth < 0.1) continue;

      if (pass === 0) {
        const y = (_local.y - focusY) / (depth * tanHalf);
        if (Math.abs(y) > 1.1) continue;
      }

      const x = _local.x / (depth * tanHalf * aspect);
      if (x < min) min = x;
      if (x > max) max = x;
      depthSum += depth;
      kept++;
    }
  }

  if (kept === 0) return 0;

  const depth = depthSum / kept;
  const perUnit = depth * tanHalf * aspect;
  const half = (max - min) / 2 + LATERAL / perUnit;
  const centre = (min + max) / 2;

  // If the drawing is wider than the plate there is nowhere safe to put it, so
  // centre it; otherwise honour the request as far as the margin allows.
  const limit = Math.max(0, EDGE - half);
  const wanted = MathUtils.clamp(target, -limit, limit);

  return (wanted - centre) * perUnit;
}
