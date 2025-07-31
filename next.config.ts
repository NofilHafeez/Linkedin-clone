import type { NextConfig } from "next";


const nextConfig: NextConfig = {
   images: {
    domains: ['res.cloudinary.com'],
  },
  compiler: {
    removeConsole: false,
  },
};

export default nextConfig;
