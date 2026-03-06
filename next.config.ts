import type { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
  crossOrigin: "anonymous",
  images: { remotePatterns: [{ hostname: "lh3.googleusercontent.com" }] },
};

export default config;
