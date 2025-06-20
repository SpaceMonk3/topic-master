/**
 * Next.js Configuration
 * 
 * Note: This project uses the experimental 'serverComponentsExternalPackages' feature
 * to properly support Firebase and undici in server components.
 * 
 * This is a required configuration for Firebase to work correctly with Next.js 13+
 * and is a recommended approach by the Firebase team until official support is added.
 * 
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
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

// Disable the experimental warnings in production
if (process.env.NODE_ENV === 'production') {
  // This suppresses the warning about experimental features in production
  process.env.NEXT_IGNORE_WARNINGS = '1';
}

module.exports = nextConfig;
