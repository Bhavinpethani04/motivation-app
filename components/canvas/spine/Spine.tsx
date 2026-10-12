"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BufferGeometry,
  Color,
  BackSide,
  DynamicDrawUsage,
  InstancedBufferAttribute,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  Quaternion,
  ShaderMaterial,
  Vector3,
} from "three";
import { live } from "../rail";
import { VERTEBRAE, bounds, centers, scales, spinePoint } from "./curve";
import { buildDisc, buildSacrum, buildVertebra } from "./geometry";

const UP = new Vector3(0, 1, 0);
const BOUNDARIES = VERTEBRAE + 1;
/** How far the plate is drawn ahead of the inked edge, in vertebrae. */
const SPREAD = VERTEBRAE + 2;

// Scratch objects, reused every frame to avoid allocations.
const _m = new Matrix4();
const _p = new Vector3();
const _a = new Vector3();
const _b = new Vector3();
const _t = new Vector3();
const _q = new Quaternion();
const _s = new Vector3();
const boundaryPos = Array.from({ length: BOUNDARIES }, () => new Vector3());
const boundaryQuat = Array.from({ length: BOUNDARIES }, () => new Quaternion());

/**
 * Shared vertex stage. Handles instancing by hand (a ShaderMaterial gets the
 * `instanceMatrix` attribute but none of the standard chunks that use it) and
 * carries the per-instance ink level through to the fragment stage.
 */
const vertexCommon = /* glsl */ `
  uniform float uInk;
  uniform float uExpand;
  varying float vInk;
  varying vec3 vNormal;
  varying vec3 vViewPos;

  #ifdef USE_INSTANCING
    attribute float aInk;
  #endif

  void main() {
    vec3 pos = position;
    vec3 nrm = normal;

    #ifdef USE_INSTANCING
      vInk = aInk;
      mat3 rot = mat3(instanceMatrix);
      nrm = rot * nrm;
      pos = (instanceMatrix * vec4(pos, 1.0)).xyz;
    #else
      vInk = uInk;
    #endif

    nrm = normalize(nrm);
    // Inverted-hull outline: push the back faces out along the normal. Zero
    // for the fill pass.
    pos += nrm * uExpand;

    vNormal = normalize(normalMatrix * nrm);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vViewPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

/**
 * A printed plate, not a render: three flat tones for the form, and an ink
 * line wherever the surface turns away from the eye. That second term is what
 * draws the interior edges — an inverted hull only ever gives a silhouette.
 */
const fillFragment = /* glsl */ `
  uniform vec3 uPaper;
  uniform vec3 uDeep;
  uniform vec3 uLine;
  varying float vInk;
  varying vec3 vNormal;
  varying vec3 vViewPos;

  void main() {
    vec3 n = normalize(vNormal);

    // Light from the upper left, as in every anatomical plate ever printed.
    float lambert = dot(n, normalize(vec3(-0.5, 0.8, 0.45)));
    float shade = smoothstep(-0.15, 0.9, lambert);
    float band = step(0.3, shade) * 0.45 + step(0.68, shade) * 0.55;
    vec3 inked = mix(uDeep, uPaper, band);

    float facing = abs(dot(n, normalize(-vViewPos)));
    float edge = smoothstep(0.52, 0.94, 1.0 - facing);
    inked = mix(inked, uLine, edge * 0.92);

    // Before it is inked the bone is a faint pencil ghost on the paper.
    vec3 ghost = mix(vec3(0.98, 0.972, 0.957), inked, 0.3);
    gl_FragColor = vec4(mix(ghost, inked, vInk), 1.0);
  }
`;

const lineFragment = /* glsl */ `
  uniform vec3 uGhostLine;
  uniform vec3 uInkLine;
  varying float vInk;

  void main() {
    gl_FragColor = vec4(mix(uGhostLine, uInkLine, vInk), 1.0);
  }
`;

function fillMaterial(deep: string) {
  return new ShaderMaterial({
    uniforms: {
      uInk: { value: 0 },
      uExpand: { value: 0 },
      uPaper: { value: new Color("#ffffff") },
      uDeep: { value: new Color(deep) },
      uLine: { value: new Color("#1c1a17") },
    },
    vertexShader: vertexCommon,
    fragmentShader: fillFragment,
  });
}

function lineMaterial(thickness: number) {
  return new ShaderMaterial({
    uniforms: {
      uInk: { value: 0 },
      uExpand: { value: thickness },
      uGhostLine: { value: new Color("#ded8cb") },
      uInkLine: { value: new Color("#1c1a17") },
    },
    vertexShader: vertexCommon,
    fragmentShader: lineFragment,
    side: BackSide,
  });
}

/** Adds the per-instance ink attribute the shaders read. */
function withInk(geometry: BufferGeometry, count: number) {
  const attribute = new InstancedBufferAttribute(new Float32Array(count), 1);
  attribute.setUsage(DynamicDrawUsage);
  geometry.setAttribute("aInk", attribute);
}

function createSpine() {
  const bone = buildVertebra();
  const disc = buildDisc();
  // The outline pass needs its own geometry: it carries a different ink
  // attribute buffer and must not share one with the fill.
  const boneLine = bone.clone();
  const discLine = disc.clone();

  withInk(bone, VERTEBRAE);
  withInk(boneLine, VERTEBRAE);
  withInk(disc, VERTEBRAE - 1);
  withInk(discLine, VERTEBRAE - 1);

  return {
    geo: { bone, boneLine, disc, discLine, sacrum: buildSacrum() },
    mat: {
      bone: fillMaterial("#c3b9a4"),
      // Discs read as cartilage: a shade deeper than bone.
      disc: fillMaterial("#9c8f78"),
      boneLine: lineMaterial(0.018),
      discLine: lineMaterial(0.018),
      sacrumLine: lineMaterial(0.018),
    },
  };
}

const inkOf = (mesh: InstancedMesh) =>
  mesh.geometry.getAttribute("aInk") as InstancedBufferAttribute;

/** The specimen: 24 vertebrae, their discs and the sacrum, drawn as a plate. */
export function Spine() {
  const [{ geo, mat }] = useState(createSpine);
  const bone = useRef<InstancedMesh>(null);
  const boneLine = useRef<InstancedMesh>(null);
  const discs = useRef<InstancedMesh>(null);
  const discLine = useRef<InstancedMesh>(null);
  const sacrum = useRef<Mesh>(null);
  const sacrumLine = useRef<Mesh>(null);
  const pose_ = useRef({ posture: Number.NaN, ink: Number.NaN });

  useFrame(() => {
    if (
      !bone.current ||
      !boneLine.current ||
      !discs.current ||
      !discLine.current ||
      !sacrum.current ||
      !sacrumLine.current
    ) {
      return;
    }

    const { posture, ink } = live;
    const reach = ink * SPREAD;

    // The pose is a pure function of posture and ink, so when neither has
    // moved there is nothing to recompute and nothing to re-upload. This is
    // what lets the drawing cost nothing while she is reading.
    const pose = pose_.current;
    if (Math.abs(pose.posture - posture) < 1e-4 && Math.abs(pose.ink - ink) < 1e-4) {
      return;
    }
    pose.posture = posture;
    pose.ink = ink;

    const boneInk = inkOf(bone.current);
    const boneLineInk = inkOf(boneLine.current);
    const discInk = inkOf(discs.current);
    const discLineInk = inkOf(discLine.current);

    // Pose every boundary between vertebrae; the discs sit on these.
    for (let b = 0; b < BOUNDARIES; b++) {
      const u = bounds[b];
      spinePoint(u, posture, boundaryPos[b]);
      spinePoint(Math.min(u + 0.01, 1), posture, _a);
      spinePoint(Math.max(u - 0.01, 0), posture, _b);
      _t.subVectors(_a, _b).normalize();
      boundaryQuat[b].setFromUnitVectors(UP, _t);
    }

    for (let i = 0; i < VERTEBRAE; i++) {
      const u = centers[i];
      spinePoint(u, posture, _p);
      spinePoint(Math.min(u + 0.01, 1), posture, _a);
      spinePoint(Math.max(u - 0.01, 0), posture, _b);
      _t.subVectors(_a, _b).normalize();
      _q.setFromUnitVectors(UP, _t);
      _s.setScalar(scales[i]);
      _m.compose(_p, _q, _s);

      bone.current.setMatrixAt(i, _m);
      boneLine.current.setMatrixAt(i, _m);

      const value = MathUtils.clamp(reach - i, 0, 1);
      boneInk.setX(i, value);
      boneLineInk.setX(i, value);
    }

    for (let d = 0; d < VERTEBRAE - 1; d++) {
      const b = d + 1;
      const s = (scales[d] + scales[b]) / 2;
      _s.set(s, s * (0.55 + 0.45 * posture), s);
      _m.compose(boundaryPos[b], boundaryQuat[b], _s);

      discs.current.setMatrixAt(d, _m);
      discLine.current.setMatrixAt(d, _m);

      const value = MathUtils.clamp(reach - b + 0.5, 0, 1);
      discInk.setX(d, value);
      discLineInk.setX(d, value);
    }

    bone.current.instanceMatrix.needsUpdate = true;
    boneLine.current.instanceMatrix.needsUpdate = true;
    discs.current.instanceMatrix.needsUpdate = true;
    discLine.current.instanceMatrix.needsUpdate = true;
    boneInk.needsUpdate = true;
    boneLineInk.needsUpdate = true;
    discInk.needsUpdate = true;
    discLineInk.needsUpdate = true;

    // The sacrum is a single mesh, so its ink comes from a uniform.
    const base = MathUtils.clamp(reach, 0, 1);
    (sacrum.current.material as ShaderMaterial).uniforms.uInk.value = base;
    (sacrumLine.current.material as ShaderMaterial).uniforms.uInk.value = base;

    for (const node of [sacrum.current, sacrumLine.current]) {
      node.position.copy(boundaryPos[0]);
      node.quaternion.copy(boundaryQuat[0]);
      node.scale.setScalar(scales[0]);
    }
  });

  return (
    <group>
      {/* Outlines draw first so the fills sit inside them. */}
      <instancedMesh
        ref={boneLine}
        args={[geo.boneLine, mat.boneLine, VERTEBRAE]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={discLine}
        args={[geo.discLine, mat.discLine, VERTEBRAE - 1]}
        frustumCulled={false}
      />
      <mesh
        ref={sacrumLine}
        geometry={geo.sacrum}
        material={mat.sacrumLine}
        frustumCulled={false}
      />

      <instancedMesh ref={bone} args={[geo.bone, mat.bone, VERTEBRAE]} frustumCulled={false} />
      <instancedMesh
        ref={discs}
        args={[geo.disc, mat.disc, VERTEBRAE - 1]}
        frustumCulled={false}
      />
      <mesh ref={sacrum} geometry={geo.sacrum} material={mat.bone} frustumCulled={false} />
    </group>
  );
}
