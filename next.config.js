module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*", // API 경로
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, POST, PUT, DELETE, OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
        ],
      },
    ];
  },
  reactStrictMode: false,
  webpack(config, { isServer, webpack }) {
    if (!isServer) config.resolve.fallback = { fs: false, net: false, tls: false, ...config.resolve.fallback };
    return config;
  },
};
