module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://server:8080/:path*", // Proxy to Backend
      },
    ];
  },
};
