import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: false,
  },
  // Disable Next.js font optimization to avoid build-time fetch
  optimizeFonts: false,

};

export default nextConfig;
