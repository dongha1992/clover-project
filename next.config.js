const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// module.exports = {
//   async rewrites() {
//     return [
//       {
//         source: '/:path*',
//         destination: `https://clover-service-api-dev.freshcode.me/:path*`,
//       },
//     ];
//   },
// };

module.exports = withBundleAnalyzer({
  images: {
    domains: ['data.0app0.com', 'www.newsworks.co.kr'],
  },
});
