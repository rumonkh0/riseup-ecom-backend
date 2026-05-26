import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: "/home/rumon/.next-ecom-frontend",
  allowedDevOrigins: ["unreportorial-arthrosporic-lanny.ngrok-free.dev"],
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    webpackMemoryOptimizations: true,
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  // Disable source maps in development to save additional memory
  productionBrowserSourceMaps: false,
};

export default nextConfig;
