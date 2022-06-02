const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextBuildId = require('next-build-id');

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
      API_URL: process.env.API_URL,
    },
    generateEtags: false,
    generateBuildId: () => nextBuildId({ dir: __dirname }),
    assetPrefix: process.env.SERVICE_URL,
    async rewrites() {
      return [
        {
          source: `/_next/:path*`,
          destination: '/_next/:path*',
        },
      ];
    },
  };
};
