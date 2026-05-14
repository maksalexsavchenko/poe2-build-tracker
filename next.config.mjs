/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/favicon.svg" }];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "web.poecdn.com" },
      { protocol: "https", hostname: "poe2db.tw" },
      { protocol: "https", hostname: "cdn.poe2db.tw" },
    ],
  },
};

export default nextConfig;
