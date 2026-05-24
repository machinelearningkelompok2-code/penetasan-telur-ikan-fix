import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.103.51.41', '192.168.100.8', '192.168.0.114', 'localhost', '10.93.223.41'],
  async redirects() {
    return [
      {
        source: '/beranda',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
