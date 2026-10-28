import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  // Blog images are copied to public/blogposts during the build and served as
  // static assets. They are not needed in the serverless blog function bundle.
  outputFileTracingExcludes: {
    '/blog': ['./src/content/blogposts/**/*.png', './src/content/blogposts/**/*.jpg', './src/content/blogposts/**/*.jpeg'],
    '/blog/[slug]': ['./src/content/blogposts/**/*.png', './src/content/blogposts/**/*.jpg', './src/content/blogposts/**/*.jpeg'],
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
        protocol: "https",
        hostname: "dummyimage.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/blogposts/:slug/:image',
        destination: '/blogposts/:slug/:image',
      },
    ]
  },
  // Add assetPrefix to handle static assets correctly
  assetPrefix: '',
};

export default nextConfig;
