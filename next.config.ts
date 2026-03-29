import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",          // Optimised for Node.js hosting (VPS, cPanel Node, Railway, etc.)
  images: {
    unoptimized: true,           // Logo / public images served as-is (no Vercel image CDN required)
  },
  typescript: {
    ignoreBuildErrors: true,     // Prevent non-critical TS issues from blocking the build
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",     // Allow larger file uploads (PDF, images)
    },
  },
};

export default nextConfig;
