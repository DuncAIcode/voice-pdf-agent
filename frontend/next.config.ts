import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://72.60.187.170:8000/:path*",
      },
    ];
  },
};

export default nextConfig;
