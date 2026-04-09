import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["ssh2", "ssh2-sftp-client"],
  experimental: {
    serverActions: {
      bodySizeLimit: "1000mb",
    },
    proxyClientMaxBodySize: "1000mb",
  },
};

export default nextConfig;
