/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // We run lint separately in CI; don't let it block dev builds.
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
