import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@': path.join(dirname, 'src'),
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      '@/*': './src/*',
    },
  },
  async redirects() {
    return [{ source: '/', destination: '/ar', permanent: false }];
  },
};

export default nextConfig;
