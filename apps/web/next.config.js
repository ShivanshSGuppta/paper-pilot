const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@vedaai/shared"],
  outputFileTracingRoot: path.join(__dirname, "../.."),
  images: {
    remotePatterns: []
  }
};

module.exports = nextConfig;
