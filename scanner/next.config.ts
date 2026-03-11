import type { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true
});

const nextConfig: NextConfig = {
  basePath: '/scanner',
  reactStrictMode: false,
  turbopack: {},
  async rewrites() {
    return [
      {
        source: '/api-backend/:path*',
        destination: 'http://backend:3001/:path*',
      },
    ]
  },
};

export default withPWA(nextConfig);
