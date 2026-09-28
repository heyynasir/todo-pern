import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  allowedDevOrigins: ["localhost:3000", "10.232.167.195"],
};

export default nextConfig;
