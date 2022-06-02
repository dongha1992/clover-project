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
    }
  };
};
