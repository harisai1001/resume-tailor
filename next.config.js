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
    disablePostcssPresetEnv: false,
  },
  runtime: 'nodejs',
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@clerk/nextjs'],
  },
};

module.exports = nextConfig; 