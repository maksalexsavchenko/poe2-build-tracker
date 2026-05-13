import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "web.poecdn.com" },
      { protocol: "https", hostname: "poe2db.tw" },
    ],
  },
};

export default nextConfig;
