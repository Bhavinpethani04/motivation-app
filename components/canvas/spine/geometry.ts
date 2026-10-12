import {
  BufferGeometry,
  ConeGeometry,
  CylinderGeometry,
  LatheGeometry,
  TorusGeometry,
  Vector2,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/**
 * A stylised vertebra built from primitives, in a local frame where +Y runs up
 * the spine and +Z points to the front of the body. Body height is 0.6.
 */
export function buildVertebra(): BufferGeometry {
  // Vertebral body: a drum with rounded edges, slightly flattened front-to-back.
  const r = 0.5;
  const h = 0.6;
  const bevel = 0.11;
  const profile: Vector2[] = [new Vector2(0, -h / 2)];
  const steps = 3;
  for (let i = 0; i <= steps; i++) {
    const a = (Math.PI / 2) * (i / steps);
    profile.push(
      new Vector2(r - bevel + Math.sin(a) * bevel, -h / 2 + bevel - Math.cos(a) * bevel),
    );
  }
  for (let i = 0; i <= steps; i++) {
    const a = (Math.PI / 2) * (i / steps);
    profile.push(
      new Vector2(r - bevel + Math.cos(a) * bevel, h / 2 - bevel + Math.sin(a) * bevel),
    );
  }
  profile.push(new Vector2(0, h / 2));

  const body = new LatheGeometry(profile, 20);
  body.scale(1, 1, 0.8);
  body.translate(0, 0, 0.06);

  // Neural arch: a half ring wrapping behind the body.
  const arch = new TorusGeometry(0.33, 0.075, 6, 14, Math.PI);
  arch.rotateX(-Math.PI / 2); // arc now sweeps toward the back
  arch.translate(0, 0, -0.22);

  // Spinous process: points back and slightly down.
  const spine = new ConeGeometry(0.085, 0.5, 6);
  spine.rotateX(-1.91);
  spine.translate(0, -0.08, -0.77);

  // Transverse processes: a short strut on each side.
  const wing = () => new CylinderGeometry(0.045, 0.065, 0.34, 6);
  const left = wing();
  left.rotateZ(Math.PI / 2 + 0.15);
  left.translate(-0.5, 0.02, -0.22);
  const right = wing();
  right.rotateZ(-Math.PI / 2 - 0.15);
  right.translate(0.5, 0.02, -0.22);

  const merged = mergeGeometries([body, arch, spine, left, right]);
  merged.computeBoundingSphere();
  return merged;
}

/** The disc between two vertebrae, centred on the boundary. */
export function buildDisc(): BufferGeometry {
  const disc = new CylinderGeometry(0.46, 0.46, 0.16, 20);
  disc.scale(1, 1, 0.82);
  disc.translate(0, 0, 0.06);
  return disc;
}

/** A tapering wedge for the sacrum, tip pointing down. */
export function buildSacrum(): BufferGeometry {
  const sacrum = new ConeGeometry(0.56, 1.1, 14);
  sacrum.rotateX(Math.PI);
  sacrum.scale(1, 1, 0.55);
  sacrum.translate(0, -0.55, -0.02);
  return sacrum;
}
