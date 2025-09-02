import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bytescale.mobbin.com',
      },
      {
        protocol: 'https',
        hostname: 'media.nngroup.com',
      },
    ],
  },
};

export default nextConfig;
