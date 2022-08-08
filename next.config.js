module.exports = () => {
  return {
    images: {
      domains: ['s3.ap-northeast-2.amazonaws.com'],
    },
    env: {
      NEXT_PUBLIC_KAKAO_KEY: process.env.NEXT_PUBLIC_KAKAO_KEY,
      SERVICE_URL: process.env.SERVICE_URL,
      API_URL: process.env.API_URL,
      IMAGE_SERVER_URL: process.env.IMAGE_SERVER_URL,
    },
  };
};
