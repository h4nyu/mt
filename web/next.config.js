module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://api:3000/:path*", // Proxy to Backend
      },
    ];
  },
};
