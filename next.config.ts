import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "1000mb",
    },
    proxyClientMaxBodySize: "1000mb",
    serverExternalPackages: ["ssh2", "ssh2-sftp-client"],
  },
};

export default nextConfig;
