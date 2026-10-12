/**
 * The 3D scene flags readiness on <html data-ready="true"> once it has drawn a
 * few frames. Entrance animations wait for it so they play on a visible page.
 */
export function onReady(callback: () => void): () => void {
  const root = document.documentElement;
  if (root.dataset.ready === "true") {
    callback();
    return () => {};
  }

  const observer = new MutationObserver(() => {
    if (root.dataset.ready === "true") {
      observer.disconnect();
      callback();
    }
  });
  observer.observe(root, { attributes: true, attributeFilter: ["data-ready"] });
  return () => observer.disconnect();
}

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

