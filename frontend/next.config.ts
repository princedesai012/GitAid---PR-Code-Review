import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    appDir: "src/app", // 👈 tells Next where your App Router folder is
  },
};

export default nextConfig;
