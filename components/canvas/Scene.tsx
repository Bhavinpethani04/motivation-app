"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, type Group, type PerspectiveCamera } from "three";
import { scroll } from "@/lib/scroll";
import { solveShift } from "./framing";
import { KEYS, live, sampleRail, stops, type Stop } from "./rail";
import { SPINE_HEIGHT, heightScale } from "./spine/curve";
import { Annotation } from "./spine/Annotation";
import { Spine } from "./spine/Spine";

const target: Stop = { ...stops.hero };

/**
 * The plate. Each frame it reads the fractional chapter from `lib/scroll`,
 * samples the rail (components/canvas/rail.ts), eases the live state toward it
 * and applies that to the camera, the specimen and the paper.
 *
 * There is no lighting rig and no post-processing: the drawing is shaded by
 * its own shader, which keeps the page fast and the lines crisp.
 */
export function Scene() {
  const invalidate = useThree((state) => state.invalidate);
  const group = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const settled = useRef(false);
  const frames = useRef(0);

  // The canvas renders on demand, so everything that can change the picture
  // has to ask for a frame: scrolling, the pointer, and the breathing ring.
  useEffect(() => {
    scroll.invalidate = invalidate;
    invalidate();

    // The browser restores a scroll position, and fonts reflow the page, after
    // this component has already mounted — and neither goes through Lenis, so
    // neither asks for a frame. Without these the drawing is simply missing
    // when the page is reloaded part-way down. A handful of frames over the
    // first second costs nothing and removes the whole class of bug.
    const wake = () => invalidate();
    const settleFrames = [80, 300, 900].map((delay) => window.setTimeout(wake, delay));
    document.fonts.ready.then(wake);

    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
      invalidate();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      settleFrames.forEach(window.clearTimeout);
      window.removeEventListener("pointermove", onMove);
      scroll.invalidate = null;
    };
  }, [invalidate]);

  useFrame(({ camera, size }, delta) => {
    const dt = Math.min(delta, 0.05);
    sampleRail(scroll.chapter, scroll.ids, target);

    // Ease toward the target; snap on the first frame (e.g. a mid-page reload).
    //
    // Damping only ever approaches its target, so without a snap the scene
    // would keep asking for frames long after the movement stopped being
    // visible. The tolerance scales with the value because `dist` and `fov`
    // are an order of magnitude larger than the 0-1 parameters.
    let moving = false;
    for (const key of KEYS) {
      if (!settled.current) {
        live[key] = target[key];
        continue;
      }
      const next = MathUtils.damp(live[key], target[key], key === "ink" ? 2.2 : 3.2, dt);
      const tolerance = 1e-3 * Math.max(1, Math.abs(target[key]));
      if (Math.abs(target[key] - next) < tolerance) {
        live[key] = target[key];
      } else {
        live[key] = next;
        moving = true;
      }
    }
    settled.current = true;

    const aspect = size.width / size.height;
    const portrait = aspect < 0.85;
    const cam = camera as PerspectiveCamera;
    const focusY = live.focus * SPINE_HEIGHT * heightScale(live.posture);
    const dist = live.dist * (portrait ? 1.5 : 1);

    cam.position.set(0, focusY, dist);
    cam.lookAt(0, focusY, 0);
    if (Math.abs(cam.fov - live.fov) > 0.01) {
      cam.fov = live.fov;
      cam.updateProjectionMatrix();
    }

    // Gentle pointer parallax, as if turning the page a little.
    const p = pointer.current;
    const follow = scroll.reduceMotion ? 0 : 1;
    const restX = MathUtils.damp(p.sx, p.x * follow, 3, dt);
    const restY = MathUtils.damp(p.sy, p.y * follow, 3, dt);
    p.sx = Math.abs(p.x * follow - restX) < 1e-3 ? p.x * follow : restX;
    p.sy = Math.abs(p.y * follow - restY) < 1e-3 ? p.y * follow : restY;
    if (p.sx !== p.x * follow || p.sy !== p.y * follow) moving = true;

    if (group.current) {
      const yaw = live.yaw + p.sx * 0.16;
      const tilt = live.tilt + p.sy * 0.02;
      group.current.rotation.y = yaw;
      group.current.rotation.z = tilt;

      // Measure where the drawing actually lands and solve for the offset,
      // rather than trusting a fixed fraction of the viewport. On a narrow
      // screen the text sits over the drawing anyway, so pull it toward the
      // middle instead of jamming it against the edge.
      group.current.position.x = solveShift({
        posture: live.posture,
        yaw,
        tilt,
        focusY,
        dist,
        fov: live.fov,
        aspect,
        target: live.shift * (portrait ? 0.3 : 1),
      });
    }

    // Keep asking for frames while anything is still easing into place.
    if (moving || scroll.breath > 0) invalidate();

    // Shaders compile over the first frames; lift the cover once they're drawn.
    if (frames.current < 3) {
      frames.current += 1;
      invalidate();
      if (frames.current === 3) document.documentElement.dataset.ready = "true";
    }
  });

  return (
    <>
      <color attach="background" args={["#faf8f4"]} />
      <group ref={group}>
        <Spine />
        <Annotation />
      </group>
    </>
  );
}
