// Built with ❤️ by Siddhant Gujrathi — ZeroCodeFolio (licensed)
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/c2lkZGhhbnQ=',
        destination: '/dashboard',
      },
      {
        source: '/c2lkZGhhbnQ=/:path*',
        destination: '/dashboard/:path*',
      },
    ];
  },
  serverActions: {
    bodySizeLimit: '10mb',
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
