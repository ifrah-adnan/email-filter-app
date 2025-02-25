import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      tls: false,
      net: false,
      fs: false,
      dns: false,
      child_process: false,
      http2: false,
    };
    return config;
  },
};

export default nextConfig;
