import type { NextConfig } from "next";
import path from "path";

const appRoot = path.join(__dirname);

const nextConfig: NextConfig = {
  turbopack: {
    root: appRoot,
  },
  outputFileTracingRoot: appRoot,
};

export default nextConfig;
