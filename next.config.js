module.exports = {
  reactStrictMode: false,
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = { fs: false, net: false, tls: false, ...config.resolve.fallback };
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://your-api-server.com/api/:path*", // 실제 API 서버의 주소로 변경
      },
    ];
  },
};
