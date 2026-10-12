"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh, Vector3 } from "three";
import { scroll } from "@/lib/scroll";
import { live } from "../rail";
import { spinePoint } from "./curve";

const _p = new Vector3();
const _d = new Vector3();

/**
 * The oxblood annotation ring a reader draws around the detail that matters.
 * It closes around the skull base as the plate is finished, and breathes with
 * the box-breathing exercise.
 */
export function Annotation() {
  const root = useRef<Group>(null);
  const ring = useRef<Mesh>(null);

  useFrame(({ camera }) => {
    if (!root.current || !ring.current) return;

    const { mark, posture } = live;

    spinePoint(1, posture, _p);
    spinePoint(0.99, posture, _d);
    _d.subVectors(_p, _d).normalize();
    root.current.position.copy(_p).addScaledVector(_d, 0.3);

    const visible = mark > 0.01;
    root.current.visible = visible;
    if (!visible) return;

    ring.current.scale.setScalar(0.5 + 1.15 * mark + 0.3 * scroll.breath);
    ring.current.lookAt(camera.position);
  });

  return (
    <group ref={root} visible={false}>
      <mesh ref={ring}>
          {/* Left open at one end, the way a pen lifts off the paper. */}
          <torusGeometry args={[1, 0.018, 8, 64, Math.PI * 1.82]} />
        <meshBasicMaterial color="#7b2232" toneMapped={false} />
      </mesh>
    </group>
  );
}
