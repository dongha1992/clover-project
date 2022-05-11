import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SET_LOGIN_SUCCESS } from '@store/user';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Obj } from '@model/index';

const nameValidator = /^[ㄱ-ㅎ|가-힣|a-z|A-Z]+$/;

interface IAuthObj {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
  token_type: string;
}

const Oauth = () => {
  const kakaoHeader = {
    'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
  };

  const router = useRouter();
  const { code } = router.query;
  const dispatch = useDispatch();

  const onSuccessKakao = async (authObj: IAuthObj) => {
    console.log(authObj, 'authObj');
    window.Kakao.Auth.setAccessToken(authObj.access_token);

    try {
      const data = {
        accessToken: authObj.access_token,
        tokenType: authObj.token_type,
      };

      const result = await axios.post(`${process.env.KAKO_API_URL}/user/v1/signin-kakao`, data);
      console.log(result, 'AFTER SUCCESS');
      if (!nameValidator.test(result.data.user.name) || result.data.user.name.length === 0) {
        alert('[마이페이지 > 회원정보수정]에서 이름을 한글 또는 영문으로 변경해주세요.');
      }

      if (window.Kakao) {
        window.Kakao.cleanup();
      }

      dispatch(SET_LOGIN_SUCCESS(true));
      console.log(result, 'result');
      // 비회원 -> 회원 장바구니 옮기기

      // 쿼리, 쿠키에 따라 페이지 리다이렉트 분기
    } catch (e) {
      console.log(e);
    }
  };

  const initKakaoAuth = async () => {
    try {
      const qs: Obj = {
        grant_type: 'authorization_code',
        client_id: 'afb3a1413cc8d2c864a74358105771a9',
        redirectUri:
          location.hostname === 'localhost' ? 'http://localhost:9009/oauth' : `${process.env.SERVICE_URL}/oauth`,
        code,
      };

      const queryString = Object.keys(qs)
        .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(qs[k]))
        .join('&');

      if (code) {
        const { data } = await axios.post('https://kauth.kakao.com/oauth/token', queryString, {
          headers: kakaoHeader,
        });
        console.log(data, '@@@@');
        onSuccessKakao(data);
      }
    } catch (error) {
      router.replace('/login');
    }
  };

  useEffect(() => {
    initKakaoAuth();
  }, [code]);

  return <div></div>;
};

export default Oauth;
