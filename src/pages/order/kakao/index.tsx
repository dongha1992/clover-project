import router from 'next/router';
import React, { useEffect } from 'react';
import { postTossApproveApi, postKakaoApproveApi } from '@api/order';
import { getCookie } from '@utils/common';
import { useRouter } from 'next/router';

interface IProps {
  orderId: number;
  pgToken: string;
}
const KakaoPgPage = () => {
  const { pg_token: pgToken, orderId } = router.query;
  console.log(router.query, 'router.query');
  const checkKakaoPg = async () => {
    try {
      const kakaoTid = getCookie({ name: 'kakao-tid-clover' });
      console.log(kakaoTid, 'kakaoTid');

      if (pgToken && kakaoTid) {
        const reqBody = { pgToken: pgToken.toString(), tid: kakaoTid.toString() };
        console.log(pgToken, kakaoTid, '!@#!@#!@#!');
        const { data } = await postKakaoApproveApi({ orderId: Number(orderId), data: reqBody });
        console.log(data, 'AFTER KAKAO PAY');
        if (data.code === 200) {
          router.push(`/order/finish?orderId=${orderId}`);
        } else {
          alert(data.message);
        }
      } else {
        // 카카오 결제 에러
      }
    } catch (error: any) {
      console.error(error);
      alert(error);
    }
  };
  useEffect(() => {
    console.log(router.query.pg_token);
    if (router.query.pg_token) {
      checkKakaoPg();
    }
  }, [router.query.pg_token]);
  return <div></div>;
};

export default KakaoPgPage;
