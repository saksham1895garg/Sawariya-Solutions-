/** @type {import('next').NextConfig} */
const nextConfig = {
  // Security: Remove X-Powered-By header
  poweredByHeader: false,

  // Enable React strict mode for catching potential bugs
  reactStrictMode: true,

  // Image optimization for external domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
