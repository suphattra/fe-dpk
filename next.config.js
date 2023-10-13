/** @type {import('next').NextConfig} */
const nextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/dpk/:path*',
  //       // destination: 'http://localhost:5000/:path*',
  //       destination: 'https://nx-customer-iot.n-digitaltech.com/api/:path*',
  //       // destination: 'https://e-tracking.n-digitaltech.com/dow/api/:path*',
  //       basePath: false,
  //     },
  //   ]
  // },
  reactStrictMode: false,
  swcMinify: true,
  env: {
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },
}

module.exports = nextConfig
