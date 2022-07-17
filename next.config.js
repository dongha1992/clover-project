module.exports = () => {
  return {
    images: {
      domains: [
        'data.0app0.com',
        'www.newsworks.co.kr',
        's3.ap-northeast-2.amazonaws.com',
        'freshcode-clover.s3.ap-northeast-2.amazonaws.com',
        'image-dev.freshcode.me',
      ],
    },
    env: {
      STAGE: process.env.STAGE,
      NEXT_PUBLIC_KAKAO_KEY: process.env.NEXT_PUBLIC_KAKAO_KEY,
      SERVICE_URL: process.env.SERVICE_URL,
      API_URL: process.env.API_URL,
      IMAGE_S3_URL: process.env.IMAGE_S3_URL,
      REVIEW_IMAGE_URL: process.env.REVIEW_IMAGE_URL,
    },
  };
};
