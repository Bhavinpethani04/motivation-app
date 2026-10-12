import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev only: let phones and other devices on the home Wi-Fi load the dev
  // server (e.g. http://192.168.68.50:3000). Without this, Next blocks their
  // JavaScript requests with a 403 and the page never starts.
  allowedDevOrigins: ["192.168.68.*"],
};

export default nextConfig;
