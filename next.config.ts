import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Security: Set max request body size
  experimental: {
    // Increased for base64 image uploads (10MB images = ~13.3MB base64)
    // But overall request limit prevents abuse
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
