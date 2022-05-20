import router from 'next/router';
import React, { useEffect } from 'react';
import { postTossApproveApi, postKakaoApproveApi } from '@api/order';
import { getCookie } from '@utils/common';

interface IProps {
  orderId: number;
  pgToken: string;
}
const KakaoPgPage = ({ orderId, pgToken }: IProps) => {
  const checkKakaoPg = async () => {
    try {
      console.log(orderId, pgToken, 'orderId, pgToken, pg, payToken in fnc');

      const kakaoTid = getCookie({ name: 'kakao-tid-clover' });
      if (pgToken && kakaoTid) {
        const reqBody = { pgToken, tid: kakaoTid };
        console.log(pgToken, kakaoTid, '!@#!@#!@#!');
        const { data } = await postKakaoApproveApi({ orderId, data: reqBody });
        console.log(data, 'AFTER KAKAO PAY');
        if (data.code === 200) {
          router.push(`/order/finish?orderId=${orderId}`);
        }
      } else {
        // 카카오 결제 에러
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    checkKakaoPg();
  }, []);
  return <div></div>;
};

export async function getServerSideProps(context: any) {
  const { orderId, pg_token } = context.query;

  return {
    props: { orderId: +orderId, pgToken: pg_token },
  };
}

export default KakaoPgPage;
