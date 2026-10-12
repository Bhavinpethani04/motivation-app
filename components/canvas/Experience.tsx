"use client";

import { Component, useEffect, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";

/**
 * If WebGL is unavailable the canvas throws. Fall back to the plain page
 * (it still reads well) instead of taking the whole plate down.
 */
class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    document.documentElement.dataset.ready = "true";
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * The single, persistent WebGL canvas holding the drawing. It is fixed behind
 * the page and ignores pointer events so the text on top stays selectable.
 */
export function Experience() {
  const [created, setCreated] = useState(false);

  // Never leave the cover up forever if the scene is slow or fails.
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      document.documentElement.dataset.ready = "true";
    }, 12000);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 bg-paper transition-opacity duration-700"
      style={{ opacity: created ? 1 : 0 }}
      aria-hidden="true"
    >
      <CanvasBoundary>
        <Canvas
          dpr={[1, 1.5]}
          // Flat line art on paper: nothing to redraw until something moves.
          frameloop="demand"
          camera={{ position: [0, 3, 12], fov: 34, near: 0.1, far: 100 }}
          // Line art lives or dies on clean edges, and there is no post
          // chain to do the smoothing now.
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={() => setCreated(true)}
        >
          <Scene />
        </Canvas>
      </CanvasBoundary>
    </div>
  );
}
