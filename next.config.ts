import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse"],
  transpilePackages: [
    'micromark',
    'micromark-util-symbol',
    'unified',
    'remark-parse',
    'remark-rehype'
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
