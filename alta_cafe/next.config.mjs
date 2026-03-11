/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/admin',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
