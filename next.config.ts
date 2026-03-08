import type { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
  crossOrigin: "anonymous",
  allowedDevOrigins: ["localhost", "127.0.0.1"],
  images: { remotePatterns: [{ hostname: "lh3.googleusercontent.com" }] },
};

export default config;
