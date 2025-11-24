import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias['zod/v3'] = require.resolve('zod');
    config.resolve.alias['zod/v4'] = require.resolve('zod');
    return config;
  },
};

export default nextConfig;
