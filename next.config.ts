import type { NextConfig } from "next";

/**
 * GitHub Pages serves a project site from `https://<user>.github.io/<repo>/`,
 * so every asset needs that prefix. The workflow sets this from the repo name;
 * locally it stays empty so `next dev` and a plain `next build` still work from
 * the root.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // GitHub Pages has no Node server, so the whole site is prerendered to /out.
  output: "export",
  basePath,
  // Emit `/page/index.html` rather than `/page.html`, which is what a plain
  // static file server expects to find.
  trailingSlash: true,

  // Dev only: let phones and other devices on the home Wi-Fi load the dev
  // server (e.g. http://192.168.68.51:3001). Without this, Next blocks their
  // JavaScript requests with a 403 and the page never starts.
  allowedDevOrigins: ["192.168.68.*"],
};

export default nextConfig;
