/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  experimental: { optimizePackageImports: ['framer-motion'] },
};
export default nextConfig;
