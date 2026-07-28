/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@29with/shared"],
  experimental: {
    serverComponentsExternalPackages: ["pdfkit"]
  }
};

export default nextConfig;
