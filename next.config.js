/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['@clerk/nextjs'],
  },
  // Disable static optimization for pages that use dynamic features
  output: 'standalone',
  // Configure runtime
  runtime: 'nodejs',
  // Disable static page generation for dynamic routes
  unstable_runtimeJS: true,
  // Configure page extensions
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
};

module.exports = nextConfig; 