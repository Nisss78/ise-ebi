/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@base-ui/react", "@hello-pangea/dnd"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
