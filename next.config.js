/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "undici": false,
        "net": false,
        "tls": false,
        "fs": false,
        "dns": false,
        "child_process": false,
      };
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['undici', 'firebase'],
  },
};

module.exports = nextConfig;
