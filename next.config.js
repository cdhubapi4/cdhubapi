module.exports = {
  reactStrictMode: false,
  webpack(config, { isServer, webpack }) {

    if (!isServer) config.resolve.fallback = { fs: false, net: false, tls: false, ...config.resolve.fallback };
    return config;
  },
};
