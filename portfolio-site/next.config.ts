import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "prod-files-secure.s3.us-west-2.amazonaws.com" },
      { hostname: "raw.githubusercontent.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "github.com" },
    ],
  },
};

export default nextConfig;
