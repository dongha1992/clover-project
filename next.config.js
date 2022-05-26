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

// module.exports = withBundleAnalyzer({
//   images: {
//     domains: ['data.0app0.com', 'www.newsworks.co.kr', 's3.ap-northeast-2.amazonaws.com'],
//   },
//   env: {
//     STAGE: process.env.STAGE,
//     NEXT_PUBLIC_KAKAO_KEY: process.env.NEXT_PUBLIC_KAKAO_KEY,
//     SERVICE_URL: process.env.SERVICE_URL,
//   },
// });

module.exports = () => {
  return {
    images: {
      domains: ['data.0app0.com', 'www.newsworks.co.kr', 's3.ap-northeast-2.amazonaws.com'],
    },
    env: {
      STAGE: process.env.STAGE,
      NEXT_PUBLIC_KAKAO_KEY: process.env.NEXT_PUBLIC_KAKAO_KEY,
      SERVICE_URL: process.env.SERVICE_URL,
    },
    generateBuildId: async () => 'constant-build-id',
    trailingSlash: true,
  };
};
